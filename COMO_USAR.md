# Como Usar o Projeto

## Pré-requisitos

Você precisa ter instalado:
- Docker
- Docker Compose
- Git (opcional, mas recomendado)

Verifique:
```bash
docker --version
docker compose version
```

## Iniciando

### 1. Extrair o Projeto

**Windows:**
```powershell
cd Desktop
Expand-Archive -Path projeto-docker-api.zip -DestinationPath .
cd projeto-docker-api
```

**Linux/Mac:**
```bash
unzip projeto-docker-api.zip
cd projeto-docker-api
```

### 2. Configurar Variáveis de Ambiente

O arquivo `.env` já vem pronto com as variáveis necessárias:
```
DB_USER=prisma
DB_PASSWORD=prisma123
DB_NAME=projeto_db
DB_PORT=5432
API_PORT=3000
NODE_ENV=development
```

Se quiser alterar algo, edite o arquivo `.env`.

### 3. Iniciar Docker Compose

```bash
docker compose up -d
```

Isso vai:
1. Buildar a imagem Docker da API
2. Iniciar o container do PostgreSQL
3. Iniciar o container da API
4. Criar a rede Docker entre eles
5. Configurar os volumes

Aguarde alguns segundos enquanto o PostgreSQL inicia.

### 4. Verificar Status

```bash
docker compose ps
```

Deve aparecer:
- `projeto_postgres_db` - Status: Up (healthy)
- `projeto_api` - Status: Up

## Testando

### Health Check

```bash
curl http://localhost:3000/health
```

Resposta esperada:
```json
{
  "status": "API is running"
}
```

### Testar Conexão com Banco

```bash
curl http://localhost:3000/db-test
```

Resposta esperada:
```json
{
  "message": "✅ Conexão com banco de dados OK!"
}
```

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

Resposta esperada (status 201):
```json
{
  "message": "✅ Usuário criado com sucesso",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "joao@example.com",
    "name": "João Silva",
    "age": 25,
    "createdAt": "2026-09-27T23:30:00.000Z",
    "updatedAt": "2026-09-27T23:30:00.000Z"
  }
}
```

Guarde o `id` para usar nos próximos testes.

### Listar Usuários

```bash
curl http://localhost:3000/api/users
```

### Obter Um Usuário

```bash
curl http://localhost:3000/api/users/{id}
```

Substitua `{id}` pelo ID de um usuário.

### Atualizar Usuário

```bash
curl -X PUT http://localhost:3000/api/users/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva Atualizado",
    "age": 26
  }'
```

### Deletar Usuário

```bash
curl -X DELETE http://localhost:3000/api/users/{id}
```

## Usando Postman

Importe o arquivo `collection.json` no Postman:

1. Abra Postman
2. Clique em "Import"
3. Selecione `collection.json`
4. Todos os endpoints estarão disponíveis para testar graficamente

## Inspetar Banco de Dados

### Usando Prisma Studio

```bash
docker compose exec api npm run db:studio
```

Abrirá uma interface web em http://localhost:5555 onde pode visualizar e editar dados do banco.

### Usando CLI do PostgreSQL

```bash
docker compose exec postgres psql -U prisma -d projeto_db
```

Dentro do PostgreSQL:
```sql
\dt                    -- Listar tabelas
\d users               -- Ver estrutura da tabela
SELECT * FROM users;   -- Listar usuários
\q                     -- Sair
```

## Parar a Aplicação

```bash
docker compose down
```

Isso para os containers mas mantém os dados (volumes).

## Remover Tudo

Se quiser limpar tudo, incluindo dados:

```bash
docker compose down -v
```

Isso remove containers e volumes.

## Troubleshooting

### Erro: "Bind for 0.0.0.0:5432 failed"

Significa que a porta 5432 já está em uso. Edite `.env` e mude `DB_PORT` para outra porta (por exemplo, 5433).

### Erro: "Connection refused"

O PostgreSQL pode estar demorando para iniciar. Aguarde alguns segundos e tente novamente:

```bash
docker compose logs postgres
```

### Erro: "No such container"

Verifique se os containers estão rodando:

```bash
docker compose ps
```

Se não estiverem, execute `docker compose up -d` novamente.

## Arquivos Importantes

- `docker-compose.yml` - Configuração dos containers
- `Dockerfile` - Definição da imagem da API
- `prisma/schema.prisma` - Schema do banco de dados
- `.env` - Variáveis de ambiente
- `src/` - Código fonte da API
- `collection.json` - Collection do Postman

---

Qualquer dúvida, consulte o README.md para mais detalhes sobre a arquitetura do projeto.
