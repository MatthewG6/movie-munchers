import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "../Components/Navbar";
import Dashboard from "./Dashboard";
import Login from "./Login";
import MovieDetails from "./MovieDetails";
import Favorites from "./Favorites";
import Register from "./Register";

function App() {
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/MovieDetails" element={<MovieDetails />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
