import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import * as Minio from 'minio';

export interface FileInfo {
  id: string;
  originalName: string;
  fileName: string;
  type: string;
  size: number;
  mimeType: string;
  url: string;
  companyId: string | null;
  uploadedBy: string | null;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

@Injectable()
export class FilesService {
  private readonly logger = new Logger(FilesService.name);
  private readonly minioClient: Minio.Client;
  private readonly bucketName = 'departamento-estadual-rodovias-files';

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    // Em Docker, usar nome do serviço 'minio'. Em desenvolvimento local, usar 'localhost'
    // MINIO_HOST pode ser 'minio' (Docker) ou 'localhost' (desenvolvimento)
    const minioHost = this.configService.get<string>('MINIO_HOST', 'minio');
    // Converter porta para número (pode vir como string do env)
    const minioPort = parseInt(
      this.configService.get<string>('MINIO_PORT', '19000'),
      10,
    ); // departamento-estadual-rodovias: bloco 19xxx
    // Converter useSSL para boolean (pode vir como string do env)
    const useSSLStr = this.configService.get<string>('MINIO_USE_SSL', 'false');
    const useSSL = useSSLStr === 'true';

    this.minioClient = new Minio.Client({
      endPoint: minioHost,
      port: minioPort,
      useSSL: useSSL,
      accessKey: this.configService.get<string>('MINIO_ROOT_USER', 'admin'),
      secretKey: this.configService.get<string>(
        'MINIO_ROOT_PASSWORD',
        'password123',
      ),
    });

    this.initializeBucket();
  }

  private async initializeBucket(): Promise<void> {
    try {
      const bucketExists = await this.minioClient.bucketExists(this.bucketName);
      if (!bucketExists) {
        await this.minioClient.makeBucket(this.bucketName, 'us-east-1');
        this.logger.log(`Bucket '${this.bucketName}' criado com sucesso`);
      }

      // Configurar política de acesso público para leitura
      const publicReadPolicy = {
        Version: '2012-10-17',
        Statement: [
          {
            Effect: 'Allow',
            Principal: { AWS: ['*'] },
            Action: ['s3:GetObject'],
            Resource: [`arn:aws:s3:::${this.bucketName}/*`],
          },
        ],
      };

      await this.minioClient.setBucketPolicy(
        this.bucketName,
        JSON.stringify(publicReadPolicy),
      );
      this.logger.log(
        `Política de acesso público configurada para bucket '${this.bucketName}'`,
      );
    } catch (error) {
      this.logger.error(`Erro ao inicializar bucket: ${error.message}`);
    }
  }

  async uploadFile(
    file: any,
    type: string,
    companyId?: string,
    uploadedBy?: string,
    description?: string,
  ): Promise<FileInfo> {
    try {
      // Gerar nome único para o arquivo
      const fileName = `${Date.now()}-${file.originalname}`;
      const folder = companyId ? `companies/${companyId}` : 'public';
      const fullPath = `${folder}/${fileName}`;

      // Upload para MinIO
      await this.minioClient.putObject(
        this.bucketName,
        fullPath,
        file.buffer,
        file.size,
        { 'Content-Type': file.mimetype },
      );

      // URL pública
      const minioEndpoint = this.configService.get<string>(
        'MINIO_ENDPOINT',
        'http://localhost:19000',
      ); // departamento-estadual-rodovias: bloco 19xxx
      const url = `${minioEndpoint}/${this.bucketName}/${fullPath}`;

      // Salvar no banco
      const fileRecord = await this.prisma.file.create({
        data: {
          originalName: file.originalname,
          fileName: fullPath,
          type: type as any,
          size: file.size,
          mimeType: file.mimetype,
          url,
          companyId,
          uploadedBy,
          description,
        },
      });

      this.logger.log(`Arquivo enviado com sucesso: ${fileRecord.id}`);
      return fileRecord;
    } catch (error) {
      this.logger.error(`Erro ao fazer upload: ${error.message}`);
      throw new Error(`Falha no upload: ${error.message}`);
    }
  }

  async getAllFiles(
    page = 1,
    limit = 20,
    companyId?: string,
  ): Promise<{ files: FileInfo[]; total: number }> {
    try {
      const skip = (page - 1) * limit;
      const where = companyId ? { companyId } : {};

      const [files, total] = await Promise.all([
        this.prisma.file.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        this.prisma.file.count({ where }),
      ]);

      return { files, total };
    } catch (error) {
      this.logger.error(`Erro ao buscar arquivos: ${error.message}`);
      throw error;
    }
  }

  async getFileById(id: string): Promise<FileInfo> {
    try {
      const file = await this.prisma.file.findUnique({
        where: { id },
      });

      if (!file) {
        throw new Error('Arquivo não encontrado');
      }

      return file;
    } catch (error) {
      this.logger.error(`Erro ao buscar arquivo: ${error.message}`);
      throw error;
    }
  }

  async deleteFile(id: string): Promise<void> {
    try {
      const file = await this.prisma.file.findUnique({
        where: { id },
      });

      if (!file) {
        throw new Error('Arquivo não encontrado');
      }

      // Deletar do MinIO
      await this.minioClient.removeObject(this.bucketName, file.fileName);

      // Deletar do banco
      await this.prisma.file.delete({
        where: { id },
      });

      this.logger.log(`Arquivo deletado: ${id}`);
    } catch (error) {
      this.logger.error(`Erro ao deletar arquivo: ${error.message}`);
      throw error;
    }
  }
}
