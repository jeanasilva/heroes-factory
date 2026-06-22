# Hero Factory

[![CI](https://github.com/jeanasilva/heroes-factory/actions/workflows/ci.yml/badge.svg)](https://github.com/jeanasilva/heroes-factory/actions/workflows/ci.yml)

Aplicação full stack para cadastro e gestão de heróis, construída com **React**, **TypeScript**, **Node.js**, **Express**, **Prisma**, **MySQL 8**, **Docker** e **Coolify**.

O projeto entrega um CRUD completo com regras de negócio explícitas, API RESTful organizada em camadas, interface responsiva, feedbacks de carregamento/sucesso/erro, documentação interativa da API e caminho claro para execução local ou deploy em produção.

**Repositório:** https://github.com/jeanasilva/heroes-factory  
**Front-end publicado:** https://heroes.jeansilva.dev.br  
**API publicada:** https://api-heroes.jeansilva.dev.br  
**Swagger UI:** https://api-heroes.jeansilva.dev.br/docs  
**OpenAPI JSON:** https://api-heroes.jeansilva.dev.br/docs/openapi.json  
**Health check:** https://api-heroes.jeansilva.dev.br/health

---

## O que o projeto faz

A aplicação permite **criar, listar, visualizar, editar, desativar e reativar** heróis.

A listagem suporta busca por nome completo ou nome de guerra, paginação e ordenação do mais recente para o mais antigo. Heróis inativos permanecem no banco por soft delete, aparecem visualmente em cinza e podem ser reativados, mas não podem ser editados enquanto estiverem inativos.

Não há autenticação, conforme solicitado no desafio.

---

## Stack tecnológica

| Camada | Tecnologias |
| --- | --- |
| Front-end | React 18, Vite, TypeScript, Tailwind CSS |
| UI | Radix UI, padrão shadcn/ui, Lucide React |
| Estado assíncrono | TanStack Query |
| Formulários | React Hook Form, Zod |
| Back-end | Node.js 22, Express, TypeScript |
| Banco | MySQL 8 |
| ORM | Prisma |
| Testes | Vitest, Supertest |
| Documentação API | OpenAPI 3.0 + Swagger UI |
| Infra | Docker, Docker Compose, Coolify |
| CI | GitHub Actions |

---

## Funcionalidades implementadas

### API

- CRUD RESTful de heróis.
- Listagem paginada.
- Busca por `name` ou `nickname`.
- Ordenação por `created_at` decrescente.
- Soft delete com `is_active = false`.
- Reativação de heróis inativos.
- Bloqueio de edição para heróis inativos.
- Validação de entrada com Zod.
- Mensagens de erro padronizadas em português.
- Health check em `/health`.
- Documentação interativa em `/docs`.
- Especificação OpenAPI em `/docs/openapi.json`.
- Migrations automáticas no startup do container da API.

### Web

- Tela inicial com listagem dos heróis.
- Grid responsivo com até 5 cards por linha.
- Busca com debounce.
- Paginação com 10 registros por página.
- Drawer de criação.
- Drawer de edição.
- Drawer de detalhes.
- Drawer de confirmação para excluir ou reativar.
- Loading, skeleton e splash inicial.
- Toasts de sucesso e erro.
- Light mode e dark mode com persistência no `localStorage`.
- Favicon SVG personalizado com tema de herói.

### Infra e qualidade

- Monorepo com npm workspaces.
- Dockerfile separado para API.
- Dockerfile separado para Web.
- MySQL local via Docker Compose.
- GitHub Actions com lint, typecheck, testes e build.
- Documentação de deploy para Coolify.

---

## Arquitetura

O projeto está organizado como monorepo:

```txt
heroes-factory/
├── apps/
│   ├── api/
│   └── web/
├── docs/
├── docker-compose.yml
├── docker-compose.prod.yml
├── package.json
├── package-lock.json
└── README.md
```

A API segue uma organização em camadas inspirada em Clean Architecture:

```txt
apps/api/src/
├── application/
│   ├── repositories/
│   └── use-cases/
├── domain/
│   ├── entities/
│   └── errors/
├── infra/
│   └── database/prisma/
└── interfaces/
    └── http/
        ├── controllers/
        ├── docs/
        ├── middlewares/
        ├── presenters/
        └── validators/
```

O fluxo da API é:

```txt
rota → controller → use case → repository → presenter → response
```

Essa separação mantém regras de negócio fora da camada HTTP e facilita testes unitários com repositório em memória.

---

## Documentação da API

A API possui documentação interativa no padrão **OpenAPI 3.0**, renderizada com **Swagger UI**.

A escolha foi implementar a especificação de forma nativa, sem adicionar dependências como `swagger-ui-express`, para reduzir risco de quebra no build e evitar mudanças desnecessárias no `package-lock.json`.

### Produção

| Recurso | URL |
| --- | --- |
| Swagger UI | https://api-heroes.jeansilva.dev.br/docs |
| OpenAPI JSON | https://api-heroes.jeansilva.dev.br/docs/openapi.json |
| Health docs | https://api-heroes.jeansilva.dev.br/docs/health |
| Health API | https://api-heroes.jeansilva.dev.br/health |

### Local

Com a API rodando em `http://localhost:3333`:

| Recurso | URL |
| --- | --- |
| Swagger UI | http://localhost:3333/docs |
| OpenAPI JSON | http://localhost:3333/docs/openapi.json |
| Health docs | http://localhost:3333/docs/health |
| Health API | http://localhost:3333/health |

### Arquivos da documentação

| Arquivo | Função |
| --- | --- |
| `apps/api/src/interfaces/http/docs/openapi.ts` | Documento OpenAPI 3.0 |
| `apps/api/src/interfaces/http/docs/docs-routes.ts` | Rotas `/docs`, `/docs/openapi.json` e `/docs/health` |
| `apps/api/src/interfaces/http/routes.ts` | Registro das rotas da API |
| `apps/api/src/app.ts` | CSP do Helmet ajustada para Swagger UI via CDN |
| `docs/api-docs.md` | Resumo da documentação da API |

---

## Endpoints da API

| Método | Rota | Descrição |
| --- | --- | --- |
| `GET` | `/health` | Health check da API |
| `GET` | `/docs` | Swagger UI |
| `GET` | `/docs/openapi.json` | Especificação OpenAPI |
| `GET` | `/heroes` | Lista heróis |
| `POST` | `/heroes` | Cria herói |
| `GET` | `/heroes/:id` | Busca herói por UUID |
| `PUT` | `/heroes/:id` | Atualiza herói ativo |
| `DELETE` | `/heroes/:id` | Desativa herói |
| `PATCH` | `/heroes/:id/activate` | Reativa herói |

### Query params da listagem

```http
GET /heroes?page=1&perPage=10&search=hulk
```

| Param | Tipo | Padrão |
| --- | --- | --- |
| `page` | number | `1` |
| `perPage` | number | `10` |
| `search` | string | opcional |

`perPage` aceita no máximo 50 registros por página.

### Modelo de resposta de herói

```json
{
  "id": "e314636e-1ca6-4925-a0e7-da5eb5ae2403",
  "name": "Robert Bruce Banner",
  "nickname": "Hulk",
  "date_of_birth": "1962-04-10 00:00:00",
  "universe": "Marvel",
  "main_power": "Super strength",
  "avatar_url": "https://api.dicebear.com/6.x/avataaars/png?seed=Hulk",
  "is_active": true,
  "created_at": "2024-09-18 21:41:43",
  "updated_at": "2024-09-18 21:41:43"
}
```

### Resposta da listagem

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "perPage": 10,
    "total": 0,
    "totalPages": 0
  }
}
```

### Códigos de erro

| HTTP | Code |
| --- | --- |
| 400 | `VALIDATION_ERROR` |
| 404 | `NOT_FOUND` |
| 409 | `INACTIVE_HERO` |
| 500 | `INTERNAL_SERVER_ERROR` |

---

## Como rodar localmente

### 1. Clonar o repositório

```bash
git clone https://github.com/jeanasilva/heroes-factory.git
cd heroes-factory
```

### 2. Criar os arquivos de ambiente

```bash
cp .env.example .env
cp .env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

