# How to Set Up and Run the Frontend Project Locally

## Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/)

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/elvisasante323/orta-full-stack-dev-test-fe.git

2. **Navigate into the project directory**
```bash
   cd orta-full-stack-dev-test-fe
   ```

3. **Install dependencies**
    ```bash
        npm run install
    ```

4. **Create a local environment file and add the following variable**
```bash
   touch .env.local
   REACT_APP_BACKEND_URL_LOCAL=http://localhost:8000
   REACT_APP_BACKEND_URL_PROD=https://orta-full-stack-dev-testbe.onrender.com
   REACT_APP_ENVIRONMENT=development
```

5. **Run the development server**
```bash
   npm start
   ```



   
