import { db_pool_connection } from "../database/db.js";
import { response_success, response_create, response_not_found, response_error, response_bad_request } from "../response/responses.js";

// CLIENTE
export const ListarCliente = async (req, res) => {
    try {

        const query = `
            SELECT 
                u.id ,c.cedula, c.nombres, c.apellidos, c.celular, c.direccion,
                u.username, u.email, u.estado
            FROM cliente c
            INNER JOIN usuario u ON c.id_usuario = u.id
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
