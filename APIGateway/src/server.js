const dotenv = require('dotenv');
dotenv.config();

const app = require('./app');


const port = process.env.PORT || 3000;

async function startHttp() {
  try {
    // Start HTTP server
    const server = app.listen(port, () => {
      console.log(`✅ Auth HTTP service running on port ${port}`);
    });

    // Graceful shutdown handler
    const shutdown = async () => {
      try {
        console.log('⚠️ Shutting down gracefully...');
        server.close(async () => {
          console.log('✅ Shutdown complete. Exiting process.');
          process.exit(0);
        });
      } catch (err) {
        console.error('❌ Error during shutdown:', err);
        process.exit(1);
      }
    };

    // Handle termination signals
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);

  } catch (err) {
    console.error('❌ Failed to start HTTP server:', err.message);
    process.exit(1);
  }
}

startHttp();
