// prisma/seed.ts - Seed para schema DEPARTAMENTO ESTADUAL DE RODOVIAS
import {
  PermissionType,
  PrismaClient,
  Roles,
  UserStatus,
  ClientStatus,
  StockMovementType,
  UserContractType,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

/** Aguarda um pouco para o banco estar estável após migrate (evita "Response from the Engine was empty") */
function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function runSeed() {
  await delay(1500);
  const company = await seedCompany();
  await seedStock(company.id);
  await seedUsers(company.id);
  await seedClients(company.id);
}

async function seedCompany() {
  const cnpj = '26.332.986/0001-90';
  const name = 'DEPARTAMENTO ESTADUAL DE RODOVIAS';
  const exists = await prisma.company.findUnique({ where: { cnpj } });
  if (exists) return exists;

  const company = await prisma.company.create({
    data: {
      name,
      cnpj,
      contactName: 'Contato DEPARTAMENTO ESTADUAL DE RODOVIAS',
      contactEmail: 'contato@departamento-estadual-rodovias.com.br',
    },
  });

  console.log('[Seed] Empresa DEPARTAMENTO ESTADUAL DE RODOVIAS criada');
  return company;
}

async function seedStock(companyId: string) {
  const exists = await prisma.stock.findUnique({
    where: { companyId },
  });
  if (exists) return;

  await prisma.stock.create({
    data: {
      companyId,
    },
  });
  console.log('[Seed] Estoque inicial criado');
}

async function seedUsers(companyId: string) {
  // Admin (acesso total) - sem campos de funcionário
  const adminData = {
    name: 'Admin DEPARTAMENTO ESTADUAL DE RODOVIAS',
    login: 'admin@departamento-estadual-rodovias.com',
    password: 'Admin123@Senha',
    email: 'admin@departamento-estadual-rodovias.com',
    role: Roles.ADMIN,
    status: UserStatus.ACTIVE,
    cpf: '000.000.000-00',
    phone: '(11) 99999-9999',
  };

  const existsAdmin = await prisma.user.findUnique({
    where: { email: adminData.email },
  });

  if (!existsAdmin) {
    const hashedPassword = await bcrypt.hash(adminData.password, 10);
    await prisma.user.create({
      data: {
        ...adminData,
        company: { connect: { id: companyId } },
        password: hashedPassword,
      },
    });
    console.log(
      '[Seed] Usuário admin criado (admin@departamento-estadual-rodovias.com / Admin123@Senha)',
    );
  }

  // Comercial - com campos de funcionário
  const comercialData = {
    name: 'Carlos Comercial',
    login: 'comercial@departamento-estadual-rodovias.com',
    password: 'Comercial123@Senha',
    email: 'comercial@departamento-estadual-rodovias.com',
    role: Roles.FISCAL_CAMPO,
    status: UserStatus.ACTIVE,
    cpf: '111.111.111-11',
    phone: '(11) 98888-8888',
    birthDate: '1985-03-15T00:00:00.000Z',
    hireDate: '2019-06-01T00:00:00.000Z',
    salary: 4500,
    contractType: UserContractType.CLT,
    benefits: ['Vale-transporte', 'Vale-alimentação', 'Plano de saúde'],
    address: {
      street: 'Av. Paulista',
      number: '1000',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01310-100',
      complement: 'Sala 501',
    },
    documents: {
      cpf: '111.111.111-11',
      rg: '11.111.111-1',
      birthCertificate: 'BC111111',
      driverLicense: null,
      socialSecurityCard: 'PIS111111',
    },
  };

  const existsComercial = await prisma.user.findUnique({
    where: { email: comercialData.email },
  });

  if (!existsComercial) {
    const hashedPassword = await bcrypt.hash(comercialData.password, 10);
    await prisma.user.create({
      data: {
        ...comercialData,
        company: { connect: { id: companyId } },
        password: hashedPassword,
        permissions: {
          create: [
            { permissionType: PermissionType.CLIENTS },
            { permissionType: PermissionType.APPOINTMENTS },
            { permissionType: PermissionType.SERVICE },
          ],
        },
      },
    });
    console.log('[Seed] Usuário comercial criado');
  }

  // Logístico - com campos de funcionário
  const logisticaData = {
    name: 'Raquel Logística',
    login: 'raquel@departamento-estadual-rodovias.com',
    password: 'raquel123',
    email: 'raquel@departamento-estadual-rodovias.com',
    role: Roles.OPERADOR,
    status: UserStatus.ACTIVE,
    cpf: '333.333.333-33',
    phone: '(11) 97777-7777',
    birthDate: '1992-08-20T00:00:00.000Z',
    hireDate: '2020-02-10T00:00:00.000Z',
    salary: 4200,
    contractType: UserContractType.CLT,
    benefits: ['Vale-transporte', 'Vale-alimentação'],
    address: {
      street: 'Rua do Comércio',
      number: '200',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01020-000',
      complement: null,
    },
    documents: {
      cpf: '333.333.333-33',
      rg: '33.333.333-3',
      birthCertificate: 'BC333333',
      driverLicense: null,
      socialSecurityCard: 'PIS333333',
    },
  };

  const existsLogistica = await prisma.user.findUnique({
    where: { email: logisticaData.email },
  });

  if (!existsLogistica) {
    const hashedPassword = await bcrypt.hash(logisticaData.password, 10);
    await prisma.user.create({
      data: {
        ...logisticaData,
        company: { connect: { id: companyId } },
        password: hashedPassword,
        permissions: {
          create: [
            { permissionType: PermissionType.STOCK },
            { permissionType: PermissionType.CONTAINERS },
            { permissionType: PermissionType.ROUTES },
          ],
        },
      },
    });
    console.log('[Seed] Usuário logístico criado');
  }

  // Motorista - com campos de funcionário
  const motoristaData = {
    name: 'João Motorista',
    login: 'motorista@departamento-estadual-rodovias.com',
    password: 'Motorista123@Senha',
    email: 'motorista@departamento-estadual-rodovias.com',
    role: Roles.INSPETOR_VIA,
    status: UserStatus.ACTIVE,
    cpf: '222.222.222-22',
    phone: '(11) 96666-6666',
    birthDate: '1988-11-05T00:00:00.000Z',
    hireDate: '2021-01-15T00:00:00.000Z',
    salary: 3800,
    contractType: UserContractType.CLT,
    benefits: ['Vale-transporte', 'Vale-refeição'],
    address: {
      street: 'Rua dos Motoristas',
      number: '50',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '03010-000',
      complement: null,
    },
    documents: {
      cpf: '222.222.222-22',
      rg: '22.222.222-2',
      birthCertificate: 'BC222222',
      driverLicense: 'CNH222222',
      socialSecurityCard: 'PIS222222',
    },
  };

  const existsMotorista = await prisma.user.findUnique({
    where: { email: motoristaData.email },
  });

  if (!existsMotorista) {
    const hashedPassword = await bcrypt.hash(motoristaData.password, 10);
    await prisma.user.create({
      data: {
        ...motoristaData,
        company: { connect: { id: companyId } },
        password: hashedPassword,
        permissions: {
          create: [
            { permissionType: PermissionType.INSPETOR_VIA },
            { permissionType: PermissionType.APPOINTMENTS },
          ],
        },
      },
    });
    console.log('[Seed] Usuário motorista criado');
  }
}

async function seedClients(companyId: string) {
  const adminEmail = 'admin@departamento-estadual-rodovias.com';
  const adminUser = await prisma.user.findFirst({
    where: {
      email: adminEmail,
    },
    select: {
      id: true,
    },
  });
  if (!adminUser) {
    throw new Error(
      `[Seed] Usuário admin não encontrado para vincular cliente (${adminEmail})`,
    );
  }

  // Cliente de teste para verificação no frontend
  const clientData = {
    companyId,
    usaName: 'João Silva',
    usaCpf: '123.456.789-00',
    usaPhone: '+1 (305) 555-0123',
    brazilName: 'Maria Silva',
    brazilCpf: '987.654.321-00',
    brazilPhone: '+55 (11) 98765-4321',
    usaAddress: {
      rua: '123 Main Street',
      numero: '456',
      cidade: 'Miami',
      estado: 'FL',
      zipCode: '33101',
      complemento: 'Apt 101',
    },
    brazilAddress: {
      rua: 'Rua das Flores, 789',
      numero: '789',
      cidade: 'São Paulo',
      estado: 'SP',
      cep: '01234-567',
      complemento: 'Apt 101',
    },
    userId: adminUser.id,
    status: ClientStatus.ACTIVE,
  };
  const existsClient = await prisma.client.findFirst({
    where: {
      companyId,
      usaCpf: clientData.usaCpf,
    },
  });

  if (!existsClient) {
    await prisma.client.create({
      data: clientData,
    });
    console.log('[Seed] Cliente de teste criado:', clientData.usaName);
  } else {
    console.log('[Seed] Cliente de teste já existe');
  }
}

runSeed()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
