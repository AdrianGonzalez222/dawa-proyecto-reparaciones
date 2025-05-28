import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  Box,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import ConsultarReparacion from "../reparacion/consultar_reparacion_cliente";

const HomePageCliente = () => {
  const [username, setUsername] = useState("");
  const [openUserModal, setOpenUserModal] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || storedUser.rol !== "cliente") {
      navigate("/", { replace: true });
    } else {
      setUsername(storedUser.username);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  const renderContent = () => {
    switch (selectedComponent) {
      case "consultar_reparacion":
        return <ConsultarReparacion />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Primera AppBar */}
      <AppBar position="static">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Bienvenido, {username}
          </Typography>
          <Box>
            <IconButton color="inherit">
              <NotificationsIcon />
            </IconButton>
            <IconButton color="inherit" onClick={() => setOpenUserModal(true)}>
              <AccountCircleIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Segunda AppBar */}
      <AppBar
        position="static"
        sx={{ backgroundColor: "#f0f0f0", color: "black" }}
      >
        <Toolbar sx={{ gap: 2 }}>
          <Button onClick={() => setSelectedComponent("consultar_reparacion")}>
            Consultar Reparación
          </Button>
        </Toolbar>
      </AppBar>

      {/* Contenido dinámico */}
      <Box sx={{ padding: 3 }}>{renderContent()}</Box>

      {/* Modal de opciones de usuario */}
      <Dialog open={openUserModal} onClose={() => setOpenUserModal(false)}>
        <DialogTitle>Opciones de Usuario</DialogTitle>
        <DialogActions sx={{ padding: "16px" }}>
          <Button
            onClick={handleLogout}
            variant="contained"
            color="error"
            fullWidth
          >
            Cerrar Sesión
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default HomePageCliente;
