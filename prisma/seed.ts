// prisma/seed.ts - Seed para schema DEPARTAMENTO ESTADUAL DE RODOVIAS
import { PrismaClient, Roles, UserStatus } from '@prisma/client';
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
  await seedWorkOrderColunms(company.id);
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

  const c2cData = {
    name: 'C2C DEPARTAMENTO ESTADUAL DE RODOVIAS',
    email: 'c2c@departamento-estadual-rodovias.com',
    login: 'c2c@departamento-estadual-rodovias.com',
    password: 'C2C123@Senha',
    role: Roles.C2C,
    status: UserStatus.ACTIVE,
    phone: '(11) 99999-9999',
  };

  const existsC2C = await prisma.user.findUnique({
    where: { email: c2cData.email },
  });

  if (!existsC2C) {
    const hashedPassword = await bcrypt.hash(c2cData.password, 10);
    await prisma.user.create({
      data: {
        ...c2cData,
        company: { connect: { id: companyId } },
        password: hashedPassword,
      },
    });
    console.log(
      '[Seed] Usuário C2C criado (c2c@departamento-estadual-rodovias.com / C2C123@Senha)',
    );
  }

  const fieldTeamData = {
    name: 'Equipe de Campo DEPARTAMENTO ESTADUAL DE RODOVIAS',
    email: 'field-team@departamento-estadual-rodovias.com',
    login: 'field-team@departamento-estadual-rodovias.com',
    password: 'FieldTeam123@Senha',
    role: Roles.FIELD_TEAM,
    status: UserStatus.ACTIVE,
    phone: '(11) 99999-9999',
  };

  const existsFieldTeam = await prisma.user.findUnique({
    where: { email: fieldTeamData.email },
  });

  if (!existsFieldTeam) {
    const hashedPassword = await bcrypt.hash(fieldTeamData.password, 10);
    await prisma.user.create({
      data: {
        ...fieldTeamData,
        company: { connect: { id: companyId } },
        password: hashedPassword,
      },
    });
    console.log(
      '[Seed] Usuário Equipe de Campo criado (field-team@departamento-estadual-rodovias.com / FieldTeam123@Senha)',
    );
  }
}

async function seedWorkOrderColunms(companyId: string) {
  const workOrderColumns = [
    {
      name: 'A Fazer',
      color: '#6b7280',
      sortOrder: 0,
    },
    {
      name: 'Em Progresso',
      color: '#3b82f6',
      sortOrder: 1,
    },
    {
      name: 'Pausada',
      color: '#eab308',
      sortOrder: 2,
    },
    {
      name: 'Cancelada',
      color: '#ef4444',
      sortOrder: 3,
    },
    {
      name: 'Concluído',
      color: '#10b981',
      sortOrder: 4,
    },
  ];

  const exists = await prisma.workOrderColumn.findMany({
    where: {
      name: { in: workOrderColumns.map((column) => column.name) },
      sortOrder: { in: workOrderColumns.map((column) => column.sortOrder) },
      companyId,
    },
  });
  if (exists.length === workOrderColumns.length) return;

  await prisma.workOrderColumn.createMany({
    data: workOrderColumns.map((column) => ({
      ...column,
      companyId,
      regionalId: null,
    })),
  });
}

runSeed()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
