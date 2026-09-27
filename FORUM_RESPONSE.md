# Resposta: Atividade Docker + PostgreSQL

**Link do repositório:** https://github.com/valerio-jr/projeto-docker-api

---

## Implementação

Consegui implementar todos os requisitos da atividade. O projeto foi desenvolvido usando Node.js com Express, Prisma ORM e PostgreSQL, tudo containerizado com Docker e Docker Compose.

### Estrutura

O projeto está organizado em:

- **src/**: Código da aplicação (server, controllers, routes)
- **prisma/**: Schema do banco de dados com modelo User
- **Docker**: Dockerfile com multi-stage build e docker-compose.yml
- **Documentação**: README, guias de execução e setup

### Como Funciona

A aplicação expõe uma API REST com endpoints para CRUD de usuários:
- POST /api/users - Criar usuário
- GET /api/users - Listar todos
- GET /api/users/:id - Obter um usuário
- PUT /api/users/:id - Atualizar
- DELETE /api/users/:id - Deletar

Os dados são persistidos em PostgreSQL rodando em um container Docker. A comunicação entre API e banco acontece através de uma rede Docker privada.

---

## Dificuldades Encontradas

### 1. Healthcheck e Timing

A maior dificuldade foi lidar com o tempo de startup do PostgreSQL. No começo, a API tentava se conectar antes do banco estar pronto, causando crashes aleatórios. 

Resolvi isso implementando um healthcheck no docker-compose.yml que verifica se o PostgreSQL está pronto antes de iniciar a API. Usei `condition: service_healthy` no depends_on para forçar essa ordem.

### 2. Dockerfile Multi-stage Build

Levar a imagem Docker para produção foi desafiador. A primeira versão gerava uma imagem gigante (1.2GB) com todas as dependências de desenvolvimento.

Aprendi a usar multi-stage build, separando a compilação TypeScript da execução final. A imagem final fica bem menor e mais segura, sem dev dependencies desnecessárias.

### 3. Comunicação entre Containers

Inicialmente tentei usar `localhost:5432` na string de conexão, mas isso não funcionava dentro do Docker. Cada container tem seu próprio localhost.

Descobri que o Docker Compose permite usar o nome do serviço como hostname. Então em vez de localhost, uso `postgres` (que é o nome do serviço no docker-compose.yml).

### 4. Volumes e Persistência

Não entendia a diferença entre volumes nomeados e bind mounts, e como fazer os dados persistirem.

Configurei um volume nomeado (`postgres_data`) para o PostgreSQL. Isso garante que os dados não sejam perdidos quando paro os containers. Também usei bind mounts para desenvolvimento (mapeando a pasta local para dentro do container).

### 5. Variáveis de Ambiente

Tive problemas com variáveis espalhadas em vários arquivos (.env, Dockerfile, docker-compose). Mudanças em um lugar não refletiam em outros.

Resolvi centralizando tudo em um único `.env`, que o docker-compose.yml lê e passa para os containers como variáveis de ambiente.

---

## Como Resolvi

A solução envolveu estudar a documentação do Docker Compose, entender o ciclo de vida dos containers e aprender quando cada recurso (volumes, networks, healthcheck) faz sentido usar.

Implementei:
- Healthcheck no PostgreSQL para garantir disponibilidade
- Multi-stage build no Dockerfile para otimizar
- Network Docker privada para comunicação segura
- Volumes nomeados para persistência
- Variáveis de ambiente centralizadas

Tudo isso resultou em uma aplicação robusta, que pode ser iniciada com um comando simples (`docker compose up -d`) e que funciona de forma consistente.

---

## Aprendizados

Esse projeto me mostrou que Docker é muito mais que simplesmente "colocar em um container". É pensar em:

- Orchestração de múltiplos serviços
- Persistência de dados
- Comunicação segura entre componentes
- Otimização de imagens
- Reprodutibilidade do ambiente

Agora consigo visualizar melhor como aplicações reais são estruturadas em produção, onde Docker é o padrão.

---

## Arquivos do Projeto

O repositório contém:
- Código fonte completo
- Dockerfile e docker-compose.yml
- Collection do Postman para testar
- Documentação (README, guias de execução)
- Scripts de automação

Tudo está bem organizado e pode ser clonado e rodado em qualquer máquina que tenha Docker instalado.

---

Agradeço antecipadamente por qualquer feedback. Estou aberto a sugestões de melhoria!
