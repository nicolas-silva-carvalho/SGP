import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import { useAuth } from "./hooks/useAuth";

import AppTheme from "./theme/AppTheme";
import CssBaseline from "@mui/material/CssBaseline";

import SignIn from "./pages/signin/SignIn";
import SignUp from "./pages/signup/SignUp";
import Home from "./pages/Home/Home";

function App() {
  const { auth, loading } = useAuth();
  return (
    <AppTheme>
      <CssBaseline />
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={auth ? <Home /> : <Navigate to="/login"></Navigate>}
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
