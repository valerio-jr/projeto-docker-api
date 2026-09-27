# Projeto Docker API

API Node.js com PostgreSQL rodando em Docker Compose. Implementação de uma atividade prática sobre containerização e orquestração de serviços.

## Stack

- Node.js 18 (Alpine)
- Express 4.18
- Prisma ORM 5.7.1
- PostgreSQL 16 (Alpine)
- TypeScript 5.2
- Docker & Docker Compose

## Estrutura

```
projeto-docker-api/
├── src/
│   ├── server.ts
│   ├── controllers/usersController.ts
│   └── routes/users.ts
├── prisma/
│   └── schema.prisma
├── Dockerfile
├── docker-compose.yml
├── package.json
├── .env
├── .env.example
└── .gitignore
```

## Iniciando

### Pré-requisitos

- Docker instalado
- Docker Compose instalado

### Passos

1. Clone ou extraia o projeto:

```bash
# Windows
cd Desktop
Expand-Archive -Path projeto-docker-api.zip -DestinationPath .
cd projeto-docker-api

# Linux/Mac
unzip projeto-docker-api.zip
cd projeto-docker-api
```

2. Inicie os containers:

```bash
docker compose up -d
```

3. Teste a conexão:

```bash
curl http://localhost:3000/db-test
```

## Endpoints

- **POST /api/users** - Criar usuário
- **GET /api/users** - Listar todos
- **GET /api/users/:id** - Obter um
- **PUT /api/users/:id** - Atualizar
- **DELETE /api/users/:id** - Deletar

## Exemplo de Uso

### Criar um Usuário

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "name": "João Silva",
    "age": 25
  }'
```

### Listar Usuários

```bash
curl http://localhost:3000/api/users
```

### Testar com Postman

Importe o arquivo `collection.json` no Postman para testes gráficos.

## Documentação

- **COMO_USAR.md** - Guia completo de uso
- **ENVIANDO_GITHUB.md** - Como fazer push ao GitHub
- **FORUM_RESPONSE.md** - Resposta para o fórum

## Docker Compose

O arquivo `docker-compose.yml` define:

- **PostgreSQL**: Container do banco de dados
  - Volume nomeado para persistência
  - Healthcheck para validar disponibilidade
  
- **API**: Container da aplicação Node.js
  - Depends_on com service_healthy para aguardar banco
  - Volume local para desenvolvimento (hot reload)
  - Network privada para comunicação

- **Network**: Bridge network para comunicação segura
- **Volumes**: Persistência de dados

## Parar

```bash
docker compose down
```

Para remover tudo incluindo dados:

```bash
docker compose down -v
```

## Banco de Dados

### Modelo User

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  age       Int?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Inspecionar com Prisma Studio

```bash
docker compose exec api npm run db:studio
```

### Inspecionar com PostgreSQL CLI

```bash
docker compose exec postgres psql -U prisma -d projeto_db
```

## Troubleshooting

### Erro "Bind for 0.0.0.0:5432 failed"

Porta 5432 já está em uso. Edite `.env`:
```
DB_PORT=5433
```

E reinicie:
```bash
docker compose down
docker compose up -d
```

### Erro "Connection refused"

PostgreSQL pode estar demorando. Aguarde alguns segundos:
```bash
docker compose logs postgres
```

### Erro de compilação TypeScript

Limpe e reconstrua:
```bash
docker compose down
docker compose up -d --build
```

## Variáveis de Ambiente

Arquivo `.env`:
```
DB_USER=prisma
DB_PASSWORD=prisma123
DB_NAME=projeto_db
DB_PORT=5432
API_PORT=3000
NODE_ENV=development
DATABASE_URL=postgresql://prisma:prisma123@postgres:5432/projeto_db
```

---

Para mais detalhes, veja os arquivos de documentação inclusos no projeto.
