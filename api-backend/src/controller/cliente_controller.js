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

export const ConsultarUsuarioCliente = async (req, res) => {
    try {

        const { id } = req.body;
        const query = `
            SELECT 
                u.username, u.password, u.email,
                c.cedula, c.nombres, c.apellidos, c.celular, c.direccion
            FROM usuario u
            INNER JOIN cliente c ON u.id = c.id_usuario
            WHERE u.id = ?
        `;
        
        const [rows] = await db_pool_connection.query(query, [id]);
        if (rows.length <= 0) {
            return res.status(404).json(response_not_found("USUARIO CLIENTE NO ENCONTRADO"));
        } else {
            console.log("SELECT TEC: ", rows);
            res.status(200).json(response_success(rows, "CONSULTA EXITOSA"));
        }

    } catch (error) {
        console.error("ERROR: ", error);
        res.status(500).json(response_error("ERROR API-SQL -> " + error['sqlMessage']));
    }
}

export const IngresarUsuarioCliente = async (req, res) => {
    const connection = await db_pool_connection.getConnection(); 

    try {

        await connection.beginTransaction();
        const { username, password, email, rol } = req.body;
        const { cedula, nombres, apellidos, celular, direccion } = req.body;

        const queryUsuario = `
            INSERT INTO usuario (username, password, email, rol)
            VALUES (?, ?, ?, ?)
        `;

        const [usuarioResult] = await connection.query(queryUsuario, [username, password, email, rol]);
        const id_usuario = usuarioResult.insertId;

        const queryCliente = `
            INSERT INTO cliente (cedula, nombres, apellidos, celular, direccion, id_usuario)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const [clienteResult] = await connection.query(queryCliente, [cedula, nombres, apellidos, celular, direccion, id_usuario]);
        await connection.commit();
        console.log("INSERT USER-CLI: ", usuarioResult);
        console.log("INSERT CLI: ", clienteResult);
        res.status(201).json(response_create(clienteResult.insertId, "USUARIO Y CLIENTE REGISTRADOS CON ÉXITO"));

    } catch (error) {
        await connection.rollback();
        console.error("ERROR: ", error);

        if (error.code === 'ER_DUP_ENTRY') {
            if (error.sqlMessage.includes('username')) {
                return res.status(409).json(response_bad_request("USERNAME YA REGISTRADO"));
            }
            if (error.sqlMessage.includes('email')) {
                return res.status(409).json(response_bad_request("EMAIL YA REGISTRADO"));
            }
            if (error.sqlMessage.includes('cedula')) {
                return res.status(409).json(response_bad_request("CEDULA YA REGISTRADA"));
            }
        }

        res.status(500).json(response_error("ERROR API-SQL -> " + error.sqlMessage));
    } finally {
        connection.release();
    }
}

export const ActualizarUsuarioCliente = async (req, res) => {
    const connection = await db_pool_connection.getConnection();

    try {
        await connection.beginTransaction();
        const { id_usuario, username, password, email } = req.body;
        const { cedula, nombres, apellidos, celular, direccion } = req.body;

        const queryUsuario = `
            UPDATE usuario
            SET username = ?, password = ?, email = ?
            WHERE id = ?
        `;

        const [usuarioResult] = await connection.query(queryUsuario, [username, password, email, id_usuario]);
        if (usuarioResult.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json(response_not_found("USUARIO NO ENCONTRADO"));
        }

        const queryCliente = `
            UPDATE cliente
            SET cedula = ?, nombres = ?, apellidos = ?, celular = ?, direccion = ?
            WHERE id_usuario = ?
        `;

        const [clienteResult] = await connection.query(queryCliente, [cedula, nombres, apellidos, celular, direccion, id_usuario]);
        if (clienteResult.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json(response_not_found("CLIENTE NO ENCONTRADO"));
        }

        await connection.commit();
        console.log("UPDATE USER-CLI: ", usuarioResult);
        console.log("UPDATE CLI: ", clienteResult);
        res.status(200).json(response_success(null, "USUARIO Y CLIENTE ACTUALIZADOS CON EXITO"));

    } catch (error) {
        await connection.rollback();
        console.error("ERROR: ", error);

        if (error.code === 'ER_DUP_ENTRY') {
            if (error.sqlMessage.includes('username')) {
                return res.status(409).json(response_bad_request("USERNAME YA REGISTRADO"));
            }
            if (error.sqlMessage.includes('email')) {
                return res.status(409).json(response_bad_request("EMAIL YA REGISTRADO"));
            }
            if (error.sqlMessage.includes('cedula')) {
                return res.status(409).json(response_bad_request("CEDULA YA REGISTRADA"));
            }
        }

        res.status(500).json(response_error("ERROR API-SQL -> " + error.sqlMessage));
    } finally {
        connection.release();
    }
};
