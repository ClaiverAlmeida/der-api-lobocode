// prisma/seed.ts - Seed para schema DEPARTAMENTO ESTADUAL DE RODOVIAS
import {
  PrismaClient,
  Roles,
  UserStatus,
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
  await seedUsers(company.id);
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

async function seedUsers(companyId: string) {
  // Admin (acesso total) - sem campos de funcionário
  const adminData = {
    name: 'Admin DEPARTAMENTO ESTADUAL DE RODOVIAS',
    email: 'admin@departamento-estadual-rodovias.com',
    login: 'admin@departamento-estadual-rodovias.com',
    password: 'Admin123@Senha',
    role: Roles.ADMIN,
    status: UserStatus.ACTIVE,
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
}

runSeed()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
