import { db_pool_connection } from "../database/db.js";
import { response_success, response_create, response_not_found, response_error, response_bad_request } from "../response/responses.js";

// TECNICO
export const ListarTecnico = async (req, res) => {
    try {

        const query = `
            SELECT 
                u.id, t.cedula, t.nombres, t.apellidos, t.celular,
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
        console.log("INSERT USER-TEC: ", usuarioResult);
        console.log("INSERT TEC: ", tecnicoResult);
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
        console.log("UPDATE USER-TEC: ", usuarioResult);
        console.log("UPDATE TEC: ", tecnicoResult);
        res.status(200).json(response_success(null, "USUARIO Y TECNICO ACTUALIZADOS CON EXITO"));      

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
