# Documentação da API

A API expõe documentação interativa em formato Swagger UI, baseada em um documento OpenAPI 3.0 gerado pela própria aplicação.

## Produção

| Recurso | URL |
| --- | --- |
| Swagger UI | https://api-heroes.jeansilva.dev.br/docs |
| OpenAPI JSON | https://api-heroes.jeansilva.dev.br/docs/openapi.json |
| Health da documentação | https://api-heroes.jeansilva.dev.br/docs/health |
| Health da API | https://api-heroes.jeansilva.dev.br/health |

## Local

Com a API rodando em `http://localhost:3333`:

| Recurso | URL |
| --- | --- |
| Swagger UI | http://localhost:3333/docs |
| OpenAPI JSON | http://localhost:3333/docs/openapi.json |
| Health da documentação | http://localhost:3333/docs/health |
| Health da API | http://localhost:3333/health |

## Implementação

A documentação foi implementada sem dependências adicionais para evitar alteração no `package-lock.json` e reduzir risco de quebra no deploy.

Arquivos principais:

| Arquivo | Responsabilidade |
| --- | --- |
| `apps/api/src/interfaces/http/docs/openapi.ts` | Define o documento OpenAPI 3.0 |
| `apps/api/src/interfaces/http/docs/docs-routes.ts` | Expõe `/docs`, `/docs/openapi.json` e `/docs/health` |
| `apps/api/src/interfaces/http/routes.ts` | Registra as rotas de documentação |
| `apps/api/src/app.ts` | Ajusta CSP do Helmet para carregar Swagger UI via CDN |

## Endpoints documentados

- `GET /health`
- `GET /heroes`
- `POST /heroes`
- `GET /heroes/{id}`
- `PUT /heroes/{id}`
- `DELETE /heroes/{id}`
- `PATCH /heroes/{id}/activate`

A especificação inclui schemas de request, responses, erros de validação, `404 NOT_FOUND`, `409 INACTIVE_HERO`, paginação e exemplos de payload.
