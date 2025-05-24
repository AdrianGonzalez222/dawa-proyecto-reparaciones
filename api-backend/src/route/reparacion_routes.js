import { Router } from "express";
import { IngresarCliente } from "../controller/cliente_controller.js";
import { IngresarFactura } from "../controller/factura_controller.js";
import { IngresarReparacion } from "../controller/reparacion_controller.js";
import { IngresarReparacionRepuesto } from "../controller/reparacion_repuesto_controller.js";
import { IngresarReparacionTecnico } from "../controller/reparacion_tecnico_controller.js";
import { IngresarRepuesto } from "../controller/repuesto_controller.js";
import { IngresarTecnico } from "../controller/tecnico_controller.js";
import { IngresarUsuario, ListarUsuario, Login } from "../controller/usuario_controller.js";

const rutas_reparacion = Router();

// CLIENTE
rutas_reparacion.post("/repair/cliente", IngresarCliente);
// FACTURA
rutas_reparacion.post("/repair/factura", IngresarFactura);
// REPARACION
rutas_reparacion.post("/repair/reparacion", IngresarReparacion);
// REPARACION-REPUESTO

// REPARACION-TECNICO

// REPUESTO
rutas_reparacion.post("/repair/repuesto", IngresarRepuesto);
// TECNICO
rutas_reparacion.post("/repair/tecnico", IngresarTecnico);
// USUARIO
rutas_reparacion.post("/repair/login", Login);
rutas_reparacion.post("/repair/usuario", IngresarUsuario);
rutas_reparacion.get("/repair/usuario", ListarUsuario);

export default rutas_reparacion;