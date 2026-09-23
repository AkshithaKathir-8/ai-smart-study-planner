const dns = require("dns");

// Force Node.js to use Google DNS
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 5000;


// =====================================================
// START SERVER
// =====================================================

const startServer = async () => {

  try {

    // Wait for MongoDB connection
    await connectDB();

    // Start Express only after MongoDB is connected
    app.listen(PORT, () => {

      console.log(
        `🚀 Server is running on port ${PORT}`
      );

    });

  } catch (error) {

    console.error(
      "❌ Server startup failed:",
      error.message
    );

    process.exit(1);

  }

};


startServer();