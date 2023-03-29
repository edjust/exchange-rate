import express from 'express';
import cors from 'cors';
import { routes } from './routes';
import 'dotenv/config';

const app = express();
const portConnection = 4000;

app.use(cors());
app.use(express.json());
app.use(routes);

app.get('/', (req, res) => {
  res.json({ message: 'API Gateway' });
});

app.listen(portConnection, () => {
  console.log(`🚀 Server started on port ${portConnection}!`);
});
