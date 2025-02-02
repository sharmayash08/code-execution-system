## Online Code Execution System 🚀

This application allows users to execute code in multiple programming languages (C++, Java, Python, and JavaScript) using persistent Docker containers. It provides an API to run the code with input and output handling, built with **Node.js**, **Express.js**, and **Docker**.

## Tech Stack 🛠️
Node.js 💻
<img src="https://upload.wikimedia.org/wikipedia/commons/6/64/Node.js_logo_2015.svg" alt="Node.js logo" width="50" />

Express.js 🌐
<img src="https://upload.wikimedia.org/wikipedia/commons/6/64/Expressjs.png" alt="Express.js logo" width="50" />

Docker 🐳
<img src="https://upload.wikimedia.org/wikipedia/commons/7/79/Docker_logo.png" alt="Docker logo" width="50" />

AWS EC2 ☁️
<img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Amazon_Web_Services_Logo_%282013%29.svg" alt="AWS EC2 logo" width="50" />

PM2 ⚙️
<img src="https://pm2.keymetrics.io/img/logo.png" alt="PM2 logo" width="50" />

## Features ✨

- Execute code in **C++**, **Java**, (**Python**, and **JavaScript**) 🖥️ (Not yet Ready but can be done by making some changes in code).
- Persistent Docker containers for each language to reduce execution overhead ⚙️.
- Supports input redirection for programs requiring input ⏩.
- Fast execution with minimal container startup time ⚡.

---

## Prerequisites 📋

- **Docker** should be installed on both local machines and servers.
- **Node.js** and **npm** should be installed.

### Install Docker 🐳

- **On Local Machine**: [Install Docker](https://docs.docker.com/get-docker/)
- **On EC2 Server**: You can install Docker by running the following commands:

```bash
sudo apt-get update
sudo apt-get install docker.io
sudo systemctl start docker
sudo systemctl enable docker
```
## Install Node.js and npm 💻
- For Ubuntu:
```bash
sudo apt update
sudo apt install nodejs
sudo apt install npm
```

---

## Getting Started 🏁
1. Clone the Repository
   ```bash
   git clone https://github.com/your-repo-name/online-code-execution.git
   cd online-code-execution
   ```
2. Install Dependencies
   ```bash
   npm install
   ```
3. Run Locally 🚀
    - Start the application locally:
      ```bash
      npm run start
      ```
    - Visit http://localhost:3000 to access the application 🌐.
4. Docker Setup 🐳
    - For the application to run the code, Docker is required to execute code inside containers. Docker containers for each language (C++, Java, Python) will be started once the application runs.


---


## Deployment 🚀
1. Set up EC2 Instance
    - Launch an EC2 instance with Ubuntu (or preferred OS).
    - SSH into your EC2 instance.
      ```bash
      ssh -i "your-ec2-key.pem" ubuntu@<EC2-IP-Address>
      ```
    - Install Docker and Node.js (same as local setup above).
2. Clone and Deploy on EC2 🌍
    - Clone the repository and install dependencies on the EC2 instance:
      ```bash
      git clone https://github.com/your-repo-name/online-code-execution.git
      cd online-code-execution
      npm install
      ```
3. Install PM2 🧰
    - PM2 will help run the app in the background and manage it.
      ```bash
      sudo npm install -g pm2
      ```
    - Start the app using PM2:
      ```bash
      pm2 start index.js
      pm2 save
      ```
    - PM2 will ensure that the application runs even if the server restarts 🔄.
4. Set up Load Balancer & Auto Scaling
    - Create an Application Load Balancer in AWS to distribute traffic to your EC2 instances.
    - Set up Auto Scaling Groups to automatically scale the application based on traffic 📈.
5. Test the API 🧪
    - Once deployed, you can access the application through the load balancer’s public DNS:
      ```bash
      http://<load-balancer-public-dns>/api/run
      ```
    - Send a POST request to the /api/run endpoint with a body like:
      ```json
      {
      "code": "#include <iostream>\nusing namespace std;\nint main() {\n    int a , b;\n  cin >> a >> b;\n      cout << a + b;\n    return 0;\n}",
      "language": "cpp",
      "inputs": "5 6" (if any input in your code)
      }
        ```
    - You should get a response with the output of the executed code 💡.
  

---


## Local Testing 🛠️
1. Docker Containers for Each Language 🐳
    - When you run the app, it will automatically start Docker containers for each language (cpp_executor, java_executor, and python_executor).
    
    - You can check the status of your containers using:
      ```bash
      docker ps
      ```
    - To stop the containers:
      ```bash
      docker stop cpp_executor java_executor python_executor
      ```

## Conclusion 🎉
This project provides a scalable and efficient solution for online code execution using Docker. It reduces overhead by keeping persistent containers for each language, allowing faster execution.







