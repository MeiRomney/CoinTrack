import type { Application } from "express";
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
declare const swaggerSpec: OpenAPISpec;
export declare function configureSwagger(app: Application): void;
export { swaggerSpec };
export declare const swaggerTags: {
    readonly auth: "Authentication";
    readonly health: "Health";
    readonly users: "Users";
};
export declare const commonResponses: {
    400: {
        $ref: string;
    };
    401: {
        $ref: string;
    };
    403: {
        $ref: string;
    };
    404: {
        $ref: string;
    };
    429: {
        $ref: string;
    };
    500: {
        $ref: string;
    };
};
export declare function createSwaggerTags(tags: string[]): string;
//# sourceMappingURL=swagger.d.ts.map