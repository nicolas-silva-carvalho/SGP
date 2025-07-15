import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useAuth } from "./hooks/useAuth";

import AppTheme from "./theme/AppTheme";
import CssBaseline from "@mui/material/CssBaseline";
import LoadingSpinner from "./components/LoadingSpinner";

import SignIn from "./pages/signin/SignIn";
import SignUp from "./pages/signup/SignUp";
import Home from "./pages/Home/Home";
import Users from "./pages/users/Users";
import Plantoes from "./pages/plantoes/Plantoes";

function App() {
  const { auth, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }
  return (
    <AppTheme>
      <CssBaseline />
      <div className="App">
        <BrowserRouter>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="colored"
          />
          <Routes>
            <Route
              path="/"
              element={auth ? <Home /> : <Navigate to="/login"></Navigate>}
            />
            <Route
              path="/usuarios"
              element={auth ? <Users /> : <Navigate to="/login"></Navigate>}
            />
            <Route
              path="/plantoes"
              element={auth ? <Plantoes /> : <Navigate to="/login"></Navigate>}
            />
            <Route
              path="/login"
              element={!auth ? <SignIn /> : <Navigate to="/"></Navigate>}
            />
            <Route
              path="/register"
              element={!auth ? <SignUp /> : <Navigate to="/"></Navigate>}
            />
          </Routes>
        </BrowserRouter>
      </div>
    </AppTheme>
  );
}

export default App;
