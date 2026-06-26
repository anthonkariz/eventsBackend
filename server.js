require('dotenv').config();

const app = require('./src/app');
const { connectDatabase } = require('./src/config/db');

const port = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectDatabase();

    return app.listen(port, '0.0.0.0', () => {
      console.log(`Server listening on 0.0.0.0:${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = {
  app,
  startServer,
};