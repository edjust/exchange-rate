import express from 'express';

const app = express();
const portConnection = 4000;

app.get('/', (req, res) => {
  res.json({ message: 'API Gateway' });
});

app.listen(portConnection, () => {
  console.log(`🚀 Server started on port ${portConnection}!`);
});
