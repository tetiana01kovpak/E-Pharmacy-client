import 'dotenv/config';
import { createApp } from './app';
import { connectDb } from './config/db';

const PORT = process.env.PORT || 5000;

async function start(): Promise<void> {
  await connectDb();

  const app = createApp();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
