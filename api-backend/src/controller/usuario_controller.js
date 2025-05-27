import { db_pool_connection } from "../database/db.js";
import { response_success, response_create, response_not_found, response_error, response_bad_request } from "../response/responses.js";

// USUARIO
export const Login = async (req, res) => {
    try {

        const { username, password } = req.body;
        const query = `
            SELECT id, username, rol
            FROM usuario
            WHERE username = ? AND password = ? AND estado = 'activo'
        `;

        const [rows] = await db_pool_connection.query(query, [username, password]);
        if (rows.length === 0) {
            return res.status(404).json(response_not_found("CREDENCIALES INCORRECTAS"));
        } else {
            console.log("LOGIN USER: ", rows);
            res.status(200).json(response_success(rows, "LOGIN EXITOSO"));
        }

    } catch (error) {
        console.error("ERROR: ", error);
        res.status(500).json(response_error("ERROR AL OBTENER DATOS DEL USUARIO -> " + error['sqlMessage']));
    }
}

export const ConsultarUsuarioRol = async (req, res) => {
    try {

        const { id_usuario, rol } = req.body;
        let query;
        let table;

        if (rol === 'cliente') {
            table = 'cliente';
        } else if (rol === 'tecnico' || rol === 'admin') {
            table = 'tecnico';
        } 

        query = "SELECT id FROM " + table + " WHERE id_usuario = ?";
        
        const [rows] = await db_pool_connection.query(query, [id_usuario]);
        if (rows.length === 0) {
            return res.status(404).json(response_not_found(rol.toUpperCase() + " NO ENCONTRADO"));
        }

        console.log("SELECT USER: ", rows);
        res.status(200).json(response_success(rows[0], rol.toUpperCase() + " ENCONTRADO"));

    } catch (error) {
        console.error("ERROR: ", error);
        res.status(500).json(response_error("ERROR API-SQL ->  " + error.sqlMessage));
    }
};

export const EstadoUsuario = async (req, res) => {
    try {

        const { id, estado } = req.body;
        const query = `
            UPDATE usuario
            SET estado = ?
            WHERE id = ?
        `;

        const [rows] = await db_pool_connection.query(query, [estado, id]);
        if (rows.affectedRows === 0) {
            return res.status(404).json(response_not_found("USUARIO NO ENCONTRADO"));
        } else {
            console.log("STATUS USER: ", rows);
            res.status(200).json(response_success(null, "ESTADO DE USUARIO ACTUALIZADO"));
        }

    } catch (error) {
        console.error("ERROR: ", error);
        res.status(500).json(response_error("ERROR API-SQL -> " + error['sqlMessage']));
    }
}
