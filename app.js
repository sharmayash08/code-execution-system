const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const fs = require("fs");
const { execSync, exec } = require("child_process");

const app = express();
app.use(cors({
    origin: 'https://code-execution-system-frontend.vercel.app/', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));
app.use(express.json());

const CONTAINERS = {
    cpp: "cpp_executor",
    java: "java_executor",
    // python: "python_executor",
};

function startContainers() {
    const containerConfigs = {
        cpp: "gcc",
        java: "openjdk",
        // python: "python",
    };

    Object.entries(containerConfigs).forEach(([lang, image]) => {
        try {
            execSync(`docker run -dit --name ${CONTAINERS[lang]} -v "${__dirname}":/code ${image} bash`);
            console.log(`${CONTAINERS[lang]} started successfully!`);
        } catch (error) {
            console.log(`${CONTAINERS[lang]} might already be running.`);
        }
    });
}

startContainers();

app.get("/", (req, res) => {
    res.send("Hello from Server");
});

app.post("/api/run", async (req, res) => {
    const { code, language, inputs } = req.body;

    if (!language || !code) {
        return res.status(400).json({ error: "Code and language are required" });
    }

    if (!CONTAINERS[language] && language !== "javascript") {
        return res.status(400).json({ error: "Unsupported language" });
    }

    const uniqueId = uuidv4();
    let codeFile = language === "java" ? `Main.${getFileExtension(language)}` : `${uniqueId}.${getFileExtension(language)}`;
    const codePath = path.join(__dirname, codeFile);
    const formattedCode = code.replace(/\\n/g, "\n");

    fs.writeFileSync(codePath, formattedCode);

    let inputPath = null;
    if (inputs) {
        inputPath = `${uniqueId}_input.txt`;
        fs.writeFileSync(path.join(__dirname, inputPath), inputs);
    }

    try {
        const execCommand = getExecCommand(language, codeFile, inputPath);
        executeCode(execCommand, res, codePath, inputPath);
    } catch (error) {
        res.status(500).json({ error: "Execution failed" });
    }
});

const getFileExtension = (language) => ({
    cpp: "cpp",
    java: "java",
    python: "py",
    javascript: "js",
}[language] || "txt");

function getExecCommand(language, codeFile, inputFile) {
    const inputRedirection = inputFile ? ` < /code/${inputFile}` : "";

    if (language === "javascript") {
        return `node /code/${codeFile} ${inputRedirection}`;
    }

    return {
        cpp: `docker exec ${CONTAINERS.cpp} sh -c "g++ /code/${codeFile} -o /code/a.out && /code/a.out ${inputRedirection}"`,
        java: `docker exec ${CONTAINERS.java} sh -c "javac /code/${codeFile} && java -cp /code Main ${inputRedirection}"`,
        python: `docker exec ${CONTAINERS.python} sh -c "python3 /code/${codeFile} ${inputRedirection}"`,
    }[language];
}

function executeCode(execCommand, res, codePath, inputPath) {
    exec(execCommand, (error, stdout, stderr) => {
        fs.unlinkSync(codePath);
        if (inputPath) fs.unlinkSync(path.join(__dirname, inputPath));

        if (error) {
            return res.status(500).json({ error: stderr || "Execution error" });
        }

        res.json({ output: stdout.trim() });
    });
}

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
