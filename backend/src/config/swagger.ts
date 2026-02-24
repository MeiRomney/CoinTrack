import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import * as yaml from "js-yaml";
import type { Application } from "express";
import { config } from "../config.ts";
import { getLogger } from "../utils/logger.ts";

const logger = getLogger();

// OpenAPI specification interface
interface OpenAPISpec {
  openapi: string;
  info: {
    title: string;
    version: string;
    description: string;
    contact: {
      name: string;
      email: string;
    };
    license: {
      name: string;
      url: string;
    };
  };
  servers: Array<{
    url: string;
    description: string;
  }>;
  tags: Array<{
    name: string;
    description: string;
  }>;
  [key: string]: any;
}

// Swagger definition
const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "University Portal API",
    version: "1.0.0",
    description: "API documentation for the University Portal backend service",
    contact: {
      name: "API Support",
      email: "support@university-portal.com",
    },
    license: {
      name: "MIT",
      url: "https://opensource.org/licenses/MIT",
    },
  },
  servers: [
    {
      url: process.env.API_BASE_URL || `http://localhost:${config.port}`,
      description: "Development server",
    },
  ],
  components: {
    securitySchemes: {
      sessionAuth: {
        type: "apiKey",
        in: "cookie",
        name: "connect.sid",
        description: "Session-based authentication using cookies",
      },
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Bearer token authentication (if implemented)",
      },
    },
    schemas: {
      Error: {
        type: "object",
        required: ["error", "message"],
        properties: {
          error: {
            type: "string",
            description: "Error type",
            example: "Validation Error",
          },
          message: {
            type: "string",
            description: "Error description",
            example: "The request is invalid",
          },
          details: {
            type: "object",
            description: "Additional error details",
          },
        },
      },
      User: {
        type: "object",
        required: ["id", "email", "name"],
        properties: {
          id: {
            type: "string",
            description: "Unique user identifier",
            example: "user123",
          },
          email: {
            type: "string",
            format: "email",
            description: "User email address",
            example: "user@university.edu",
          },
          name: {
            type: "string",
            description: "User full name",
            example: "John Doe",
          },
          organizationId: {
            type: "string",
            description: "User organization identifier",
            example: "org456",
          },
          roles: {
            type: "array",
            items: {
              type: "string",
            },
            description: "User roles",
            example: ["student", "user"],
          },
        },
      },
      RateLimitResponse: {
        type: "object",
        properties: {
          error: {
            type: "string",
            example: "Too Many Requests",
          },
          message: {
            type: "string",
            example: "Rate limit exceeded. Maximum 100 requests per 1000ms.",
          },
          retryAfter: {
            type: "number",
            description: "Seconds to wait before retrying",
            example: 1,
          },
        },
      },
    },
    responses: {
      "400": {
        description: "Bad Request",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error",
            },
          },
        },
      },
      "401": {
        description: "Unauthorized",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error",
            },
          },
        },
      },
      "403": {
        description: "Forbidden",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error",
            },
          },
        },
      },
      "404": {
        description: "Not Found",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error",
            },
          },
        },
      },
      "429": {
        description: "Too Many Requests",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/RateLimitResponse",
            },
          },
        },
      },
      "500": {
        description: "Internal Server Error",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/Error",
            },
          },
        },
      },
    },
  },
  tags: [
    {
      name: "Authentication",
      description: "OAuth2 authentication endpoints",
    },
    {
      name: "Health",
      description: "Application health and status endpoints",
    },
    {
      name: "Users",
      description: "User management endpoints",
    },
  ],
};

// Options for swagger-jsdoc
const swaggerOptions = {
  definition: swaggerDefinition,
  apis: ["./src/auth/routes.ts", "./src/routes/*.ts", "./src/**/*.ts"],
};

// Generate swagger spec
const swaggerSpec = swaggerJSDoc(swaggerOptions) as OpenAPISpec;

// Swagger UI options
const swaggerUiOptions = {
  explorer: true,
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    filter: true,
    showRequestHeaders: true,
    showCommonExtensions: true,
  },
  customCss: `
    .topbar-wrapper img {
      content: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjMyIiBoZWlnaHQ9IjMyIiByeD0iOCIgZmlsbD0iIzAwN0FGRiIvPgo8cGF0aCBkPSJNMTYgOEwxNiAyNCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPHA
=');
      height: 32px;
      width: auto;
    }
    .swagger-ui .topbar {
      background-color: #007AFF;
    }
    .swagger-ui .info .title {
      color: #007AFF;
    }
  `,
  customSiteTitle: "University Portal API Documentation",
};

export function configureSwagger(app: Application): void {
  if (!config.swagger.enabled) {
    logger.info("Swagger documentation is disabled");
    return;
  }

  // Add OpenAPI JSON spec endpoint
  app.get("/swagger.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.send(swaggerSpec);
  });

  // Add OpenAPI YAML spec endpoint
  // app.get('/swagger.yaml', (req, res) => {
  //   res.setHeader('Content-Type', 'text/yaml');
  //   res.setHeader('Access-Control-Allow-Origin', '*');
  //   res.send(yaml.dump(swaggerSpec));
  // });

  // Add OpenAPI spec info endpoint
  app.get("/swagger.spec.json", (req, res) => {
    res.json({
      title: "University Portal API - OpenAPI Specification",
      version: swaggerSpec.info.version,
      openapi: swaggerSpec.openapi,
      formats: {
        json: `${req.protocol}://${req.get("host")}/swagger.json`,
        // yaml: `${req.protocol}://${req.get('host')}/swagger.yaml`,
        ui: `${req.protocol}://${req.get("host")}/swagger`,
      },
      info: swaggerSpec.info,
      servers: swaggerSpec.servers,
      tags: swaggerSpec.tags,
    });
  });

  // Add swagger UI
  app.use(
    "/swagger",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, swaggerUiOptions),
  );

  // Add redirect from root to swagger docs in development
  if (config.nodeEnv === "development") {
    app.get("/", (req, res) => {
      res.redirect("/swagger");
    });
  }

  logger.info("OpenAPI specification and Swagger documentation configured", {
    enabled: config.swagger.enabled,
    openApiVersion: swaggerSpec.openapi,
    endpoints: {
      ui: "/swagger",
      spec: "/swagger.spec.json",
      json: "/swagger.json",
      // yaml: '/swagger.yaml'
    },
  });
}

export { swaggerSpec };

// Additional swagger documentation helpers
export const swaggerTags = {
  auth: "Authentication",
  health: "Health",
  users: "Users",
} as const;

// Common swagger responses
export const commonResponses = {
  400: { $ref: "#/components/responses/400" },
  401: { $ref: "#/components/responses/401" },
  403: { $ref: "#/components/responses/403" },
  404: { $ref: "#/components/responses/404" },
  429: { $ref: "#/components/responses/429" },
  500: { $ref: "#/components/responses/500" },
};

// Helper function to generate swagger documentation tags
export function createSwaggerTags(tags: string[]): string {
  return tags.map((tag) => `"${tag}"`).join(", ");
}
