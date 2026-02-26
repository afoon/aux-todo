import express from 'express';
import session from 'express-session';
import bodyParser from 'body-parser';
import { createServer } from 'node:http';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import type { Request } from 'express';
import apiRoutes from './routes/api.js'
dotenv.config();

const PORT = process.env.PORT ?? 3000;

const app = express();
const server = createServer(app);
const io = new Server(server, {cors: {origin: ['http://localhost:5173']}});


///////// Middleware //////////////
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET as string,
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 1000 * 60 * 10 }
})
app.use(sessionMiddleware);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

///////// routes//////////////
app.use('/api', apiRoutes);

///////// Socket.io //////////////
io.engine.use(sessionMiddleware);
io.on('connection', (socket) => {
  console.log('a user connected');

  const req = socket.request as Request;
  socket.join(req.session.id);

  //////// events //////////////
});

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
})

server.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});