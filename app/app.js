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
    version: process.env.APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'dev'
  });
});

// 🔥 NEW PROFESSIONAL ENDPOINT
app.get('/metrics', (req, res) => {
  const uptime = process.uptime();
  const memory = process.memoryUsage();

  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(uptime)} seconds`,
    memory: {
      rss: `${(memory.rss / 1024 / 1024).toFixed(2)} MB`,
      heapTotal: `${(memory.heapTotal / 1024 / 1024).toFixed(2)} MB`,
      heapUsed: `${(memory.heapUsed / 1024 / 1024).toFixed(2)} MB`
    },
    request: {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip
    }
  });
});

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
});
