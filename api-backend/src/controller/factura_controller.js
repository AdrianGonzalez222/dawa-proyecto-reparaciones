import { db_pool_connection } from "../database/db.js";
import { response_success, response_create, response_not_found, response_error, response_bad_request } from "../response/responses.js";

// FACTURA
export const IngresarFactura = async (req, res) => {
    try {
        // INGRESAR FACTURA
        // ACTUALIZAR ESTADO DE REPARACION A 'FINALIZAD'
        
    } catch (error) {
        console.error("ERROR: ", error);
        res.status(500).json(response_error("ERROR API-SQL -> " + error['sqlMessage']));
    }
}

export const ConsultarReparadosFactura = async (req, res) => {
    try {

        const { id_tecnico } = req.body;

        const query = `
            SELECT 
                r.id, r.equipo, r.problema,
                c.cedula, CONCAT(c.nombres, ' ', c.apellidos) AS nombre_cliente,
                rt.precio_servicio, rt.estado, rt.fecha_reparado
            FROM reparacion r
            INNER JOIN reparacion_tecnico rt ON r.id = rt.id_reparacion
            INNER JOIN cliente c ON r.id_cliente = c.id
            WHERE rt.id_tecnico = ? AND rt.estado = 'reparado'
            ORDER BY rt.fecha_reparado DESC
        `;

        const [rows] = await db_pool_connection.query(query, [id_tecnico]);
        if (rows.length === 0) {
            return res.status(404).json(response_not_found("REPARACIONES NO ENCONTRADAS"));
        } else {
            console.log("LOGIN USER: ", rows);
            res.status(200).json(response_success(rows, "CONSULTA EXITOSA"));
        }

    } catch (error) {
        console.error("ERROR: ", error);
        res.status(500).json(response_error("ERROR API-SQL -> " + error['sqlMessage']));
    }
}

export const ListarFactura = async (req, res) => {
    try {



    } catch (error) {
        console.error("ERROR: ", error);
        res.status(500).json(response_error("ERROR API-SQL -> " + error['sqlMessage']));
    }
}

export const AnularFactura = async (req, res) => {
    try {



    } catch (error) {
        console.error("ERROR: ", error);
        res.status(500).json(response_error("ERROR API-SQL -> " + error['sqlMessage']));
    }
}
