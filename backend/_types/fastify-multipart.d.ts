import '@fastify/multipart';

declare module '@fastify/multipart' {
  export interface MultipartFile {
    value: Record<string, string | number>;
  }
}
