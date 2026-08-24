import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

import config from "./src/config/config.js";

import app from './src/app.js';
import connectDB from './src/config/database.js';

const PORT = config.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(` Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(' Database connection failed:', err);
    process.exit(1);
  });