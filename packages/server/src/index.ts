import 'module-alias/register';
import express from 'express';
import cors from 'cors';
import { Database } from './db';
import { Game } from './Game';

const app = express();
const db = new Database();

app.use(
  cors({
    origin: '*',
  })
);

app.use(express.json());

app.get('/', (req, res) => {
  console.log('in here');
  res.send('connected');
});

app.post('/register', async (req, res) => {
  console.log(req.body);

  const username = req.body.username;
  const password = req.body.password;
  const color = req.body.color;

  try {
    if (username && password) {
      const player = await db.authenticate(username, password, color);
      res.send({ status: 'SUCCESS', player });
    } else {
      throw new Error('UNAUTHORIZED - Please provide a username and password');
    }
  } catch (e) {
    res.status(401).send({ status: 'FAIL', error: e });
  }
});

new Game(app, db);
