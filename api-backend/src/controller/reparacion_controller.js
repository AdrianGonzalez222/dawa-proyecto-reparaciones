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
                c.cedula, CONCAT(c.nombres, ' ', c.apellidos) AS nombre_cliente, c.celular, c.direccion
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
                if (row.fecha_creacion) {
                    row.fecha_creacion = new Date(row.fecha_creacion).toLocaleString('en-US', { timeZone: 'America/Bogota' });
                }
            });

            console.log("LIST AVAILABLE ORDER-REPAIR: ", rows);
            res.status(200).json(response_success(rows, "CONSULTA EXITOSA"));
        }

    } catch (error) {
        console.error("ERROR: ", error);
        res.status(500).json(response_error("ERROR API-SQL -> " + error['sqlMessage']));
    }
}

export const HistorialReparacion = async (req, res) => {
    try {

        const { id_cliente } = req.body;
        const query = `
            SELECT 
                id, equipo, problema, estado, fecha_creacion, fecha_asignacion, fecha_fin
            FROM reparacion
            WHERE id_cliente = ?
            ORDER BY fecha_creacion DESC
        `;
        
        const [rows] = await db_pool_connection.query(query, [id_cliente]);
        if (rows.length <= 0) {
            return res.status(404).json(response_not_found("HISTORIAL DE REPARACIONES NO ENCONTRADAS"));
        } else {
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

        const { id, id_cliente } = req.body;
        const query = `
            UPDATE reparacion
            SET estado = 'cancelada', fecha_fin = NOW()
            WHERE id = ? AND id_cliente = ?
        `;

        const [rows] = await db_pool_connection.query(query, [id, id_cliente]);
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
