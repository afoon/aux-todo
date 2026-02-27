import express from 'express';
import session from 'express-session';
import type { RequestHandler } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { createServer } from 'node:http';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import type { Request } from 'express';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler.js';
import type { SessionWithUser, SessionMiddlewareOptions } from './types/server.js';
dotenv.config();

const PORT = process.env.PORT ?? 3000;
const CLIENT_URL = process.env.CLIENT_URL ?? 'http://localhost:5173';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: { origin: [CLIENT_URL], credentials: true },
});
app.set('io', io);

///////// Middleware //////////////
app.use(cors({ origin: CLIENT_URL, credentials: true }));
const sessionMiddleware = (session as unknown as (options: SessionMiddlewareOptions) => RequestHandler)({
  secret: process.env.SESSION_SECRET as string,
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 10 }
});
app.use(sessionMiddleware);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

///////// routes//////////////
app.use('/api', routes.api);
app.use('/auth', routes.auth);

///////// Error handling //////////////
app.use(errorHandler);

///////// Socket.io //////////////
io.engine.use(sessionMiddleware);
io.on('connection', (socket) => {
  console.log('a user connected');

  const req = socket.request as Request;
  socket.join(req.session.id);
  const session = req.session as SessionWithUser;
  socket.data.user = session?.user;

  //////// events //////////////
});

server.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});