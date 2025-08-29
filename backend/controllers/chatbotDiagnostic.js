const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { PythonShell } = require("python-shell");

// Paths
const rootDir = path.resolve(__dirname, "..");
const chatbotDir = path.join(rootDir, "utils", "chatbot");
const envPath = path.join(rootDir, ".env");
const pythonScriptPath = path.join(chatbotDir, "chatbot.py");
const requirementsPath = path.join(chatbotDir, "requirements.txt");

console.log("\n🔍 NexStay Chatbot Diagnostic Tool");
console.log("==============================\n");

// Check if .env file exists
console.log("1. Checking .env file...");
if (!fs.existsSync(envPath)) {
  console.error("❌ ERROR: .env file not found at", envPath);
  console.log("   Create .env file with your Groq API key:");
  console.log("   GROQ_API_KEY=your_api_key_here");
} else {
  console.log("✅ .env file found at", envPath);

  // Check if GROQ_API_KEY is set in .env
  try {
    const envContent = fs.readFileSync(envPath, "utf8");
    if (envContent.includes("GROQ_API_KEY=")) {
      const apiKey = envContent.split("GROQ_API_KEY=")[1].split("\n")[0].trim();
      if (apiKey.length > 0) {
        console.log("✅ GROQ_API_KEY is set in .env file");
      } else {
        console.error("❌ ERROR: GROQ_API_KEY is empty in .env file");
      }
    } else {
      console.error("❌ ERROR: GROQ_API_KEY not found in .env file");
    }
  } catch (err) {
    console.error("❌ ERROR reading .env file:", err);
  }
}

// Check if Python script exists
console.log("\n2. Checking Python chatbot script...");
if (!fs.existsSync(pythonScriptPath)) {
  console.error("❌ ERROR: Python script not found at", pythonScriptPath);
} else {
  console.log("✅ Python script found at", pythonScriptPath);
}

// Check if requirements.txt exists
console.log("\n3. Checking Python requirements file...");
if (!fs.existsSync(requirementsPath)) {
  console.error("❌ ERROR: requirements.txt not found at", requirementsPath);
} else {
  console.log("✅ requirements.txt found at", requirementsPath);
}

// Check Python installation
console.log("\n4. Checking Python installation...");
exec("python --version", (error, stdout, stderr) => {
  if (error) {
    console.error(
      "❌ ERROR: Python not found. Make sure Python is installed and in your PATH"
    );
    console.log(
      "   Try installing Python 3.8 or higher from https://www.python.org/downloads/"
    );
  } else {
    console.log(`✅ Python is installed: ${stdout.trim()}`);

    // Check if required packages are installed
    console.log("\n5. Testing Python package installation...");
    exec(
      'python -c "import langgraph, langchain_groq, dotenv"',
      (error, stdout, stderr) => {
        if (error) {
          console.error("❌ ERROR: Required Python packages not installed.");
          console.log(
            "   Run the following command to install required packages:"
          );
          console.log(`   pip install -r "${requirementsPath}"`);
        } else {
          console.log("✅ Required Python packages are installed");

          // Test connection to Groq API
          console.log("\n6. Testing connection to Groq API...");
          const testScript = `
import os, dotenv, sys, json
from langchain_groq import ChatGroq
dotenv.load_dotenv('${envPath.replace(/\\/g, "\\\\")}')
api_key = os.getenv("GROQ_API_KEY")
if not api_key:
    print(json.dumps({"error": "GROQ_API_KEY not found in environment variables"}))
    sys.exit(1)
try:
    llm = ChatGroq(api_key=api_key, model="llama-3.1-8b-instant")
    result = llm.invoke("Just respond with 'Connection successful!'")
    print(json.dumps({"success": True, "response": result.content}))
except Exception as e:
    print(json.dumps({"error": str(e)}))
    sys.exit(1)
`;

          const options = {
            mode: "text",
            pythonOptions: ["-u"],
          };

          PythonShell.runString(testScript, options, (err, output) => {
            if (err) {
              console.error("❌ ERROR connecting to Groq API:", err);
            } else {
              try {
                const lastOutput = output[output.length - 1];
                const result = JSON.parse(lastOutput);

                if (result.error) {
                  console.error("❌ ERROR with Groq API:", result.error);
                  console.log("   Check your API key and internet connection");
                } else if (result.success) {
                  console.log("✅ Successfully connected to Groq API");
                  console.log("   Response:", result.response);
                }
              } catch (parseError) {
                console.error("❌ ERROR parsing Python output:", parseError);
                console.log("   Python output:", output);
              }
            }

            // Final diagnosis
            console.log("\n📋 DIAGNOSIS SUMMARY");
            console.log("==================");
            if (
              err ||
              !fs.existsSync(envPath) ||
              !fs.existsSync(pythonScriptPath)
            ) {
              console.log(
                "❌ The chatbot is not functioning due to the errors above."
              );
              console.log(
                "   Please fix these issues to enable the AI chatbot functionality."
              );
            } else {
              console.log(
                "✅ All checks passed! The chatbot should be functioning correctly."
              );
              console.log(
                "   If you're still experiencing issues, check the browser console for errors."
              );
            }
          });
        }
      }
    );
  }
});
