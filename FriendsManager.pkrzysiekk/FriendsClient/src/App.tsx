import { useState } from "react";
import "./App.css";
import CategoriesComponent from "./components/categories/CategoriesComponent";
import FriendsComponent from "./components/friends/FriendsComponent";
import {
  BrowserRouter,
  Navigate,
  Route,
  Router,
  Routes,
} from "react-router-dom";
import Navbar from "./components/navbar/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/friends" />} />
        <Route path="/friends" element={<FriendsComponent />} />
        <Route path="/categories" element={<CategoriesComponent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
