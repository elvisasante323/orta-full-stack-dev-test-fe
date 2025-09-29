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


## Architecture Overview – Shift Feature

The **Shift feature** is designed to handle scheduling, assignment, and management of work shifts within the application.  
It follows a modular structure of an Model View Controller (MVC) application.

### High-Level Flow
1. **UI Layer (Components)**
   - Components render the shift schedule, creation forms, and assignment views.
   - React hooks are used to manage state and trigger updates based on user interaction.

2. **State Management**
   - Local state (React hooks) manages form inputs and temporary UI states.

3. **API Integration**
   - API calls are made through a dedicated  library called **Axios**.
   - Environment variables define the base URL for API requests.
   - Backend endpoints handle CRUD operations for shifts:
     - **Create** new shift
     - **Read** shifts (list / details)
     - **Update** existing shift
     - **Delete** shift

4. **Data Flow**
   - User interacts with **Shift UI components** →  
   - Triggers **Shift Service API calls** →  
   - Backend responds with shift data →  
   - Data stored in **state** and re-rendered in components.

### Folder Structure (Simplified)
```
src/
├─ components/
│ └─ shifts/
│ ├─ Shift.jsx # Displays list of shifts
│ ├─ CreateShift.jsx # Handles creating/updating shifts
│ └─ ShiftDetails.jsx # Reusable UI card for a single shift
```