import { Router } from "express";
import { ActualizarCliente, ConsultarCliente, IngresarCliente, ListarCliente } from "../controller/cliente_controller.js";
import { IngresarFactura } from "../controller/factura_controller.js";
import { CancelarReparacion, HistorialReparacion, IngresarReparacion, ListarReparacionDisponible } from "../controller/reparacion_controller.js";
import { IngresarReparacionRepuesto } from "../controller/reparacion_repuesto_controller.js";
import { IngresarReparacionTecnico } from "../controller/reparacion_tecnico_controller.js";
import { ActualizarRepuesto, EstadoRepuesto, IngresarRepuesto, ListarRepuesto, StockRepuesto } from "../controller/repuesto_controller.js";
import { ActualizarTecnico, ConsultarTecnico, IngresarTecnico, ListarTecnico } from "../controller/tecnico_controller.js";
import { ActualizarUsuario, ConsultarUsuario, EstadoUsuario, IngresarUsuario, Login } from "../controller/usuario_controller.js";

const rutas_reparacion = Router();

// USUARIO
rutas_reparacion.post("/repair/login", Login);
rutas_reparacion.post("/repair/usuario/register", IngresarUsuario);
rutas_reparacion.get("/repair/usuario", ConsultarUsuario);
rutas_reparacion.put("/repair/usuario", ActualizarUsuario);
rutas_reparacion.put("/repair/usuario/status", EstadoUsuario);
// TECNICO
rutas_reparacion.post("/repair/usuario/register/tecnico", IngresarTecnico);
rutas_reparacion.get("/repair/usuario/tecnico", ConsultarTecnico);
rutas_reparacion.get("/repair/usuario/tecnico/list", ListarTecnico);
rutas_reparacion.put("/repair/usuario/tecnico", ActualizarTecnico);
// CLIENTE
rutas_reparacion.post("/repair/usuario/register/cliente", IngresarCliente);
rutas_reparacion.get("/repair/usuario/cliente", ConsultarCliente);
rutas_reparacion.get("/repair/usuario/cliente/list", ListarCliente);
rutas_reparacion.put("/repair/usuario/cliente", ActualizarCliente);
// REPUESTO
rutas_reparacion.post("/repair/repuesto", IngresarRepuesto);
rutas_reparacion.get("/repair/repuesto", ListarRepuesto);
rutas_reparacion.put("/repair/repuesto", ActualizarRepuesto);
rutas_reparacion.put("/repair/repuesto/status", EstadoRepuesto);
rutas_reparacion.put("/repair/repuesto/stock", StockRepuesto);
// REPARACION
rutas_reparacion.post("/repair/reparacion", IngresarReparacion);
rutas_reparacion.get("/repair/reparacion/list/available", ListarReparacionDisponible);
rutas_reparacion.get("/repair/reparacion/history", HistorialReparacion);
rutas_reparacion.put("/repair/reparacion/history", CancelarReparacion);
// REPARACION-REPUESTO

// REPARACION-TECNICO

// FACTURA
rutas_reparacion.post("/repair/factura", IngresarFactura);

export default rutas_reparacion;