import { db_pool_connection } from "../database/db.js";
import { response_success, response_create, response_not_found, response_error, response_bad_request } from "../response/responses.js";

// TECNICO
export const IngresarTecnico = async (req, res) => {
    try {

        const { id_usuario } = req.body;
        const { cedula, nombres, apellidos, celular } = req.body;  
        const query = `
                INSERT INTO tecnico
                (cedula, nombres, apellidos, celular, id_usuario) 
                VALUES (?, ?, ?, ?, ?)
            `;

        const [rows] = await db_pool_connection.query(query, [cedula, nombres, apellidos, celular, id_usuario]);
        console.log("INSERT TEC: ", rows);
        res.status(201).json(response_create(rows.insertId, "TECNICO REGISTRADO CON EXITO"));

    } catch (error) {
        console.error("ERROR: ", error);

        if (error.code === 'ER_DUP_ENTRY') {
            if (error.sqlMessage.includes('cedula')) {
                return res.status(409).json(response_bad_request("CEDULA YA REGISTRADA"));
            }
        }

        res.status(500).json(response_error("ERROR API-SQL -> " + error['sqlMessage']));
    }
}

export const ActualizarTecnico = async (req, res) => {
    try {

        const { id } = req.body;
        const { cedula, nombres, apellidos, celular } = req.body;
        const query = `
            UPDATE tecnico
            SET cedula = ?, nombres = ?, apellidos = ?, celular = ?
            WHERE id = ?
        `;

        const [rows] = await db_pool_connection.query(query, [cedula, nombres, apellidos, celular, id]);
        if (rows.affectedRows === 0) {
            return res.status(404).json(response_not_found("TECNICO NO ENCONTRADO"));
        } else {
            console.log("UPDATE TEC: ", rows);
            res.status(200).json(response_success(null, "TECNICO ACTUALIZADO CON EXITO"));
        }

    } catch (error) {
        console.error("ERROR: ", error);

        if (error.code === 'ER_DUP_ENTRY') {
            if (error.sqlMessage.includes('cedula')) {
                return res.status(409).json(response_bad_request("CEDULA YA REGISTRADA"));
            }
        }

        res.status(500).json(response_error("ERROR API-SQL -> " + error['sqlMessage']));
    }
}

export const ListarTecnico = async (req, res) => {
    try {

        const query = `
            SELECT 
                t.cedula, t.nombres, t.apellidos, t.celular,
                u.username, u.email, u.estado
            FROM tecnico t
            INNER JOIN usuario u ON t.id_usuario = u.id
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

export const ConsultarTecnico = async (req, res) => {
    try {

        const { id } = req.body;
        const query = `
            SELECT cedula, nombres, apellidos, celular
            FROM tecnico
            WHERE id = ?
        `;
        
        const [rows] = await db_pool_connection.query(query, [id]);
        if (rows.length <= 0) {
            return res.status(404).json(response_not_found("TECNICO NO ENCONTRADO"));
        } else {
            console.log("SELECT TEC: ", rows);
            res.status(200).json(response_success(rows, "CONSULTA EXITOSA"));
        }

    } catch (error) {
        console.error("ERROR: ", error);
        res.status(500).json(response_error("ERROR API-SQL -> " + error['sqlMessage']));
    }
}
