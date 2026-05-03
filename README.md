# Team Task Manager

A full-stack (MERN) web application for managing team projects and tasks. Built with a focus on functionality and a clean, minimal UI. It supports role-based access control, allowing Admins to create projects, assign tasks, and manage members, while Members can update their assigned tasks' statuses.

## 🚀 Tech Stack

*   **Frontend:** React, React Router, Axios, plain CSS (no heavy frameworks)
*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB (via Mongoose)
*   **Authentication:** JSON Web Tokens (JWT) & bcryptjs

## ✨ Features

*   **Authentication & Authorization:** Secure signup and login with role-based access control (Admin vs. Member).
*   **Interactive Dashboard:** Visual overview of tasks including total, pending, in-progress, completed, and overdue statistics.
*   **Project Management:** Admins can create projects and add registered users as members.
*   **Task Management:** Admins can create, assign, update, and delete tasks. Members can view project tasks and update the status of tasks assigned to them.
*   **Responsive UI:** Clean, brutalist-inspired UI with functional cards, forms, and tables.

## 📂 Project Structure

The project is divided into two main directories:
*   `client/`: Contains the React frontend application.
*   `server/`: Contains the Node.js/Express backend API.

## 🛠️ Local Setup

### Prerequisites

*   Node.js installed
*   A MongoDB database (local or MongoDB Atlas)

### Backend Setup

1.  Navigate to the server directory:
    ```bash
    cd server
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env` file in the `server` directory and add the following variables:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_super_secret_jwt_key
    ```
4.  Start the backend development server:
    ```bash
    npm run dev
    ```

### Frontend Setup

1.  Navigate to the client directory (in a new terminal):
    ```bash
    cd client
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the frontend development server:
    ```bash
    npm start
    ```
4.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## ☁️ Deployment (Railway)

This project is configured to be easily deployable on [Railway.app](https://railway.app/).

1.  **MongoDB:** Ensure you have a MongoDB Atlas cluster created and your IP access list allows connections from anywhere (`0.0.0.0/0`).
2.  **Deploy Backend:**
    *   Create a New Project on Railway -> Deploy from GitHub repo.
    *   Select this repository and set the **Root Directory** to `server`.
    *   Add your environment variables (`PORT`, `MONGO_URI`, `JWT_SECRET`) in the Railway dashboard.
3.  **Deploy Frontend:**
    *   In the same Railway project, add a New Service -> GitHub repo.
    *   Select this repository and set the **Root Directory** to `client`.
    *   Set the **Build Command** to `npm run build`.
    *   Set the **Start Command** to `npx serve -s build -l $PORT`.
    *   Add the environment variable `REACT_APP_API_URL` pointing to your deployed backend's URL (e.g., `https://your-backend.up.railway.app/api`).
4.  **Configure CORS:**
    *   Go back to your backend service on Railway and add a new environment variable `CLIENT_URL` pointing to your deployed frontend's URL.
    *   This ensures the backend accepts requests from the frontend.

## 📜 License

ISC
