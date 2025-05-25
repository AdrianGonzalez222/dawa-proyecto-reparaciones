import { Router } from "express";
import { ActualizarCliente, IngresarCliente, ListarCliente } from "../controller/cliente_controller.js";
import { IngresarFactura } from "../controller/factura_controller.js";
import { IngresarReparacion } from "../controller/reparacion_controller.js";
import { IngresarReparacionRepuesto } from "../controller/reparacion_repuesto_controller.js";
import { IngresarReparacionTecnico } from "../controller/reparacion_tecnico_controller.js";
import { ActualizarRepuesto, EstadoRepuesto, IngresarRepuesto, ListarRepuesto, StockRepuesto } from "../controller/repuesto_controller.js";
import { ActualizarTecnico, IngresarTecnico, ListarTecnico } from "../controller/tecnico_controller.js";
import { ActualizarUsuario, EstadoUsuario, IngresarUsuario, ListarUsuario, Login } from "../controller/usuario_controller.js";

const rutas_reparacion = Router();

// CLIENTE
rutas_reparacion.post("/repair/cliente", IngresarCliente);
rutas_reparacion.put("/repair/cliente", ActualizarCliente);
rutas_reparacion.get("/repair/cliente", ListarCliente);
// FACTURA
rutas_reparacion.post("/repair/factura", IngresarFactura);
// REPARACION
rutas_reparacion.post("/repair/reparacion", IngresarReparacion);
// REPARACION-REPUESTO

// REPARACION-TECNICO

// REPUESTO
rutas_reparacion.post("/repair/repuesto", IngresarRepuesto);
rutas_reparacion.put("/repair/repuesto", ActualizarRepuesto);
rutas_reparacion.put("/repair/repuesto/status", EstadoRepuesto);
rutas_reparacion.put("/repair/repuesto/stock", StockRepuesto);
rutas_reparacion.get("/repair/repuesto", ListarRepuesto);
// TECNICO
rutas_reparacion.post("/repair/tecnico", IngresarTecnico);
rutas_reparacion.put("/repair/tecnico", ActualizarTecnico);
rutas_reparacion.get("/repair/tecnico", ListarTecnico);
// USUARIO
rutas_reparacion.post("/repair/login", Login);
rutas_reparacion.post("/repair/usuario", IngresarUsuario);
rutas_reparacion.put("/repair/usuario", ActualizarUsuario);
rutas_reparacion.put("/repair/usuario/status", EstadoUsuario);
rutas_reparacion.get("/repair/usuario", ListarUsuario);

export default rutas_reparacion;