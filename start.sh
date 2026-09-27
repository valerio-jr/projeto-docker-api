#!/bin/bash

# 🚀 Script de Inicialização - Projeto Docker API
# Este script automatiza o processo de setup e inicialização

set -e

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Funções
print_header() {
    echo -e "\n${BLUE}═══════════════════════════════════════${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════${NC}\n"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Verificar pré-requisitos
check_prerequisites() {
    print_header "VERIFICANDO PRÉ-REQUISITOS"
    
    # Verificar Docker
    if ! command -v docker &> /dev/null; then
        print_error "Docker não encontrado. Instale em https://www.docker.com"
        exit 1
    fi
    print_success "Docker encontrado: $(docker --version)"
    
    # Verificar Docker Compose
    if ! command -v docker compose &> /dev/null; then
        print_error "Docker Compose não encontrado"
        exit 1
    fi
    print_success "Docker Compose encontrado: $(docker compose version)"
    
    # Verificar Git
    if ! command -v git &> /dev/null; then
        print_warning "Git não encontrado (opcional)"
    else
        print_success "Git encontrado: $(git --version)"
    fi
}

# Configurar .env
setup_env() {
    print_header "CONFIGURANDO VARIÁVEIS DE AMBIENTE"
    
    if [ ! -f .env ]; then
        if [ -f .env.example ]; then
            cp .env.example .env
            print_success "Arquivo .env criado a partir de .env.example"
        else
            print_error "Arquivo .env.example não encontrado"
            exit 1
        fi
    else
        print_success "Arquivo .env já existe"
    fi
    
    # Exibir configurações
    echo -e "${YELLOW}Configurações carregadas:${NC}"
    grep -E "^[A-Z_]+=" .env | sed 's/^/  /'
}

# Inicializar Docker Compose
start_docker() {
    print_header "INICIANDO CONTAINERS DOCKER"
    
    echo "Buildando imagens e iniciando containers..."
    docker compose up -d --build
    
    print_success "Containers iniciados"
    
    # Aguardar banco estar pronto
    echo -e "\n${YELLOW}Aguardando PostgreSQL ficar pronto...${NC}"
    for i in {1..30}; do
        if docker compose exec postgres pg_isready -U prisma &> /dev/null; then
            print_success "PostgreSQL está pronto!"
            break
        fi
        echo -n "."
        sleep 1
    done
}

# Testar conexão
test_connection() {
    print_header "TESTANDO CONEXÃO"
    
    sleep 2
    
    # Teste 1: Health check
    echo "Testando health check..."
    response=$(curl -s http://localhost:3000/health 2>/dev/null || echo "{}")
    if echo "$response" | grep -q "running"; then
        print_success "API está respondendo"
    else
        print_warning "API pode ainda estar iniciando..."
    fi
    
    # Teste 2: Conexão com banco
    echo "Testando conexão com banco..."
    response=$(curl -s http://localhost:3000/db-test 2>/dev/null || echo "{}")
    if echo "$response" | grep -q "OK"; then
        print_success "Conexão com PostgreSQL funcionando"
    else
        print_warning "Banco pode ainda estar inicializando..."
    fi
}

# Exibir informações
show_info() {
    print_header "PROJETO INICIADO COM SUCESSO! 🎉"
    
    echo -e "${GREEN}Endpoints disponíveis:${NC}"
    echo "  🏥 Health Check: http://localhost:3000/health"
    echo "  🗄️  Teste BD: http://localhost:3000/db-test"
    echo "  👥 CRUD Usuários: http://localhost:3000/api/users"
    
    echo -e "\n${GREEN}Comandos úteis:${NC}"
    echo "  Ver logs:       docker compose logs -f api"
    echo "  Parar:          docker compose down"
    echo "  Parar (reset):  docker compose down -v"
    echo "  Prisma Studio: docker compose exec api npm run db:studio"
    
    echo -e "\n${GREEN}Próximas ações:${NC}"
    echo "  1. Leia o EXECUTION_GUIDE.md para testes detalhados"
    echo "  2. Importe collection.json no Postman"
    echo "  3. Teste os endpoints"
    echo "  4. Poste no fórum da UNITINS"
    
    echo -e "\n${BLUE}═══════════════════════════════════════${NC}\n"
}

# Executar fluxo principal
main() {
    check_prerequisites
    setup_env
    start_docker
    sleep 3
    test_connection
    show_info
}

# Executar
main "$@"
