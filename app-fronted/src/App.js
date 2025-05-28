import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./components/index";
import Login from "./components/login";
import RegisterCliente from "./components/cliente/register_cliente";
import HomeAdmin from "./components/admin/home_page_admin";
import HomeTecnico from "./components/tecnico/home_page_tecnico";
import HomeCliente from "./components/cliente/home_page_cliente";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register/cliente" element={<RegisterCliente />} />
        <Route path="/home/admin" element={<HomeAdmin />} />
        <Route path="/home/tecnico" element={<HomeTecnico />} />
        <Route path="/home/cliente" element={<HomeCliente />} />
      </Routes>
    </Router>
  );
};

export default App;