### 3. Instalar dependências

```bash
npm install
```

### 4. Subir o MySQL

```bash
docker compose up -d
```

O MySQL local usa a porta `3307` no host para evitar conflito com uma instalação local na porta `3306`.

### 5. Rodar migrations e seed

```bash
npm run prisma:migrate -w @heroes-factory/api
npm run prisma:seed -w @heroes-factory/api
```

O seed é opcional.

### 6. Rodar API e Web

```bash
npm run dev
```

| Serviço | URL |
| --- | --- |
| Web | http://localhost:5173 |
| API | http://localhost:3333 |
| Swagger | http://localhost:3333/docs |
| Health | http://localhost:3333/health |

---

## Variáveis de ambiente

### API

| Variável | Uso |
| --- | --- |
| `DATABASE_URL` | Connection string do MySQL |
| `API_PORT` | Porta da API |
| `API_HOST` | Host de bind |
| `NODE_ENV` | Ambiente da aplicação |
| `FRONTEND_URL` | Origem liberada no CORS |

### Web

| Variável | Uso |
| --- | --- |
| `VITE_API_URL` | URL base da API consumida pelo front |

Em produção, `VITE_API_URL` precisa estar disponível em **build time**, pois o Vite injeta essa variável durante o build.

---

## Scripts disponíveis

