import { Console } from "console";
import { db_pool_connection } from "../database/db.js";
import { response_success, response_create, response_not_found, response_error, response_bad_request } from "../response/responses.js";

// USUARIO
export const IngresarUsuario = async (req, res) => {
    try {

    const { username, password, email, rol } = req.body;  
    const query = `
            INSERT INTO usuario 
            (username, password, email, rol)
            VALUES (?, ?, ?, ?)
        `;

    const [rows] = await db_pool_connection.query(query, [username, password, email, rol]);
    console.log("INSERT USER: ", rows);
    res.status(201).json(response_create(rows.insertId, "USUARIO REGISTRADO CON EXITO"));

    } catch (error) {
        res.status(500).json(response_error("ERROR API-SQL -> " + error['sqlMessage']));
    }
}

export const ConsultarUsuario = async (req, res) => {
    try {



    } catch (error) {
        res.status(500).json(response_error("ERROR API-SQL -> " + error['sqlMessage']));
    }
}

export const ActualizarUsuario = async (req, res) => {
    try {



    } catch (error) {
        res.status(500).json(response_error("ERROR API-SQL -> " + error['sqlMessage']));
    }
}

export const ListarUsuario = async (req, res) => {
    try {

        const query = `
            SELECT * FROM usuario
        `;
        
        const [rows] = await db_pool_connection.query(query);
        if (rows.length <= 0) 
            res.status(404).json(response_not_found("USUARIOS NO ENCONTRADOS"));
        else 
            res.status(200).json(response_success(rows, "CONSULTA EXITOSA"));

    } catch (error) {
        res.status(500).json(response_error("ERROR API-SQL -> " + error['sqlMessage']));
    }
}

export const EliminarUsuario = async (req, res) => {
    try {



    } catch (error) {
        res.status(500).json(response_error("ERROR API-SQL -> " + error['sqlMessage']));
    }
}