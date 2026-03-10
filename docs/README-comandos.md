# 🧪 Comandos Úteis – LoboCode Backend (NestJS + Prisma + Docker)

Comandos para rodar o ambiente de desenvolvimento utilizando  
**NestJS 11**, **Prisma ORM** e **Docker**.

## 🐳 Comandos Docker

```bash
# 🟢 Sobe todos os containers definidos no docker-compose em background
docker compose up -d
# 🔴 Para e remove todos os containers, redes e volumes definidos
docker compose down
# 🔁 Reconstrói as imagens e recria os containers (ideal após mudanças no Dockerfile)
docker compose up --build --force-recreate -d
# 📜 Mostra os logs em tempo real dos containers
docker compose logs -f
```

## 🧬 Comandos Prisma

```bash
# ⚙️ Gera os artefatos do Prisma a partir do schema (necessário após alterações)
npx prisma generate
# 📦 Cria e aplica uma nova migration com nome definido
npx prisma migrate dev --name nome-da-migration
# 🧪 Envia o schema para o banco sem criar uma migration (útil em ambiente de desenvolvimento)
npx prisma db push
# 👁️ Abre a interface visual do banco de dados
npx prisma studio
```

## 🚀 Comandos NestJS

```bash
npm run start:dev
```
