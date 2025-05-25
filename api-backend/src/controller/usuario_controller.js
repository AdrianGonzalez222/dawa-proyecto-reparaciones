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
        console.error("ERROR: ", error);

        if (error.code === 'ER_DUP_ENTRY') {
            if (error.sqlMessage.includes('username')) {
                return res.status(409).json(response_bad_request("USERNAME YA REGISTRADO"));
            }
            if (error.sqlMessage.includes('email')) {
                return res.status(409).json(response_bad_request("EMAIL YA REGISTRADO"));
            }
        }

        res.status(500).json(response_error("ERROR API-SQL -> " + error['sqlMessage']));
    }
}

export const ActualizarUsuario = async (req, res) => {
    try {

        const { id } = req.body;
        const { username, password, email, rol } = req.body;
        const query = `
            UPDATE usuario
            SET username = ?, password = ?, email = ?, rol = ?
            WHERE id = ?
        `;

        const [rows] = await db_pool_connection.query(query, [username, password, email, rol, id]);
        if (rows.affectedRows === 0) {
            return res.status(404).json(response_not_found("USUARIO NO ENCONTRADO"));
        } else {
            console.log("UPDATE USER: ", rows);
            res.status(200).json(response_success(null, "USUARIO ACTUALIZADO CON EXITO"));
        }

    } catch (error) {
        console.error("ERROR: ", error);

        if (error.code === 'ER_DUP_ENTRY') {
            if (error.sqlMessage.includes('username')) {
                return res.status(409).json(response_bad_request("USERNAME YA REGISTRADO"));
            }
            if (error.sqlMessage.includes('email')) {
                return res.status(409).json(response_bad_request("EMAIL YA REGISTRADO"));
            }
        }

        res.status(500).json(response_error("ERROR API-SQL -> " + error['sqlMessage']));
    }
}

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

export const ListarUsuario = async (req, res) => {
    try {

        const query = `
            SELECT * FROM usuario
        `;
        
        const [rows] = await db_pool_connection.query(query);
        if (rows.length <= 0) {
            return res.status(404).json(response_not_found("USUARIOS NO ENCONTRADOS"));
        } else {
            console.log("LIST USER: ", rows);
            res.status(200).json(response_success(rows, "CONSULTA EXITOSA"));
        }

    } catch (error) {
        console.error("ERROR: ", error);
        res.status(500).json(response_error("ERROR API-SQL -> " + error['sqlMessage']));
    }
}

export const Login = async (req, res) => {
    try {

        const { username, password } = req.body;
        const query = `
            SELECT username, password, estado, rol
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

export const ConsultarUsuario = async (req, res) => {
    try {

        

    } catch (error) {
        console.error("ERROR: ", error);
        res.status(500).json(response_error("ERROR API-SQL -> " + error['sqlMessage']));
    }
}

export const EliminarUsuario = async (req, res) => {
    try {



    } catch (error) {
        console.error("ERROR: ", error);
        res.status(500).json(response_error("ERROR API-SQL -> " + error['sqlMessage']));
    }
}
