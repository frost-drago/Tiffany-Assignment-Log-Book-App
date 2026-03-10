import { createSwaggerSpec } from "next-swagger-doc";

export function getApiDocs() {
  const spec = createSwaggerSpec({
    apiFolder: "app/api",
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Assignment Log Book API",
        version: "1.0.0",
        description: "REST API for Assignment Log Book App",
      },
    },
  });

  return spec;
}
