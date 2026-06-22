export function buildOpenApiDocument(baseUrl: string) {
  const apiUrl = baseUrl.replace(/\/$/, '');

  return {
    openapi: '3.0.3',
    info: {
      title: 'Hero Factory API',
      version: '1.0.0',
      description:
        'Documentação REST da API Hero Factory. A API permite criar, listar, visualizar, editar, desativar e reativar heróis sem autenticação.'
    },
    servers: [
      {
        url: apiUrl,
        description: 'Servidor atual'
      }
    ],
    tags: [
      {
        name: 'Health',
        description: 'Status da API'
      },
      {
        name: 'Heroes',
        description: 'Operações de cadastro e gestão de heróis'
      }
    ],
    paths: {
      '/health': {
        get: {
          tags: ['Health'],
          summary: 'Verifica o status da API',
          responses: {
            '200': {
              description: 'API disponível',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/HealthResponse' },
                  example: { status: 'ok' }
                }
              }
            }
          }
        }
      },
      '/heroes': {
        get: {
          tags: ['Heroes'],
          summary: 'Lista heróis com busca e paginação',
          parameters: [
            {
              name: 'page',
              in: 'query',
              required: false,
              schema: { type: 'integer', minimum: 1, default: 1 },
              description: 'Página atual da listagem.'
            },
            {
              name: 'perPage',
              in: 'query',
              required: false,
              schema: { type: 'integer', minimum: 1, maximum: 50, default: 10 },
              description: 'Quantidade de itens por página.'
            },
            {
              name: 'search',
              in: 'query',
              required: false,
              schema: { type: 'string' },
              description: 'Busca parcial por nome completo ou nome de guerra.'
            }
          ],
          responses: {
            '200': {
              description: 'Lista paginada de heróis',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ListHeroesResponse' }
                }
              }
            },
            '400': { $ref: '#/components/responses/ValidationError' }
          }
        },
        post: {
          tags: ['Heroes'],
          summary: 'Cria um novo herói',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/HeroInput' },
                example: {
                  name: 'Robert Bruce Banner',
                  nickname: 'Hulk',
                  date_of_birth: '1962-04-10',
                  universe: 'Marvel',
                  main_power: 'Super força',
                  avatar_url: 'https://api.dicebear.com/6.x/avataaars/png?seed=Hulk'
                }
              }
            }
          },
          responses: {
            '201': {
              description: 'Herói criado',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Hero' }
                }
              }
            },
            '400': { $ref: '#/components/responses/ValidationError' }
          }
        }
      },
      '/heroes/{id}': {
        get: {
          tags: ['Heroes'],
          summary: 'Busca um herói por UUID',
          parameters: [{ $ref: '#/components/parameters/HeroId' }],
          responses: {
            '200': {
              description: 'Herói encontrado',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Hero' }
                }
              }
            },
            '400': { $ref: '#/components/responses/ValidationError' },
            '404': { $ref: '#/components/responses/NotFound' }
          }
        },
        put: {
          tags: ['Heroes'],
          summary: 'Atualiza um herói ativo',
          description: 'Heróis inativos não podem ser editados. Primeiro reative o herói, depois edite.',
          parameters: [{ $ref: '#/components/parameters/HeroId' }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/HeroUpdateInput' },
                example: {
                  nickname: 'Professor Hulk',
                  main_power: 'Força e inteligência avançada'
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Herói atualizado',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Hero' }
                }
              }
            },
            '400': { $ref: '#/components/responses/ValidationError' },
            '404': { $ref: '#/components/responses/NotFound' },
            '409': { $ref: '#/components/responses/InactiveHero' }
          }
        },
        delete: {
          tags: ['Heroes'],
          summary: 'Desativa um herói',
          description: 'A exclusão é lógica: o registro permanece salvo e is_active passa para false.',
          parameters: [{ $ref: '#/components/parameters/HeroId' }],
          responses: {
            '200': {
              description: 'Herói desativado',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Hero' }
                }
              }
            },
            '400': { $ref: '#/components/responses/ValidationError' },
            '404': { $ref: '#/components/responses/NotFound' }
          }
        }
      },
      '/heroes/{id}/activate': {
        patch: {
          tags: ['Heroes'],
          summary: 'Reativa um herói inativo',
          parameters: [{ $ref: '#/components/parameters/HeroId' }],
          responses: {
            '200': {
              description: 'Herói reativado',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/Hero' }
                }
              }
            },
            '400': { $ref: '#/components/responses/ValidationError' },
            '404': { $ref: '#/components/responses/NotFound' }
          }
        }
      }
    },
    components: {
      parameters: {
        HeroId: {
          name: 'id',
          in: 'path',
          required: true,
          schema: {
            type: 'string',
            format: 'uuid'
          },
          description: 'UUID do herói.'
        }
      },
      responses: {
        ValidationError: {
          description: 'Erro de validação dos dados enviados',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ValidationErrorResponse' }
            }
          }
        },
        NotFound: {
          description: 'Herói não encontrado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: { message: 'Herói não encontrado.', code: 'NOT_FOUND' }
            }
          }
        },
        InactiveHero: {
          description: 'Tentativa de editar um herói inativo',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
              example: { message: 'Heróis inativos não podem ser editados.', code: 'INACTIVE_HERO' }
            }
          }
        }
      },
      schemas: {
        HealthResponse: {
          type: 'object',
          required: ['status'],
          properties: {
            status: { type: 'string', example: 'ok' }
          }
        },
        Hero: {
          type: 'object',
          required: [
            'id',
            'name',
            'nickname',
            'date_of_birth',
            'universe',
            'main_power',
            'avatar_url',
            'is_active',
            'created_at',
            'updated_at'
          ],
          properties: {
            id: { type: 'string', format: 'uuid', example: 'e314636e-1ca6-4925-a0e7-da5eb5ae2403' },
            name: { type: 'string', example: 'Robert Bruce Banner' },
            nickname: { type: 'string', example: 'Hulk' },
            date_of_birth: { type: 'string', example: '1962-04-10 00:00:00' },
            universe: { type: 'string', example: 'Marvel' },
            main_power: { type: 'string', example: 'Super força' },
            avatar_url: { type: 'string', format: 'uri', example: 'https://api.dicebear.com/6.x/avataaars/png?seed=Hulk' },
            is_active: { type: 'boolean', example: true },
            created_at: { type: 'string', example: '2024-09-18 21:41:43' },
            updated_at: { type: 'string', example: '2024-09-18 21:41:43' }
          }
        },
        HeroInput: {
          type: 'object',
          required: ['name', 'nickname', 'date_of_birth', 'universe', 'main_power', 'avatar_url'],
          properties: {
            name: { type: 'string', minLength: 2, maxLength: 120 },
            nickname: { type: 'string', minLength: 2, maxLength: 80 },
            date_of_birth: {
              type: 'string',
              description: 'Aceita YYYY-MM-DD ou YYYY-MM-DD HH:mm:ss.',
              example: '1962-04-10'
            },
            universe: { type: 'string', minLength: 2, maxLength: 80 },
            main_power: { type: 'string', minLength: 2, maxLength: 120 },
            avatar_url: { type: 'string', format: 'uri', maxLength: 2048 }
          }
        },
        HeroUpdateInput: {
          allOf: [{ $ref: '#/components/schemas/HeroInput' }],
          description: 'Todos os campos são opcionais na edição, mas ao menos um campo deve ser enviado.'
        },
        PaginationMeta: {
          type: 'object',
          required: ['page', 'perPage', 'total', 'totalPages'],
          properties: {
            page: { type: 'integer', example: 1 },
            perPage: { type: 'integer', example: 10 },
            total: { type: 'integer', example: 42 },
            totalPages: { type: 'integer', example: 5 }
          }
        },
        ListHeroesResponse: {
          type: 'object',
          required: ['data', 'meta'],
          properties: {
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/Hero' }
            },
            meta: { $ref: '#/components/schemas/PaginationMeta' }
          }
        },
        ErrorResponse: {
          type: 'object',
          required: ['message', 'code'],
          properties: {
            message: { type: 'string', example: 'Herói não encontrado.' },
            code: { type: 'string', example: 'NOT_FOUND' }
          }
        },
        ValidationErrorResponse: {
          type: 'object',
          required: ['message', 'code', 'issues'],
          properties: {
            message: { type: 'string', example: 'Dados inválidos. Revise os campos enviados.' },
            code: { type: 'string', example: 'VALIDATION_ERROR' },
            issues: {
              type: 'object',
              additionalProperties: {
                type: 'array',
                items: { type: 'string' }
              }
            }
          }
        }
      }
    }
  };
}
