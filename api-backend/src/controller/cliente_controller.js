import { db_pool_connection } from "../database/db.js";
import { response_success, response_create, response_not_found, response_error, response_bad_request } from "../response/responses.js";

// CLIENTE
export const IngresarCliente = async (req, res) => {
    try {

        const { id_usuario } = req.body;
        const { cedula, nombres, apellidos, celular, direccion } = req.body;  
        const query = `
                INSERT INTO cliente
                (cedula, nombres, apellidos, celular, direccion, id_usuario) 
                VALUES (?, ?, ?, ?, ?, ?)
            `;

        const [rows] = await db_pool_connection.query(query, [cedula, nombres, apellidos, celular, direccion, id_usuario]);
        console.log("INSERT CLI: ", rows);
        res.status(201).json(response_create(rows.insertId, "CLIENTE REGISTRADO CON EXITO"));

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

export const ActualizarCliente = async (req, res) => {
    try {

        const { id } = req.body;
        const { cedula, nombres, apellidos, celular, direccion } = req.body;
        const query = `
            UPDATE cliente
            SET cedula = ?, nombres = ?, apellidos = ?, celular = ?, direccion = ?
            WHERE id = ?
        `;

        const [rows] = await db_pool_connection.query(query, [cedula, nombres, apellidos, celular, direccion, id]);
        if (rows.affectedRows === 0) {
            return res.status(404).json(response_not_found("CLIENTE NO ENCONTRADO"));
        } else {
            console.log("UPDATE CLI: ", rows);
            res.status(200).json(response_success(null, "CLIENTE ACTUALIZADO CON EXITO"));
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

export const ListarCliente = async (req, res) => {
    try {

        const query = `
            SELECT * FROM cliente
        `;
        
        const [rows] = await db_pool_connection.query(query);
        if (rows.length <= 0) {
            return res.status(404).json(response_not_found("CLIENTES NO ENCONTRADOS"));
        } else {
            console.log("LIST CLI: ", rows);
            res.status(200).json(response_success(rows, "CONSULTA EXITOSA"));
        }

    } catch (error) {
        console.error("ERROR: ", error);
        res.status(500).json(response_error("ERROR API-SQL -> " + error['sqlMessage']));
    }
}

export const EliminarCliente = async (req, res) => {
    try {



    } catch (error) {
        console.error("ERROR: ", error);
        res.status(500).json(response_error("ERROR API-SQL -> " + error['sqlMessage']));
    }
}

export const ConsultarCliente = async (req, res) => {
    try {



    } catch (error) {
        console.error("ERROR: ", error);
        res.status(500).json(response_error("ERROR API-SQL -> " + error['sqlMessage']));
    }
}