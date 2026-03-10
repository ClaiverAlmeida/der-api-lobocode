const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔌 Testando conexão com o banco...');
    await prisma.$connect();
    console.log('✅ Conectado com sucesso!');
    
    console.log('📊 Verificando dados existentes...');
    const userCount = await prisma.user.count();
    console.log(`👥 Usuários: ${userCount}`);
    
    const companyCount = await prisma.company.count();
    console.log(`🏢 Empresas: ${companyCount}`);
    
    const postCount = await prisma.post.count();
    console.log(`🏪 Postos: ${postCount}`);
    
    const vehicleCount = await prisma.vehicle.count();
    console.log(`🚗 Veículos: ${vehicleCount}`);
    
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
