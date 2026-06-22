import { Router, type Request } from 'express';
import { buildOpenApiDocument } from './openapi.js';

function getBaseUrl(request: Request) {
  const forwardedProto = request.get('x-forwarded-proto')?.split(',')[0]?.trim();
  const protocol = forwardedProto || request.protocol;
  const host = request.get('host') || `localhost:${process.env.API_PORT || 3333}`;

  return `${protocol}://${host}`;
}

const swaggerHtml = `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Hero Factory API Docs</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css" />
    <style>
      :root { color-scheme: light; }
      body { margin: 0; background: #f8fafc; }
      .topbar { display: none; }
      .swagger-ui .info { margin: 32px 0; }
      .swagger-ui .scheme-container { border-radius: 16px; box-shadow: none; border: 1px solid #e2e8f0; }
    </style>
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-standalone-preset.js"></script>
    <script>
      window.onload = () => {
        window.ui = SwaggerUIBundle({
          url: '/docs/openapi.json',
          dom_id: '#swagger-ui',
          deepLinking: true,
          displayRequestDuration: true,
          presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
          layout: 'StandaloneLayout'
        });
      };
    </script>
  </body>
</html>`;

export function createDocsRoutes() {
  const docsRoutes = Router();

  docsRoutes.get(['/docs', '/docs/'], (_request, response) => {
    response.type('html').send(swaggerHtml);
  });

  docsRoutes.get('/docs/openapi.json', (request, response) => {
    response.json(buildOpenApiDocument(getBaseUrl(request)));
  });

  docsRoutes.get('/docs/health', (_request, response) => {
    response.json({
      status: 'ok',
      docs: '/docs',
      openapi: '/docs/openapi.json'
    });
  });

  return docsRoutes;
}