| Script | Descrição |
| --- | --- |
| `npm run dev` | Sobe API e Web em paralelo |
| `npm run build` | Build dos workspaces |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript check |
| `npm run test` | Testes |
| `npm run format` | Prettier |

Scripts úteis da API:

| Script | Descrição |
| --- | --- |
| `npm run dev -w @heroes-factory/api` | API em desenvolvimento |
| `npm run prisma:migrate -w @heroes-factory/api` | Migrations locais |
| `npm run prisma:deploy -w @heroes-factory/api` | Migrations em produção |
| `npm run prisma:seed -w @heroes-factory/api` | Seed de dados |
| `npm run test -w @heroes-factory/api` | Testes da API |

---

## Testes

A API possui testes cobrindo use cases, presenter e fluxo HTTP.

```bash
npm run test
npm run test -w @heroes-factory/api
```

O pipeline de CI executa lint, typecheck, testes e build em push/PR para `main`.

---

## Deploy no Coolify

O deploy foi pensado em três recursos separados:

```txt
MySQL → API → Web
```

### MySQL

Crie um recurso Database MySQL no Coolify:

| Campo | Valor |
| --- | --- |
| Database | `heroes_factory` |
| User | `heroes` |
| Public Port | desabilitado |

Use a URL interna gerada pelo Coolify na variável `DATABASE_URL` da API.

### API

| Campo | Valor |
| --- | --- |
| Build Pack | Dockerfile |
| Base Directory | `/` |
| Dockerfile Location | `apps/api/Dockerfile` |
| Port Exposes | `3333` |
| Health Check Path | `/health` |

Variáveis runtime:

```txt
NODE_ENV=production
API_PORT=3333
API_HOST=0.0.0.0
FRONTEND_URL=https://heroes.jeansilva.dev.br
DATABASE_URL=mysql://heroes:SENHA@HOST_INTERNO:3306/heroes_factory
```

Após o deploy, valide:

```txt
https://api-heroes.jeansilva.dev.br/health
https://api-heroes.jeansilva.dev.br/docs
```

### Web

| Campo | Valor |
| --- | --- |
| Build Pack | Dockerfile |
| Base Directory | `/` |
| Dockerfile Location | `apps/web/Dockerfile` |
| Port Exposes | `80` |

Variável build time:

```txt
VITE_API_URL=https://api-heroes.jeansilva.dev.br
```

---

## Decisões técnicas

### Prisma

Foi usado Prisma para migrations versionadas, tipagem forte e produtividade no CRUD.

### Use cases e repository pattern

As regras principais ficam em use cases, desacopladas de Express e Prisma. Isso facilita teste unitário e evolução da aplicação.

### Soft delete

`DELETE /heroes/:id` não remove o registro fisicamente. Ele altera `is_active` para `false`, preservando histórico e permitindo reativação.

### OpenAPI sem dependência extra

A documentação foi implementada com OpenAPI 3.0 e Swagger UI via CDN. Isso evita adicionar bibliotecas apenas para servir docs e reduz risco no build Docker.

### Dark mode e favicon

O front possui alternância de tema com persistência no `localStorage`, além de favicon SVG próprio em `apps/web/public/favicon.svg`.

---

## Melhorias futuras

- Testes E2E com Playwright ou Cypress.
- Testes de integração com banco real de teste.
- Autenticação e autorização.
- Rate limiting.
- Logs estruturados.
- Storybook para componentes UI.
- Code-splitting no bundle Vite.

---

## Licença

MIT — Jean Silva
