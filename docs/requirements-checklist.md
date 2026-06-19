# Checklist do desafio

| Requisito | Status | Observação |
| --- | --- | --- |
| API, front-end e banco de dados | Implementado | `apps/api`, `apps/web` e MySQL via Docker Compose |
| ReactJS | Implementado | React + Vite |
| TypeScript no front-end | Implementado | Projeto `apps/web` em TS/TSX |
| NodeJS no back-end | Implementado | Express + TypeScript |
| MySQL 8.0+ | Implementado | `mysql:8.0` no `docker-compose.yml` |
| Banco em Docker local | Implementado | `docker compose up -d` |
| CRUD de heróis | Implementado | Criar, listar, editar, desativar e ativar |
| Resposta da API no modelo esperado | Implementado | Presenter padroniza campos e datas |
| Ordenação por `created_at` desc | Implementado | Repository ordena por data de criação |
| Inativos em cinza | Implementado | Card aplica grayscale e badge inativo |
| Botão de ações | Implementado | Menu com editar/excluir/ativar |
| Editar abre modal | Implementado | `HeroFormModal` |
| Excluir pede confirmação | Implementado | `ConfirmActionModal` |
| Ativar substitui excluir quando inativo | Implementado | Lógica no `HeroCard` |
| Confirmações atualizam a lista | Implementado | Invalidação do TanStack Query |
| Não editar herói inativo | Implementado | Regra no backend e botão desabilitado no front |
| Tela inicial é listagem | Implementado | `App.tsx` inicia na listagem |
| Botão para criar herói | Implementado | CTA no header |
| Loading em ações assíncronas | Implementado | Skeleton e loaders nos botões |
| Mensagens de erro/sucesso | Implementado | Sonner/toasts |
| Busca por `name` ou `nickname` | Implementado | Query `search` |
| Clicar no herói abre detalhes | Implementado | `HeroDetailsModal` |
| Paginação com 10 registros | Implementado | `perPage=10` |
| 5 registros por linha | Implementado | Grid responsivo com 5 colunas em telas grandes |
| Modal de edição mostra todos os dados | Implementado | Dados de sistema aparecem como somente leitura |
| Campos editáveis seguem a regra | Implementado | Nome, apelido, nascimento, universo, habilidade e avatar |
| RESTful | Implementado | Rotas REST |
| Sem autenticação | Implementado | Nenhuma camada de auth |
| Testes | Implementado | Unitários de casos de uso |
| CI | Implementado | GitHub Actions |
| Documentação | Implementado | README + checklist |
