# Deploy no Coolify

Este projeto pode ser publicado no Coolify usando três recursos separados:

1. MySQL 8 como Database.
2. API Node.js como Application via Dockerfile.
3. Web React/Vite como Application via Dockerfile.

## 1. Banco MySQL

Crie um recurso:

```txt
New Resource > Database > MySQL
```

Sugestão:

```txt
Database: heroes_factory
User: heroes
Password: gere uma senha forte
```

Depois copie a connection string interna do banco para usar na API.

Exemplo:

```txt
DATABASE_URL=mysql://heroes:SENHA@mysql-host-interno:3306/heroes_factory
```

## 2. API

Crie uma Application usando o repositório GitHub:

```txt
jeanasilva/heroes-factory
```

Configurações:

```txt
Build Pack: Dockerfile
Base Directory: /
Dockerfile Location: apps/api/Dockerfile
Port Exposes: 3333
```

Variáveis:

```txt
NODE_ENV=production
API_PORT=3333
API_HOST=0.0.0.0
FRONTEND_URL=https://heroes.seudominio.com
DATABASE_URL=mysql://heroes:SENHA@mysql-host-interno:3306/heroes_factory
```

A API roda migrations automaticamente antes de iniciar:

```bash
npx prisma migrate deploy --schema apps/api/prisma/schema.prisma
```

Teste:

```txt
https://api-heroes.seudominio.com/health
```

Resposta esperada:

```json
{
  "status": "ok"
}
```

## 3. Web

Crie outra Application usando o mesmo repositório:

```txt
jeanasilva/heroes-factory
```

Configurações:

```txt
Build Pack: Dockerfile
Base Directory: /
Dockerfile Location: apps/web/Dockerfile
Port Exposes: 80
```

Variáveis:

```txt
VITE_API_URL=https://api-heroes.seudominio.com
```

A variável `VITE_API_URL` precisa estar disponível no build, pois o Vite injeta esse valor durante a geração do front.

## Ordem recomendada

```txt
1. Criar MySQL
2. Criar API
3. Testar /health
4. Criar Web
5. Testar CRUD completo
```
