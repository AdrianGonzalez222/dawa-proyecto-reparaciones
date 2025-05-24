import express from 'express';
import { PORT, config_cors } from "./src/config/config.js";
import rutas_reparacion from "./src/route/reparacion_routes.js";
import cors from 'cors';

console.log("PROYECTO DAWA - 1P - GONZALEZ ASTUDILLO, AGUILAR VILLAFUERTE");
const app = express();

app.use(cors(config_cors.application.cors.server));
app.use(express.json());
app.use(rutas_reparacion);

app.use(
    (req, resp, next) => {
        resp.status(400).json({
            mesage: "RUTA DE ACCESO NO VALIDA",
        })
    }
);

console.log("SERVIDOR INICIADO EN PUERTO: " + PORT);
app.listen(PORT, () =>{
    console.log("SERVIDOR ESCUCHANDO EN PUERTO: " + PORT);
});