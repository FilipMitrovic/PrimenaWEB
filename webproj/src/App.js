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
import ManageQuestions from "./ManageQuestions";

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
        {/* javno dostupne rute */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* kvizovi - korisnik mora biti ulogovan */}
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

        {/* admin rute */}
        <Route
          path="/quizzes/create"
          element={
            <ProtectedRoute>
              <CreateQuiz />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quizzes/:id/edit"
          element={
            <ProtectedRoute>
              <EditQuiz />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quizzes/:id/manage"
          element={
            <ProtectedRoute>
              <ManageQuestions />
            </ProtectedRoute>
          }
        />

        {/* profil */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />

        {/* test ruta */}
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
