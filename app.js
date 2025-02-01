const express = require("express");
const cors = require("cors");
const {v4: uuidv4} = require("uuid");
const path = require("path");
const fs = require("fs");
const {exec} = require("child_process");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/" , (req , res) => {
    res.send("Hello from Server");
})


app.post("/api/run" , async (req , res) => {
    const {code , language , inputs} = req.body;

    if(!language || !code){
        return res.status(400).json({ error: 'Code and language are required' });
    }

    const uniqueId = uuidv4();
    let codeFile = "";
    if(language === "java"){
        codeFile = `Main.${getFileExtension(language)}`;
    }
    else{
        codeFile = `${uniqueId}.${getFileExtension(language)}`;
    }
    const codePath = path.join(__dirname, codeFile);

    const formattedCode = code.replace(/\\n/g, '\n');  // Replace escaped newlines with real newlines

    fs.writeFileSync(codePath, formattedCode); 

    let inputPath = null;
    if(inputs){
        inputPath = `${uniqueId}_input.txt`;
        const inputFilePath = path.join(__dirname , inputPath);
        fs.writeFileSync(inputFilePath, inputs);
    }

    try {
        const dockerCommand = getDockerCommand(language , codeFile , inputPath);
        await executeCode(dockerCommand, res, codePath, inputPath);
    } catch (error) {
        res.status(500).json({error : "Execution failed"});
    }
});

const getFileExtension = (language) => {
    return {
        cpp: 'cpp',
        java: 'java',
        python: 'py',
        javascript: 'js',
    }[language] || 'txt';
}

function getDockerCommand(language, codeFile, inputFile) {
    const codePath = path.join(__dirname, codeFile);  // Absolute path for the code file
    const inputRedirection = inputFile ? ` < /code/${inputFile}` : "";  // Ensure input is passed to the container
    
    const commands = {
      cpp: `docker run --rm -v "${__dirname}":/code gcc sh -c "g++ /code/${codeFile} -o /code/a.out && /code/a.out ${inputRedirection}"`,
      java: `docker run --rm -v "${__dirname}":/code openjdk sh -c "javac /code/${codeFile} && java -cp /code Main ${inputRedirection}"`,
      python: `docker run --rm -v "${__dirname}":/code python sh -c "python3 /code/${codeFile} ${inputRedirection}"`,
      javascript: `docker run --rm -v "${__dirname}":/code node sh -c "node /code/${codeFile} ${inputRedirection}"`,
    };
  
    return commands[language];
  }
  
  

async function executeCode(dockerCommand, res, codePath, inputPath) {
    exec(dockerCommand, (error, stdout, stderr) => {
      // Cleanup: Delete the code and input files after execution
      fs.unlinkSync(codePath);
      if (inputPath) fs.unlinkSync(inputPath);
  
      if (error) {
        return res.status(500).json({ error: stderr || 'Execution error' });
      }
  
      res.json({ output: stdout.trim() });
    });
  }


app.listen(3000 , () => {
    console.log("Server is running on port 3000");
})