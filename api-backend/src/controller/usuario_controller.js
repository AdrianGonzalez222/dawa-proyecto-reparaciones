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

export const IngresarUsuarioTecnico = async (req, res) => {
    const connection = await db_pool_connection.getConnection();

    try {

        await connection.beginTransaction();
        const { username, password, email, rol } = req.body;
        const { cedula, nombres, apellidos, celular } = req.body;

        const queryUsuario = `
            INSERT INTO usuario (username, password, email, rol)
            VALUES (?, ?, ?, ?)
        `;

        const [usuarioResult] = await connection.query(queryUsuario, [username, password, email, rol]);
        const id_usuario = usuarioResult.insertId;

        const queryTecnico = `
            INSERT INTO tecnico (cedula, nombres, apellidos, celular, id_usuario)
            VALUES (?, ?, ?, ?, ?)
        `;

        const [tecnicoResult] = await connection.query(queryTecnico, [cedula, nombres, apellidos, celular, id_usuario]);
        await connection.commit();
        res.status(201).json(response_create(tecnicoResult.insertId, "USUARIO Y TECNICO REGISTRADOS CON ÉXITO"));

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

export const ActualizarUsuarioTecnico = async (req, res) => {
    const connection = await db_pool_connection.getConnection();

    try {
        await connection.beginTransaction();
        const { id_usuario, username, password, email } = req.body;
        const { cedula, nombres, apellidos, celular } = req.body;

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

        const queryTecnico = `
            UPDATE tecnico
            SET cedula = ?, nombres = ?, apellidos = ?, celular = ?
            WHERE id_usuario = ?
        `;

        const [tecnicoResult] = await connection.query(queryTecnico, [cedula, nombres, apellidos, celular, id_usuario]);
        if (tecnicoResult.affectedRows === 0) {
            await connection.rollback();
            return res.status(404).json(response_not_found("TECNICO NO ENCONTRADO"));
        }
        await connection.commit();
        res.status(200).json(response_success(null, "USUARIO Y TECNICO ACTUALIZADOS CON ÉXITO"));

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
        res.status(200).json(response_success(null, "USUARIO Y CLIENTE ACTUALIZADOS CON ÉXITO"));

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

        res.status(200).json(response_success(rows[0], rol.toUpperCase() + " ENCONTRADO"));

    } catch (error) {
        console.error("ERROR: ", error);
        res.status(500).json(response_error("ERROR API-SQL ->  " + error.sqlMessage));
    }
};

export const ConsultarUsuarioTecnico = async (req, res) => {
    try {

        const { id } = req.body;
        const query = `
            SELECT 
                u.username, u.password, u.email,
                t.cedula, t.nombres, t.apellidos, t.celular
            FROM usuario u
            INNER JOIN tecnico t ON u.id = t.id_usuario
            WHERE u.id = ?
        `;
        
        const [rows] = await db_pool_connection.query(query, [id]);
        if (rows.length <= 0) {
            return res.status(404).json(response_not_found("USUARIO TECNICO NO ENCONTRADO"));
        } else {
            console.log("SELECT TEC: ", rows);
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
