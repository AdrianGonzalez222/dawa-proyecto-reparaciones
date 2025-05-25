import { db_pool_connection } from "../database/db.js";
import { response_success, response_create, response_not_found, response_error, response_bad_request } from "../response/responses.js";

// REPUESTO
export const IngresarRepuesto = async (req, res) => {
    try {

        const { codigo, descripcion, stock, precio } = req.body;  
        const query = `
                INSERT INTO repuesto
                (codigo, descripcion, stock, precio) 
                VALUES (?, ?, ?, ?)
            `;

        const [rows] = await db_pool_connection.query(query, [codigo, descripcion, stock, precio]);
        console.log("INSERT REP: ", rows);
        res.status(201).json(response_create(rows.insertId, "REPUESTO REGISTRADO CON EXITO"));

    } catch (error) {
        console.error("ERROR: ", error);

        if (error.code === 'ER_DUP_ENTRY') {
            if (error.sqlMessage.includes('codigo')) {
                return res.status(409).json(response_bad_request("CODIGO YA REGISTRADO"));
            }
        }

        res.status(500).json(response_error("ERROR API-SQL -> " + error['sqlMessage']));
    }
}

export const ActualizarRepuesto = async (req, res) => {
    try {

        const { id } = req.body;
        const { codigo, descripcion, stock, precio } = req.body;
        const query = `
            UPDATE repuesto
            SET codigo = ?, descripcion = ?, stock = ?, precio = ?
            WHERE id = ?
        `;

        const [rows] = await db_pool_connection.query(query, [codigo, descripcion, stock, precio, id]);
        if (rows.affectedRows === 0) {
            return res.status(404).json(response_not_found("REPUESTO NO ENCONTRADO"));
        } else {
            console.log("UPDATE REP: ", rows);
            res.status(200).json(response_success(null, "REPUESTO ACTUALIZADO CON EXITO"));
        }

    } catch (error) {
        console.error("ERROR: ", error);

        if (error.code === 'ER_DUP_ENTRY') {
            if (error.sqlMessage.includes('codigo')) {
                return res.status(409).json(response_bad_request("CODIGO YA REGISTRADO"));
            }
        }

        res.status(500).json(response_error("ERROR API-SQL -> " + error['sqlMessage']));
    }
}

export const ListarRepuesto = async (req, res) => {
    try {

        const query = `
            SELECT * FROM repuesto
        `;
        
        const [rows] = await db_pool_connection.query(query);
        if (rows.length <= 0) {
            return res.status(404).json(response_not_found("REPUESTOS NO ENCONTRADOS"));
        } else {
            console.log("LIST REP: ", rows);
            res.status(200).json(response_success(rows, "CONSULTA EXITOSA"));
        }

    } catch (error) {
        console.error("ERROR: ", error);
        res.status(500).json(response_error("ERROR API-SQL -> " + error['sqlMessage']));
    }
}

export const EstadoRepuesto = async (req, res) => {
    try {

        const { id, estado } = req.body;
        const query = `
            UPDATE repuesto
            SET estado = ?
            WHERE id = ?
        `;

        const [rows] = await db_pool_connection.query(query, [estado, id]);
        if (rows.affectedRows === 0) {
            return res.status(404).json(response_not_found("REPUESTO NO ENCONTRADO"));
        } else {
            console.log("STATUS REP: ", rows);
            res.status(200).json(response_success(null, "ESTADO DE REPUESTO ACTUALIZADO"));
        }

    } catch (error) {
        console.error("ERROR: ", error);
        res.status(500).json(response_error("ERROR API-SQL -> " + error['sqlMessage']));
    }
}

export const StockRepuesto = async (req, res) => {
    try {

        const { id, cantidad } = req.body;
        const selectQuery = `
            SELECT stock, codigo
            FROM repuesto 
            WHERE id = ?
        `;

        const [rows1] = await db_pool_connection.query(selectQuery, [id]);
        if (rows1.length === 0) {
            return res.status(404).json(response_not_found("REPUESTO NO ENCONTRADO"));
        }

        const stockActual = rows1[0].stock;
        const nuevoStock = stockActual + cantidad;
        const updateQuery = `
            UPDATE repuesto 
            SET stock = ? 
            WHERE id = ?
        `;

        const [rows2] = await db_pool_connection.query(updateQuery, [nuevoStock, id]);
        if (rows2.affectedRows === 0) {
            return res.status(400).json(response_bad_request("ERROR AL ACTUALIZAR STOCK"));
        }

        res.status(200).json(response_success(null, "STOCK ACTUALIZADO: " + stockActual + " -> " + nuevoStock));

    } catch (error) {
        console.error("ERROR: ", error);
        res.status(500).json(response_error("ERROR API-SQL -> " + error['sqlMessage']));
    }
}

export const EliminarRepuesto = async (req, res) => {
    try {



    } catch (error) {
        console.error("ERROR: ", error);
        res.status(500).json(response_error("ERROR API-SQL -> " + error['sqlMessage']));
    }
}

export const ConsultarRepuesto = async (req, res) => {
    try {



    } catch (error) {
        console.error("ERROR: ", error);
        res.status(500).json(response_error("ERROR API-SQL -> " + error['sqlMessage']));
    }
}