// src/App.js
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
import MyResults from "./MyResults";
import QuizResults from "./QuizResults";
import ResultDetail from "./ResultDetail";
import Leaderboard from "./Leaderboard";
import LiveCreateRoom from "./live/LiveCreateRoom";
import LiveArena from "./live/LiveArena";
import LiveJoin from "./live/LiveJoin";

function App() {
  

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

        {/* rezultati */}
        <Route
          path="/my-results"
          element={
            <ProtectedRoute>
              <MyResults />
            </ProtectedRoute>
          }
        />
        <Route
          path="/results/:id"
          element={
            <ProtectedRoute>
              <QuizResults />
            </ProtectedRoute>
          }
        />
        <Route
          path="/results/:id/detail"
          element={
            <ProtectedRoute>
              <ResultDetail />
            </ProtectedRoute>
          }
        />

        {/* leaderboard */}
        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <Leaderboard />
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
        <Route path="/live/create" element={<LiveCreateRoom />} />
        <Route path="/live/arena/:roomCode" element={<LiveArena />} />
        <Route path="/live/join" element={<LiveJoin />} />
      </Routes>
    </Router>
  );
}

export default App;
