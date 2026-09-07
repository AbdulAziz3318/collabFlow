import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import AuthLayout from "./layouts/AuthLayout";
import MainLayout from "./layouts/MainLayout";

import ProtectedRoute from "./routes/ProtectedRoute";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";

import Home from "./pages/Home/Home";
import Projects from "./pages/Projects/Projects";
import Tasks from "./pages/Tasks/Tasks";
import Team from "./pages/Team/Team";
import Settings from "./pages/Settings/Settings";
import Profile from "./pages/Profile/Profile";
import NotFound from "./pages/NotFound/NotFound";
import ProjectDetails from "./pages/ProjectDetails/ProjectDetails";
import Assistant from "./pages/Assistant/Assistant";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ============================= */}
        {/* AUTH ROUTES */}
        {/* ============================= */}

        <Route element={<AuthLayout />}>
          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />
        </Route>


        {/* ============================= */}
        {/* PROTECTED ROUTES */}
        {/* ============================= */}

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >

          <Route
            index
            element={<Home />}
          />

          <Route
            path="projects"
            element={<Projects />}
          />

          <Route
            path="projects/:id"
            element={<ProjectDetails />}
          />

          <Route
            path="tasks"
            element={<Tasks />}
          />

          <Route
            path="team"
            element={<Team />}
          />

          <Route
            path="ai"
            element={<Assistant />}
          />

          <Route
            path="settings"
            element={<Settings />}
          />

          <Route
            path="profile"
            element={<Profile />}
          />

        </Route>


        {/* ============================= */}
        {/* 404 */}
        {/* ============================= */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;