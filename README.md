# Hero Factory

[![CI](https://github.com/jeanasilva/heroes-factory/actions/workflows/ci.yml/badge.svg)](https://github.com/jeanasilva/heroes-factory/actions/workflows/ci.yml)

Aplicação full stack para cadastro e gestão de heróis, desenvolvida como entrega do [desafio técnico Hero Factory (Pixfy)](https://github.com/pixfy/heroes-factory).

O foco da implementação foi entregar um CRUD completo com regras de negócio explícitas, API organizada em camadas, interface fluida e caminho claro para deploy em produção via Coolify.

**Repositório:** [github.com/jeanasilva/heroes-factory](https://github.com/jeanasilva/heroes-factory)  
**Prazo do teste:** 24/06/2026

---

## O que o projeto faz

A aplicação permite **criar, listar, visualizar, editar, desativar e reativar** heróis. A listagem suporta busca por nome ou apelido, paginação e ordenação do mais recente para o mais antigo. Heróis inativos permanecem no banco (soft delete) e podem ser reativados, mas não editados.

Não há autenticação — conforme especificado no desafio.

---

## Stack tecnológica

Versões extraídas do `package.json` raiz e dos workspaces (`apps/api`, `apps/web`).

| Camada | Tecnologia | Versão |
| --- | --- | --- |
| Runtime | Node.js | **22** (Alpine nos Dockerfiles; CI usa `node-version: 22`) |
| Linguagem | TypeScript | **5.7.2** |
| Monorepo | npm workspaces | **1.0.0** |
| Front-end | React | **18.3.1** |
| Bundler | Vite | **6.0.7** |
| Estilo | Tailwind CSS | **3.4.17** |
| UI | Radix UI + padrão shadcn/ui | Radix **1.x / 2.x** |
| Estado assíncrono | TanStack Query | **5.64.1** |
| Formulários | React Hook Form + Zod | **7.54.2** / **3.24.1** |
| HTTP client | Axios | **1.7.9** |
| Toasts | Sonner | **1.7.1** |
| Back-end | Express | **4.21.2** |
| ORM | Prisma | **6.2.1** |
| Banco | MySQL | **8.0** (imagem Docker) |
| Validação API | Zod | **3.24.1** |
| Testes | Vitest | **2.1.8** |
| Lint | ESLint | **9.17.0** |
| Servidor estático (prod) | nginx | **1.27-alpine** |
| Orquestração local | Docker Compose | v2+ |

---

## Arquitetura

### Monorepo

```
heroes-factory/
├── apps/
│   ├── api/          # API REST (Node + Express + Prisma)
│   └── web/          # SPA React (Vite)
├── .github/workflows/
│   └── ci.yml        # lint, typecheck, test, build
├── docker-compose.yml          # MySQL local (dev)
├── docker-compose.prod.yml     # stack completa (referência Coolify)
└── package.json                # scripts raiz (dev, build, test…)
```

Dois workspaces npm (`apps/*`) compartilham dependências na raiz. Scripts como `npm run dev` sobem API e Web em paralelo via `concurrently`.

### Camadas da API

A API segue uma separação inspirada em Clean Architecture, mantendo regras de negócio fora do Express:

```
apps/api/src/
├── domain/           # Entidades e erros de domínio
├── application/      # Use cases + contratos de repositório
├── infra/            # Prisma, mappers, implementação do repositório
└── interfaces/http/  # Rotas, controllers, validators, presenters, middlewares
```

**Fluxo de uma requisição:** rota → controller → use case → repositório (Prisma) → presenter → JSON.

Os use cases são testados com um repositório em memória, sem depender do MySQL. Testes HTTP usam Supertest com a mesma factory de rotas.

### Front-end

SPA React com TanStack Query para cache e invalidação da listagem após mutações. Formulários validados com Zod; drawers (Sheet) substituem modais para criar, editar, visualizar e confirmar ações.

---

## Funcionalidades implementadas

### API

- CRUD RESTful de heróis
- Soft delete (`is_active = false`) e reativação
- Listagem paginada, busca por `name`/`nickname`, ordenação por `created_at` DESC
- Validação de entrada com Zod
- Mensagens de erro em português
- Datas serializadas em UTC (`YYYY-MM-DD HH:mm:ss`)
- Health check em `/health`
- Migrations automáticas no startup do container (produção)

### Web

- Listagem em grade (5 colunas em telas grandes)
- Busca com debounce
- Paginação (10 itens por página)
- Drawers para criar, editar, detalhes e confirmação de ativar/desativar
- Heróis inativos exibidos em cinza; edição bloqueada na UI
- Loading states, skeleton, splash inicial e banner informativo
- Toasts de sucesso e erro mapeados por código da API

### Infra / DevOps

- Docker Compose para MySQL local
- Dockerfiles multi-stage para API e Web
- `docker-compose.prod.yml` espelhando layout Coolify
- GitHub Actions: lint, typecheck, testes e build

---

## Pré-requisitos

- **Node.js 22+** e **npm 10+**
- **Docker** e **Docker Compose** (para MySQL local)
- **Git**

Para deploy no Coolify: servidor com Coolify instalado, repositório Git conectado e domínios/SSL configurados.

---

## Instalação (ambiente local)

### 1. Clonar o repositório

```bash
git clone https://github.com/jeanasilva/heroes-factory.git
cd heroes-factory
```

### 2. Variáveis de ambiente

```bash
cp .env.example .env
cp .env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

Os valores padrão do `.env.example` funcionam para desenvolvimento local.

### 3. Instalar dependências

```bash
npm install
```

### 4. Subir o MySQL

```bash
docker compose up -d
```

> **Porta 3307 no host:** o `docker-compose.yml` expõe MySQL na porta **3307** (mapeamento `3307:3306`) para evitar conflito com instalações locais de MySQL na porta padrão 3306. A `DATABASE_URL` usa `localhost:3307`. Dentro da rede Docker (produção/Coolify), a porta interna continua sendo **3306**.

Aguarde o container ficar healthy:

```bash
docker compose ps
```

### 5. Migrations e seed (opcional)

```bash
npm run prisma:migrate -w @heroes-factory/api
npm run prisma:seed -w @heroes-factory/api   # opcional — dados de exemplo
```

### 6. Rodar em desenvolvimento

```bash
npm run dev
```

| Serviço | URL |
| --- | --- |
| Front-end | http://localhost:5173 |
| API | http://localhost:3333 |
| Health check | http://localhost:3333/health |

---

## Variáveis de ambiente

### Desenvolvimento local

| Variável | Onde | Descrição |
| --- | --- | --- |
| `DATABASE_URL` | API | Connection string MySQL. Local: `mysql://heroes:heroes_password@localhost:3307/heroes_factory` |
| `API_PORT` | API | Porta da API (padrão: `3333`) |
| `API_HOST` | API | Host de bind (padrão: `0.0.0.0`) |
| `NODE_ENV` | API | `development`, `test` ou `production` |
| `FRONTEND_URL` | API | Origem permitida no CORS (local: `http://localhost:5173`) |
| `VITE_API_URL` | Web | URL base da API consumida pelo front (local: `http://localhost:3333`) |

A API valida todas as variáveis com Zod na inicialização (`apps/api/src/config/env.ts`). Valores inválidos impedem o boot.

### Produção (Coolify)

| Variável | Recurso | Momento |
| --- | --- | --- |
| `DATABASE_URL` | API | Runtime |
| `FRONTEND_URL` | API (CORS) | Runtime |
| `API_PORT` | API | Runtime (`3333`) |
| `NODE_ENV` | API | Runtime (`production`) |
| `VITE_API_URL` | Web | **Build time** — exige rebuild se mudar |

Consulte `.env.example` na raiz para um checklist comentado de produção.

---

## Scripts disponíveis

Na raiz do monorepo:

| Script | Descrição |
| --- | --- |
| `npm run dev` | Sobe API + Web em paralelo |
| `npm run build` | Build de todos os workspaces |
| `npm run lint` | ESLint em API e Web |
| `npm run typecheck` | Verificação TypeScript |
| `npm run test` | Testes em todos os workspaces |
| `npm run format` | Prettier em todo o projeto |

Scripts específicos da API (`-w @heroes-factory/api`):

| Script | Descrição |
| --- | --- |
| `npm run dev -w @heroes-factory/api` | API com hot reload (tsx) |
| `npm run prisma:migrate -w @heroes-factory/api` | Migrations em dev |
| `npm run prisma:deploy -w @heroes-factory/api` | Migrations em produção |
| `npm run prisma:seed -w @heroes-factory/api` | Seed de dados |
| `npm run test -w @heroes-factory/api` | Testes unitários e HTTP |

---

## Testes

A API possui **12 testes** cobrindo use cases (repositório em memória), presenter (formato UTC das datas) e fluxo HTTP (criar → buscar → desativar → reativar, 404 em PT).

```bash
# Todos os workspaces
npm run test

# Apenas API
npm run test -w @heroes-factory/api

# Watch mode (API)
npm run test:watch -w @heroes-factory/api
```

O front-end ainda não possui testes automatizados (`passWithNoTests` no workspace web).

---

## Deploy no Coolify

O monorepo está preparado para **três recursos separados** no Coolify: MySQL, API e Web. Cada application usa o mesmo repositório Git, com Dockerfiles em `apps/api` e `apps/web`.

### Testar stack de produção localmente

```bash
docker compose -f docker-compose.prod.yml up --build
```

| Serviço | URL local |
| --- | --- |
| Web | http://localhost:8080 |
| API | http://localhost:3333 |
| Health | http://localhost:3333/health |

### Passo a passo no Coolify

#### 1. MySQL (Database)

1. `New Resource` → `Database` → **MySQL**
2. Configure:

| Campo | Valor sugerido |
| --- | --- |
| Database | `heroes_factory` |
| User | `heroes` |
| Password | senha forte (anote) |

3. Após o deploy, copie o **host interno** do container MySQL.
4. Monte a connection string:

```txt
mysql://heroes:SENHA@<host-mysql-interno>:3306/heroes_factory
```

> No Coolify, MySQL usa porta **3306** internamente. A porta **3307** existe apenas no `docker-compose.yml` de desenvolvimento local.

#### 2. API (Application)

1. `New Resource` → `Application` → conecte o repositório Git
2. Configuração de build:

| Campo | Valor |
| --- | --- |
| Build Pack | Dockerfile |
| Base Directory | `/` (raiz do repo) |
| Dockerfile Location | `apps/api/Dockerfile` |
| Port Exposes | `3333` |
| Health Check Path | `/health` |

3. Variáveis de ambiente (runtime):

```txt
NODE_ENV=production
API_PORT=3333
API_HOST=0.0.0.0
FRONTEND_URL=https://heroes.seudominio.com
DATABASE_URL=mysql://heroes:SENHA@<host-mysql-interno>:3306/heroes_factory
```

4. Deploy. O `docker-entrypoint.sh` executa `prisma migrate deploy` antes de iniciar o servidor.
5. Valide: `GET https://api-heroes.seudominio.com/health` → `{ "status": "ok" }`

#### 3. Web (Application)

1. Nova Application com o mesmo repositório
2. Configuração:

| Campo | Valor |
| --- | --- |
| Build Pack | Dockerfile |
| Base Directory | `/` |
| Dockerfile Location | `apps/web/Dockerfile` |
| Port Exposes | `80` |

3. Variável de ambiente (**build time** — obrigatória):

```txt
VITE_API_URL=https://api-heroes.seudominio.com
```

> O Vite injeta `VITE_API_URL` durante o `docker build`. Se a URL da API mudar depois, é necessário **rebuild** da Web.

4. O nginx serve os arquivos estáticos com fallback SPA (`try_files` → `index.html`).

#### Ordem recomendada de deploy

```
1. MySQL → aguardar healthy
2. API → migrations rodam no primeiro start
3. Testar GET /health
4. Web com VITE_API_URL apontando para a API pública
5. Testar CRUD completo no front
```

#### Arquivos de deploy

| Arquivo | Função |
| --- | --- |
| `apps/api/Dockerfile` | Build multi-stage Node 22; expõe 3333 |
| `apps/api/docker-entrypoint.sh` | Migrations + start do servidor |
| `apps/web/Dockerfile` | Build Vite + nginx 1.27 |
| `apps/web/nginx.conf` | SPA routing |
| `docker-compose.prod.yml` | Referência local da stack completa |
| `.dockerignore` | Exclui node_modules, .env, dist |

---

## Decisões técnicas e trade-offs

### Prisma em vez de query builder manual

**Pró:** migrations versionadas, tipagem forte, produtividade no CRUD.  
**Contra:** acoplamento ao schema Prisma na camada infra; `prisma generate` no build.  
**Escolha:** para um CRUD com MySQL, o ganho de velocidade e segurança de tipos compensa.

### Use cases + repositório abstrato

**Pró:** regras testáveis sem HTTP nem banco; evolução facilitada.  
**Contra:** mais arquivos que um controller monolítico.  
**Escolha:** o desafio exige regras claras (soft delete, bloqueio de edição); a separação paga o custo.

### Soft delete (`is_active`)

**Pró:** atende reativação; histórico preservado.  
**Contra:** listagem inclui inativos (com indicação visual); queries precisam considerar o flag.  
**Escolha:** requisito explícito do desafio.

### TanStack Query no front

**Pró:** cache, loading, refetch e invalidação após mutações sem boilerplate.  
**Contra:** curva inicial; bundle maior.  
**Escolha:** muitas operações assíncronas (listagem + CRUD + confirmações).

### Drawers em vez de modals

**Pró:** melhor UX em mobile; padrão consistente com shadcn Sheet.  
**Contra:** desvio visual em relação ao enunciado que menciona modals.  
**Escolha:** mesma funcionalidade, interação mais fluida.

### MySQL na porta 3307 (local)

**Pró:** evita conflito com MySQL nativo na 3306.  
**Contra:** desenvolvedor precisa lembrar da porta na `DATABASE_URL`.  
**Escolha:** documentado no README e no `.env.example`.

### Datas em UTC na API

**Pró:** consistência independente de timezone do servidor/cliente.  
**Contra:** front precisa tratar exibição se quiser horário local.  
**Escolha:** formato estável e previsível para integração.

### Sem autenticação

Conforme o desafio. Em produção real, adicionaria JWT ou sessão + rate limiting.

---

## Estrutura de pastas

```
heroes-factory/
├── .github/workflows/ci.yml
├── .dockerignore
├── .env.example
├── docker-compose.yml              # MySQL dev (porta 3307)
├── docker-compose.prod.yml         # Stack prod local
├── package.json
├── package-lock.json
├── README.md
├── apps/
│   ├── api/
│   │   ├── Dockerfile
│   │   ├── docker-entrypoint.sh
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   ├── migrations/
│   │   │   └── seed.ts
│   │   └── src/
│   │       ├── application/
│   │       │   ├── repositories/
│   │       │   └── use-cases/
│   │       ├── config/
│   │       ├── domain/
│   │       ├── infra/database/prisma/
│   │       ├── interfaces/http/
│   │       ├── tests/
│   │       ├── app.ts
│   │       └── server.ts
│   └── web/
│       ├── Dockerfile
│       ├── nginx.conf
│       ├── index.html
│       └── src/
│           ├── api/
│           ├── components/
│           ├── hooks/
│           ├── lib/
│           ├── styles/
│           ├── types/
│           ├── app.tsx
│           └── main.tsx
└── docs/                           # checklist interno (não substitui este README)
```

---

## Endpoints da API

| Método | Rota | Descrição | Status |
| --- | --- | --- | --- |
| `GET` | `/health` | Health check | 200 |
| `GET` | `/heroes` | Lista com busca e paginação | 200 |
| `GET` | `/heroes/:id` | Detalhe por UUID | 200 / 404 |
| `POST` | `/heroes` | Cria herói | 201 / 400 |
| `PUT` | `/heroes/:id` | Atualiza herói **ativo** | 200 / 400 / 404 / 409 |
| `DELETE` | `/heroes/:id` | Desativa (soft delete) | 200 / 404 |
| `PATCH` | `/heroes/:id/activate` | Reativa herói | 200 / 404 |

### Query params — listagem

```http
GET /heroes?page=1&perPage=10&search=hulk
```

| Param | Tipo | Padrão | Descrição |
| --- | --- | --- | --- |
| `page` | number | `1` | Página atual |
| `perPage` | number | `10` (máx. 50) | Itens por página |
| `search` | string | — | Busca parcial em `name` e `nickname` |

### Resposta da listagem

```json
{
  "data": [ /* heróis */ ],
  "meta": {
    "page": 1,
    "perPage": 10,
    "total": 42,
    "totalPages": 5
  }
}
```

### Modelo de um herói

```json
{
  "id": "e314636e-1ca6-4925-a0e7-da5eb5ae2403",
  "name": "Robert Bruce Banner",
  "nickname": "Hulk",
  "date_of_birth": "1962-04-10 00:00:00",
  "universe": "Marvel",
  "main_power": "Super strength",
  "avatar_url": "https://cdn.pixabay.com/photo/2024/05/07/00/59/hulk-8744607_1280.jpg",
  "is_active": true,
  "created_at": "2024-09-18 21:41:43",
  "updated_at": "2024-09-18 21:41:43"
}
```

### Códigos de erro

| Código HTTP | `code` | Situação |
| --- | --- | --- |
| 400 | `VALIDATION_ERROR` | Payload inválido (Zod) |
| 404 | `NOT_FOUND` | Herói não encontrado |
| 409 | `INACTIVE_HERO` | Tentativa de editar herói inativo |
| 500 | `INTERNAL_SERVER_ERROR` | Erro não tratado |

---

## Regras de negócio

1. **Ordenação:** heróis listados por `created_at` decrescente (mais recente primeiro).
2. **Soft delete:** `DELETE /heroes/:id` define `is_active = false`; o registro permanece no banco.
3. **Edição bloqueada:** heróis inativos não podem ser editados (`409 INACTIVE_HERO`).
4. **Reativação:** heróis inativos podem ser reativados via `PATCH /heroes/:id/activate`.
5. **Busca:** considera `name` e `nickname` (contains, case-sensitive no MySQL padrão).
6. **Paginação:** padrão 10 itens; máximo 50 por página.
7. **Validação:** campos obrigatórios na criação; na edição, ao menos um campo deve ser enviado.
8. **Datas:** aceitas como `YYYY-MM-DD` ou `YYYY-MM-DD HH:mm:ss`; persistidas e retornadas em UTC.
9. **Tela inicial:** listagem de heróis.
10. **Sem autenticação:** endpoints públicos.

---

## CI

Pipeline em `.github/workflows/ci.yml` executa em push/PR para `main`:

- `npm install`
- `prisma generate`
- lint → typecheck → test → build

---

## Melhorias futuras (fora do escopo do teste)

- Testes E2E (Playwright/Cypress)
- Testes de integração com banco de teste
- Autenticação e autorização
- Rate limiting e logs estruturados
- Storybook para componentes UI
- Code-splitting no bundle Vite (>500 kB atual)

---

## Licença

MIT — Jean Silva
