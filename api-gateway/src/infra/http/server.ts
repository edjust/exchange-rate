import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import 'dotenv/config';
import { rateLimiter } from './middlewares/rateLimiter';
import { exceptionHandler } from './middlewares/exceptionHandler';
import { routes } from './routes';

const app = express();
const portConnection = 4000;

app.use(cors());
app.use(express.json());
app.use(rateLimiter);
app.use(routes);
app.use(exceptionHandler);

app.get('/', (req, res) => {
  res.json({ message: 'API Gateway' });
});

app.listen(portConnection, () => {
  console.log(`🚀 Server started on port ${portConnection}!`);
});
