# Hero Factory

Aplicação full stack para gestão de heróis, construída com React, TypeScript, Node.js, MySQL 8 e Docker.

O projeto foi desenvolvido para cumprir o desafio técnico com foco em legibilidade, organização, regra de negócio explícita e experiência de uso fluida.

## Stack

### Front-end

- React
- Vite
- TypeScript
- Tailwind CSS
- Componentes baseados no padrão shadcn/ui
- TanStack Query
- React Hook Form
- Zod
- Axios
- Sonner

### Back-end

- Node.js
- Express
- TypeScript
- Prisma ORM
- MySQL 8
- Zod
- Vitest

### Infraestrutura

- Docker Compose para banco MySQL 8
- GitHub Actions para lint, typecheck, testes e build

## Funcionalidades implementadas

- Criação de heróis
- Listagem de heróis
- Ordenação por `created_at` em ordem decrescente
- Busca por `name` ou `nickname`
- Paginação com 10 registros por página
- Grade com 5 registros por linha em telas grandes
- Modal de criação
- Modal de edição
- Modal de visualização detalhada
- Modal de confirmação para desativar herói
- Modal de confirmação para ativar herói
- Feedbacks de sucesso e erro
- Loading em operações assíncronas
- Registros inativos com aparência cinza
- Bloqueio de edição para heróis inativos
- API RESTful
- Sem autenticação, conforme solicitado

## Arquitetura

O projeto está organizado como um monorepo simples:

```txt
heroes-factory/
  apps/
    api/
    web/
  .github/
    workflows/
      ci.yml
  docker-compose.yml
  README.md
```

### API

A API foi separada por camadas:

```txt
src/
  application/
    repositories/
    use-cases/
  domain/
    entities/
    errors/
  infra/
    database/
      prisma/
  interfaces/
    http/
      controllers/
      middlewares/
      presenters/
      validators/
```

Essa estrutura deixa as regras de negócio fora da camada HTTP e facilita testes, manutenção e evolução.

## Modelo de resposta da API

A API responde heróis no seguinte formato:

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

## Endpoints

| Método | Rota | Descrição |
| --- | --- | --- |
| GET | `/health` | Verifica status da API |
| GET | `/heroes` | Lista heróis com busca e paginação |
| GET | `/heroes/:id` | Busca um herói por ID |
| POST | `/heroes` | Cria um herói |
| PUT | `/heroes/:id` | Edita um herói ativo |
| DELETE | `/heroes/:id` | Desativa um herói |
| PATCH | `/heroes/:id/activate` | Ativa um herói inativo |

### Query params da listagem

```txt
GET /heroes?page=1&perPage=10&search=hulk
```

## Regras de negócio

- Heróis são listados por criação, do mais recente para o mais antigo.
- A exclusão é lógica: o registro é preservado e `is_active` passa para `false`.
- Heróis inativos não podem ser editados.
- Heróis inativos podem ser reativados.
- Busca considera `name` e `nickname`.
- A tela inicial é a listagem.

## Como rodar localmente

### 1. Clone o projeto

```bash
git clone <repository-url>
cd heroes-factory
```

### 2. Configure as variáveis de ambiente

```bash
cp .env.example .env
cp .env.example apps/api/.env
cp .env.example apps/web/.env
```

> Os arquivos `.env` podem usar os mesmos valores do `.env.example` para ambiente local.

### 3. Instale as dependências

```bash
npm install
```

### 4. Suba o banco MySQL

```bash
docker compose up -d
```

### 5. Execute as migrations

```bash
npm run prisma:migrate -w @heroes-factory/api
```

### 6. Popule dados iniciais opcionalmente

```bash
npm run prisma:seed -w @heroes-factory/api
```

### 7. Rode a aplicação

```bash
npm run dev
```

Acesse:

- Front-end: `http://localhost:5173`
- API: `http://localhost:3333`
- Health check: `http://localhost:3333/health`

## Scripts úteis

```bash
npm run dev
npm run lint
npm run typecheck
npm run test
npm run build
```

## Testes

A API possui testes unitários nos casos de uso principais, utilizando um repositório em memória para validar as regras sem depender do banco.

```bash
npm run test -w @heroes-factory/api
```

## CI

O projeto possui GitHub Actions executando:

- lint
- typecheck
- testes
- build

Arquivo: `.github/workflows/ci.yml`

## Decisões técnicas

### Por que Prisma?

O Prisma reduz boilerplate, melhora a segurança de tipos e facilita migrations. Para um CRUD com MySQL, ele entrega produtividade sem sacrificar clareza.

### Por que separação em use cases?

As regras de negócio ficam isoladas da camada HTTP, deixando o código mais testável e preparado para evolução.

### Por que soft delete?

O desafio exige a possibilidade de ativar registros inativos. Por isso, a operação de exclusão altera `is_active` para `false` em vez de remover o registro fisicamente.

### Por que TanStack Query?

A aplicação possui muitas interações assíncronas. O TanStack Query simplifica cache, loading, refetch e invalidação da listagem após criação, edição, ativação ou desativação.

## Propostas de melhoria futura

- Adicionar cobertura de testes de integração HTTP com banco de teste.
- Adicionar Storybook para componentes de UI.
- Adicionar logs estruturados.
- Adicionar auditoria de alterações.
- Criar deploy de demonstração com Coolify.
- Separar ambientes de desenvolvimento, homologação e produção.

## Como publicar no GitHub

Crie um repositório público ou privado sem mencionar a empresa no nome. Sugestão:

```txt
heroes-factory
```

Depois execute:

```bash
git init
git add .
git commit -m "initial hero factory implementation"
git branch -M main
git remote add origin git@github.com:<seu-usuario>/heroes-factory.git
git push -u origin main
```

## Deploy sugerido

O projeto pode ser publicado no Coolify com dois serviços:

1. API Node.js apontando para `apps/api`.
2. Web Vite apontando para `apps/web`.

O banco pode ser criado como recurso MySQL no próprio Coolify ou mantido via Docker Compose.

Variáveis principais:

```txt
DATABASE_URL=mysql://user:password@host:3306/heroes_factory
FRONTEND_URL=https://sua-url-web.com
VITE_API_URL=https://sua-url-api.com
```
