## Convenção de portas – DER API

Para evitar conflito com o projeto Time da Sorte (que já usa as portas-base), este projeto usa o próximo bloco iniciando em `x11`.

- **Backend/API (NestJS)**  
  - Este projeto: **3011**  
  - Endpoint local: `http://localhost:3011/health`

- **Frontend (DER App – Vite dev)**  
  - Este projeto (dev): **3111**

- **Banco de dados (PostgreSQL)**  
  - Este projeto: **3211 → 5432**  
  - Conexão externa (pgAdmin):  
    - Host: `localhost`  
    - Porta: `3211`

- **Storage de arquivos (MinIO)**  
  - API MinIO: **3311 → 9000**  
  - Console MinIO: **3312 → 9001**  
  - Endpoint backend: `MINIO_ENDPOINT=http://localhost:3311`

- **Redis (cache/filas)**  
  - Este projeto: **3911 → 6379**

### Resumo rápido (DER)

- API: `http://localhost:3011`  
- Frontend (dev): `http://localhost:3111`  
- Postgres: `localhost:3211`  
- MinIO API: `http://localhost:3311`  
- MinIO Console: `http://localhost:3312`  
- Redis: `localhost:3911`

