const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

// Path to requirements.txt
const requirementsPath = path.join(__dirname, "requirements.txt");
const dotenvPath = path.join(__dirname, "..", "..", ".env");

// Function to check if Python is installed
const checkPythonInstallation = () => {
  return new Promise((resolve, reject) => {
    exec("python --version", (error, stdout) => {
      if (error) {
        console.error(
          "Python is not installed. Please install Python 3.8+ to use the chatbot."
        );
        reject(error);
      } else {
        console.log(`Found Python: ${stdout.trim()}`);
        resolve();
      }
    });
  });
};

// Function to install requirements
const installRequirements = () => {
  return new Promise((resolve, reject) => {
    console.log("Installing Python dependencies...");
    exec(`pip install -r ${requirementsPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error("Error installing dependencies:", stderr);
        reject(error);
      } else {
        console.log("Dependencies installed successfully.");
        console.log(stdout);
        resolve();
      }
    });
  });
};

// Function to check if GROQ_API_KEY is set in .env file
const checkApiKey = () => {
  try {
    if (fs.existsSync(dotenvPath)) {
      const envContent = fs.readFileSync(dotenvPath, "utf8");
      if (!envContent.includes("GROQ_API_KEY=")) {
        console.warn("\n⚠️ GROQ_API_KEY not found in .env file.");
        console.warn("Please add your Groq API key to the .env file:");
        console.warn("GROQ_API_KEY=your_api_key_here\n");
      } else {
        console.log("GROQ_API_KEY found in .env file.");
      }
    } else {
      console.warn(
        "\n⚠️ .env file not found. Please create one with your Groq API key:"
      );
      console.warn("GROQ_API_KEY=your_api_key_here\n");
    }
  } catch (err) {
    console.error("Error checking API key:", err);
  }
};

// Run setup
const setup = async () => {
  try {
    await checkPythonInstallation();
    await installRequirements();
    checkApiKey();
    console.log("\nSetup completed successfully! You can now use the chatbot.");
  } catch (error) {
    console.error("Setup failed:", error);
    process.exit(1);
  }
};

// Run setup if this file is executed directly
if (require.main === module) {
  setup();
}

module.exports = { setup };
