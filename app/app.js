const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello from EKS CI/CD');
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP' });
});

app.get('/info', (req, res) => {
  res.json({
    app: 'eks-cicd-app',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'dev'
  });
});

app.listen(PORT, () => console.log(`Running on port ${PORT}`));
