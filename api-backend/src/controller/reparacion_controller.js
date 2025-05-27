import { db_pool_connection } from "../database/db.js";
import { response_success, response_create, response_not_found, response_error, response_bad_request } from "../response/responses.js";

// REPARACION
export const IngresarReparacion = async (req, res) => {
    try {

        const { id_cliente } = req.body;
        const { equipo, problema } = req.body;  
        const query = `
                INSERT INTO reparacion
                (equipo, problema, id_cliente) 
                VALUES (?, ?, ?)
            `;

        const [rows] = await db_pool_connection.query(query, [equipo, problema, id_cliente]);
        console.log("INSERT ORDER-REPAIR: ", rows);
        res.status(201).json(response_create(rows.insertId, "ORDEN DE REPARACION REGISTRADA CON EXITO"));

    } catch (error) {
        console.error("ERROR: ", error);
        res.status(500).json(response_error("ERROR API-SQL -> " + error['sqlMessage']));
    }
}

export const ListarReparacionDisponible = async (req, res) => {
    try {

        const query = `
            SELECT 
                r.id, r.equipo, r.problema, r.estado, r.fecha_creacion,
                c.cedula, CONCAT(c.nombres, ' ', c.apellidos) AS nombre_cliente, c.celular
            FROM reparacion r
            INNER JOIN cliente c ON r.id_cliente = c.id
            WHERE r.estado = 'pendiente'
            ORDER BY r.fecha_creacion DESC
        `;
        
        const [rows] = await db_pool_connection.query(query);
        if (rows.length <= 0) {
            return res.status(404).json(response_not_found("ORDENES DE REPARACION NO ENCONTRADAS"));
        } else {

            rows.forEach(row => {
                ['fecha_creacion'].forEach(field => {
                    if (row[field]) {
                        row[field] = new Date(row[field]).toLocaleString('en-US', { timeZone: 'America/Bogota' });
                    }
                });
            });

            console.log("LIST AVAILABLE ORDER-REPAIR: ", rows);
            res.status(200).json(response_success(rows, "CONSULTA EXITOSA"));
        }

    } catch (error) {
        console.error("ERROR: ", error);
        res.status(500).json(response_error("ERROR API-SQL -> " + error['sqlMessage']));
    }
}

export const ClienteHistorialReparacion = async (req, res) => {
    try {

        const { id_cliente } = req.body;
        const query = `
            SELECT 
                r.id, r.equipo, r.estado AS estado_order, r.fecha_creacion, r.fecha_asignacion, r.fecha_fin,
                rt.estado AS estado_equipo,
                CONCAT(t.nombres, ' ', t.apellidos) AS tecnico_asignado, t.celular,
                r.problema, rt.observacion
            FROM reparacion r
            LEFT JOIN reparacion_tecnico rt ON rt.id_reparacion = r.id
            LEFT JOIN tecnico t ON rt.id_tecnico = t.id
            WHERE id_cliente = ?
            ORDER BY fecha_creacion DESC
        `;
        
        const [rows] = await db_pool_connection.query(query, [id_cliente]);
        if (rows.length <= 0) {
            return res.status(404).json(response_not_found("HISTORIAL DE REPARACIONES NO ENCONTRADAS"));
        } else {

            rows.forEach(row => {
                ['fecha_creacion', 'fecha_asignacion', 'fecha_fin'].forEach(field => {
                    if (row[field]) {
                        row[field] = new Date(row[field]).toLocaleString('en-US', { timeZone: 'America/Bogota' });
                    }
                });
            });

            console.log("HIST REPAIR: ", rows);
            res.status(200).json(response_success(rows, "CONSULTA EXITOSA"));
        }

    } catch (error) {
        console.error("ERROR: ", error);
        res.status(500).json(response_error("ERROR API-SQL -> " + error['sqlMessage']));
    }
}

export const CancelarReparacion = async (req, res) => {
    try {

        const { id } = req.body;
        const query = `
            UPDATE reparacion
            SET estado = 'cancelada', fecha_fin = NOW()
            WHERE id = ?
        `;

        const [rows] = await db_pool_connection.query(query, [id]);
        if (rows.affectedRows === 0) {
            return res.status(404).json(response_not_found("REPARACION NO ENCONTRADA"));
        } else {
            console.log("UPDATE STATUS REPAIR: ", rows);
            res.status(200).json(response_success(null, "REPARACION CANCELADA CON EXITO"));
        }

    } catch (error) {
        console.error("ERROR: ", error);
        res.status(500).json(response_error("ERROR API-SQL -> " + error['sqlMessage']));
    }
}

export const ListarClienteReparacion = async (req, res) => {
    try {

        const query = `
            SELECT 
                c.id ,c.cedula, CONCAT(c.nombres, ' ', c.apellidos) AS nombre_cliente, c.celular, c.direccion
            FROM cliente c
            INNER JOIN usuario u ON c.id_usuario = u.id
            WHERE u.estado = 'activo'
        `;
        
        const [rows] = await db_pool_connection.query(query);
        if (rows.length <= 0) {
            return res.status(404).json(response_not_found("TECNICOS NO ENCONTRADOS"));
        } else {
            console.log("LIST TEC: ", rows);
            res.status(200).json(response_success(rows, "CONSULTA EXITOSA"));
        }

    } catch (error) {
        console.error("ERROR: ", error);
        res.status(500).json(response_error("ERROR API-SQL -> " + error['sqlMessage']));
    }
}
