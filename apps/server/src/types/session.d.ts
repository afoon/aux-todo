declare module 'express-session' {
  interface SessionData {
    user?: { id: string; username: string };
  }
  interface Session {
    user?: { id: string; username: string };
  }
}
