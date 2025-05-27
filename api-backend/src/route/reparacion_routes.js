import { Router } from "express";
import { ListarCliente, ActualizarUsuarioCliente, ConsultarUsuarioCliente, IngresarUsuarioCliente } from "../controller/cliente_controller.js";
import { IngresarFactura } from "../controller/factura_controller.js";
import { CancelarReparacion, HistorialReparacion, IngresarReparacion, ListarReparacionDisponible } from "../controller/reparacion_controller.js";
import { AdicionarReparacionRepuesto, ListarReparacionRepuesto, QuitarReparacionRepuesto } from "../controller/reparacion_repuesto_controller.js";
import { ActualizarDatosReparacionTecnico, AsignarReparacionTecnico, ConsultarReparacionTecnico, EstadoReparacionTecnico } from "../controller/reparacion_tecnico_controller.js";
import { ActualizarRepuesto, EstadoRepuesto, IngresarRepuesto, ListarRepuesto, StockRepuesto } from "../controller/repuesto_controller.js";
import { ListarTecnico, ActualizarUsuarioTecnico, ConsultarUsuarioTecnico, IngresarUsuarioTecnico } from "../controller/tecnico_controller.js";
import { ConsultarUsuarioRol, EstadoUsuario, Login } from "../controller/usuario_controller.js";

const rutas_reparacion = Router();

// USUARIO
rutas_reparacion.post("/repair/login", Login);
rutas_reparacion.post("/repair/register", IngresarUsuarioCliente);
rutas_reparacion.post("/repair", ConsultarUsuarioRol);
rutas_reparacion.put("/repair/usuario/status", EstadoUsuario);
// TECNICO
rutas_reparacion.get("/repair/usuario/tecnico/list", ListarTecnico);
rutas_reparacion.post("/repair/usuario/tecnico", ConsultarUsuarioTecnico);
rutas_reparacion.post("/repair/usuario/register/tecnico", IngresarUsuarioTecnico);
rutas_reparacion.put("/repair/usuario/tecnico", ActualizarUsuarioTecnico);
// CLIENTE
rutas_reparacion.get("/repair/usuario/cliente/list", ListarCliente);
rutas_reparacion.post("/repair/usuario/register/cliente", IngresarUsuarioCliente);
rutas_reparacion.post("/repair/usuario/cliente", ConsultarUsuarioCliente);
rutas_reparacion.put("/repair/usuario/cliente", ActualizarUsuarioCliente);
// REPUESTO
rutas_reparacion.post("/repair/repuesto", IngresarRepuesto);
rutas_reparacion.get("/repair/repuesto", ListarRepuesto);
rutas_reparacion.put("/repair/repuesto", ActualizarRepuesto);
rutas_reparacion.put("/repair/repuesto/status", EstadoRepuesto);
rutas_reparacion.put("/repair/repuesto/stock", StockRepuesto);
// REPARACION
rutas_reparacion.post("/repair/reparacion", IngresarReparacion);
rutas_reparacion.post("/repair/reparacion/history", HistorialReparacion);
rutas_reparacion.get("/repair/reparacion/list/available", ListarReparacionDisponible);

rutas_reparacion.put("/repair/reparacion", CancelarReparacion);
// REPARACION-TECNICO
rutas_reparacion.post("/repair/reparacion/list/available", AsignarReparacionTecnico);
rutas_reparacion.post("/repair/reparacion/list/task", ConsultarReparacionTecnico);
rutas_reparacion.put("/repair/reparacion/list/task", ActualizarDatosReparacionTecnico);
rutas_reparacion.put("/repair/reparacion/list/task/status", EstadoReparacionTecnico);
// REPARACION-REPUESTO
rutas_reparacion.post("/repair/reparacion/list/task/inventory", ListarReparacionRepuesto);
rutas_reparacion.post("/repair/reparacion/list/task/inventory/add", AdicionarReparacionRepuesto);
rutas_reparacion.post("/repair/reparacion/list/task/inventory/del", QuitarReparacionRepuesto);
// FACTURA
rutas_reparacion.post("/repair/factura", IngresarFactura);

export default rutas_reparacion;