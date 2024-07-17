import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import bodyParser from 'body-parser';
import pool from './db.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

app.use(cors());
app.use(bodyParser.json());

app.post('/save-scene', async (req, res) => {
  const { name, data } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO scenes (name, data) VALUES ($1, $2) RETURNING *',
      [name, data]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error saving scene:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

io.on('connection', (socket) => {
  console.log('connection');

  socket.on('client-ready', () => {
    socket.broadcast.emit('get-canvas-state');
  });

  socket.on('canvas-state', (state) => {
    socket.broadcast.emit('canvas-state-from-server', state);
  });

  socket.on('draw-line', ({ prevPoint, currentPoint, color }) => {
    socket.broadcast.emit('draw-line', { prevPoint, currentPoint, color });
  });

  socket.on('clear', () => io.emit('clear'));
});

server.listen(3001, () => {
  console.log('server is listening on 3001');
});
