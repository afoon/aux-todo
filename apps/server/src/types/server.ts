import type { Session } from 'express-session';

export type SessionWithUser = Session & {
  user?: { id: string; username: string };
};

export type SessionMiddlewareOptions = {
  secret: string;
  resave?: boolean;
  saveUninitialized?: boolean;
  cookie?: { maxAge?: number };
};