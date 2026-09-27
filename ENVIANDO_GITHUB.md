# Enviando para GitHub

## Criar Repositório

1. Acesse https://github.com/new
2. Preencha:
   - **Repository name:** `projeto-docker-api`
   - **Description:** `API Node.js com PostgreSQL e Docker`
   - **Visibility:** Public (para compartilhar no fórum)
3. **NÃO** marque "Initialize this repository with README, .gitignore, or license" (já temos)
4. Clique em "Create repository"

Você receberá um link como:
```
https://github.com/seu-usuario/projeto-docker-api.git
```

## Windows PowerShell

### 1. Navegar para o Projeto

```powershell
cd Desktop
Expand-Archive -Path projeto-docker-api.zip -DestinationPath .
cd projeto-docker-api
```

### 2. Configurar Git (Primeira Vez)

```powershell
git config --global user.name "Seu Nome"
git config --global user.email "seu-email@github.com"
```

### 3. Conectar ao Repositório

```powershell
git remote add origin https://github.com/seu-usuario/projeto-docker-api.git
```

### 4. Renomear Branch

```powershell
git branch -M main
```

### 5. Fazer Push

```powershell
git push -u origin main
```

Se pedir autenticação:
- Se estiver com GitHub CLI instalado, segue automaticamente
- Senão, use um token pessoal:
  1. GitHub → Settings → Developer Settings → Personal access tokens
  2. Gere um novo token
  3. Use como senha

## Linux/Mac Terminal

### 1. Navegar para o Projeto

```bash
unzip projeto-docker-api.zip
cd projeto-docker-api
```

### 2. Configurar Git (Primeira Vez)

```bash
git config --global user.name "Seu Nome"
git config --global user.email "seu-email@github.com"
```

### 3. Conectar ao Repositório

```bash
git remote add origin https://github.com/seu-usuario/projeto-docker-api.git
```

### 4. Renomear Branch

```bash
git branch -M main
```

### 5. Fazer Push

```bash
git push -u origin main
```

## Verificar

Acesse seu repositório em:
```
https://github.com/seu-usuario/projeto-docker-api
```

Deve aparecer:
- Todos os arquivos listados
- README.md renderizado
- Branch "main" selecionado

## Erros Comuns

### "fatal: not a git repository"

Você não está na pasta do projeto. Verifique:
```bash
pwd  # Linux/Mac
cd   # Windows (mostra pasta atual)
```

Se não tiver `.git`, faça:
```bash
git init
git add .
git commit -m "Initial commit"
```

### "fatal: 'origin' does not appear to be a 'git' repository"

O remote não foi adicionado. Faça:
```bash
git remote add origin https://github.com/seu-usuario/projeto-docker-api.git
```

### "Permission denied (publickey)"

SSH não está configurado. Use HTTPS em vez disso:
```bash
git remote set-url origin https://github.com/seu-usuario/projeto-docker-api.git
```

### "Please make sure you have the correct access rights"

Gere um token pessoal e use como senha.

---

Pronto! Seu projeto está no GitHub e pode ser compartilhado.
