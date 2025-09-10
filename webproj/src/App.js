// src/App.js
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import QuizList from "./QuizList";
import QuizDetail from "./QuizDetail";
import QuizSolve from "./QuizSolve";
import ProtectedRoute from "./ProtectedRoute";
import UserProfile from "./UserProfile";
import EditQuiz from "./EditQuiz";
import CreateQuiz from "./CreateQuiz";

function App() {
  useEffect(() => {
    // Očisti token i podatke korisnika pri svakom pokretanju aplikacije
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userImage");
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/quizzes" element={<QuizList />} />
        <Route path="/quizzes/create" element={<CreateQuiz />} />
        <Route path="/quizzes/:id/edit" element={<EditQuiz />} />
        <Route
          path="/quizzes"
          element={
            <ProtectedRoute>
              <QuizList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quizzes/:id"
          element={
            <ProtectedRoute>
              <QuizDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quizzes/:id/solve"
          element={
            <ProtectedRoute>
              <QuizSolve />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/protected"
          element={
            <ProtectedRoute>
              <h1>Ovo vidi samo ulogovan korisnik</h1>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
