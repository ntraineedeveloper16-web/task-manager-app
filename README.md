# TaskFlow - Premium Task Manager Application

TaskFlow is a modern full-stack Task Management Kanban application built with a premium React frontend and a scalable Node.js and Express backend powered by MySQL and Sequelize ORM.

The application provides secure JWT authentication, dynamic Kanban task management, task filtering, responsive UI, and workspace statistics.

## Live Demo

Frontend:

```text
https://task-manager-app-tan-one.vercel.app
```

Backend API:

```text
https://task-manager-app-4oz1.onrender.com
```

API Base URL:

```text
https://task-manager-app-4oz1.onrender.com/api
```

## Demo Test Credentials

```text
Email: bhavana@gmail.com
Password: bhavana@123
```

## Features

Authentication and security:

- User registration and login
- JWT authentication
- Protected API routes
- Password encryption using bcryptjs
- Session persistence using localStorage
- Secure authorization middleware

Task management system:

- Kanban workspace with To Do, In Progress, Under Review, and Completed columns
- Create tasks
- Edit tasks
- Delete tasks
- Move tasks between columns
- Task priority management
- Dynamic task search
- Filter tasks by priority

Dashboard metrics:

- Total tasks
- Pending tasks
- Under Review tasks
- Completed tasks

Frontend UI:

- Fully responsive design
- Light themed workspace
- Modern modal system
- Custom confirmation dialogs
- Interactive board layout

## Technology Stack

Frontend:

- React.js
- Vite
- Tailwind CSS
- Lucide React Icons
- Axios

Backend:

- Node.js
- Express.js
- Sequelize ORM
- MySQL

Authentication and validation:

- JWT
- bcryptjs
- express-validator

## Project Structure

```text
task-manager-app/
|-- backend/
|   |-- config/
|   |-- controllers/
|   |-- middleware/
|   |-- models/
|   |-- routes/
|   |-- utils/
|   |-- server.js
|   `-- package.json
|-- frontend/
|   |-- src/
|   |-- index.html
|   |-- vite.config.js
|   `-- package.json
`-- README.md
```

## Local Development Setup

### Prerequisites

Make sure the following are installed:

- Node.js
- MySQL
- Git

### Backend Setup

1. Create a MySQL database:

```sql
CREATE DATABASE IF NOT EXISTS task_manager;
```

2. Navigate to the backend folder:

```bash
cd backend
```

3. Install dependencies:

```bash
npm install
```

4. Create a `.env` file inside the `backend` folder:

```env
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_database_password
DB_NAME=task_manager
DB_PORT=3306
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h
```

5. Start the backend server:

```bash
npm start
```

Backend will run on:

```text
http://localhost:5000
```

### Frontend Setup

1. Navigate to the frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file inside the `frontend` folder:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

4. Start the frontend server:

```bash
npm run dev
```

Frontend will run on:

```text
http://localhost:5173
```

## API Endpoints

Authentication routes:

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |

Task routes:

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/tasks` | Get all tasks |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |

## Deployment

- Frontend hosting: Vercel
- Backend hosting: Render
- Database: MySQL

## Application Highlights

- Full-stack project structure
- REST API architecture
- Responsive UI design
- Authentication system
- Task workflow management
- Modern Kanban experience

## Developer

Ankit Tiwari

LinkedIn:

```text
www.linkedin.com/in/ankittiwari001
```

## License

This project is developed for learning, assessment, and company assignment purposes.
