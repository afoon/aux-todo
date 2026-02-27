declare module 'cors' {
  import type { RequestHandler } from 'express';
  interface CorsOptions {
    origin?: string | string[] | boolean;
    credentials?: boolean;
    [key: string]: unknown;
  }
  const cors: (options?: CorsOptions) => RequestHandler;
  export default cors;
}
