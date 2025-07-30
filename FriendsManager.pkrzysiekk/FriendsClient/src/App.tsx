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
import Footer from "./components/footer/Footer";

function App() {
  return (
    <div className="app-wrapper">
      <BrowserRouter>
        <Navbar />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Navigate to="/friends" />} />
            <Route path="/friends" element={<FriendsComponent />} />
            <Route path="/categories" element={<CategoriesComponent />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
