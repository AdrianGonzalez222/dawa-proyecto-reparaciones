import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        PROYECTO DE DAWA
      </Typography>

      <Box sx={{ mt: 10 }}>
        <AppBar position="static">
          <Toolbar sx={{ justifyContent: "center" }}>
            <Button color="inherit" onClick={() => navigate("/login")}>
              LOGIN
            </Button>
            <Button
              color="inherit"
              onClick={() => navigate("/register/cliente")}
            >
              REGISTER
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
    </Container>
  );
};

export default Index;
