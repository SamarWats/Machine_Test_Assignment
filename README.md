
# Machine Test Assignment 🛠️

This project is a full-stack MERN application built for a machine test. It includes:

- 🔐 Admin authentication with JWT
- 👨‍💼 Agent creation and listing
- 📥 CSV file upload and task distribution among agents
- 📋 Viewing tasks assigned to agents (all and by ID)

---

## 📁 Project Structure

```
Machine_Test_Assignment/
├── backend/         # Node.js + Express API
├── frontend/        # React frontend
├── README.md
└── .gitignore
```

---

## 🚀 Features

### ✅ Backend (Node.js + Express + MongoDB)
- Admin login with JWT token
- Create and manage agents
- Upload CSV to assign tasks among agents
- Get tasks by agent or all tasks

### ✅ Frontend (React)
- Admin login form
- Upload CSV form
- List of agents and tasks per agent

---

## ⚙️ Prerequisites

- Node.js (v18 or above)
- MongoDB (local or cloud e.g. MongoDB Atlas)
- npm or yarn

---

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/SamarWats/Machine_Test_Assignment.git
cd Machine_Test_Assignment
```

---

### 2. Setup Backend

```bash
cd backend
npm install
```

#### 🔐 Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

#### ▶️ Run the Backend Server

```bash
npm run dev
```

The backend will start on [http://localhost:5000](http://localhost:5000)

---

### 3. Setup Frontend

```bash
cd ../frontend
npm install
```

#### ⚙️ Configure API URL

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

#### ▶️ Run the Frontend App

```bash
npm run dev
```

Frontend will be available on [http://localhost:5173](http://localhost:5173)

---

## 🛠 Technologies Used

- Frontend: React, Vite
- Backend: Node.js, Express
- Database: MongoDB
- Auth: JWT
- File Upload: Multer
- CSV Parsing: csv-parser

---

---

## 👨‍💻 Author

**Samar Wats**  
🔗 [GitHub](https://github.com/SamarWats)

---

## 📄 License

This project is for testing and demonstration purposes only.
