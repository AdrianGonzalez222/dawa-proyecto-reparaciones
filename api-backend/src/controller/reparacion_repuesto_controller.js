import { db_pool_connection } from "../database/db.js";
import { response_success, response_create, response_not_found, response_error, response_bad_request } from "../response/responses.js";

// REPARACION-REPUESTO
export const ListarReparacionRepuesto = async (req, res) => {
    try {

        const { id_reparacion } = req.body;

        const disponiblesQuery = `
            SELECT * FROM repuesto
            WHERE estado = 'activo' AND stock > 0
        `;

        const [disponibles] = await db_pool_connection.query(disponiblesQuery);

        const asignadosQuery = `
            SELECT 
                rr.cantidad, 
                r.codigo, r.descripcion, r.precio,
                r.id
            FROM reparacion_repuesto rr
            INNER JOIN repuesto r ON rr.id_repuesto = r.id
            WHERE rr.id_reparacion = ?
        `;

        const [asignados] = await db_pool_connection.query(asignadosQuery, [id_reparacion]);
        if (disponibles.length <= 0) {
            return res.status(404).json(response_not_found("REPUESTOS NO ENCONTRADOS"));
        } else {
            const data = {
                disponibles,
                asignados
            };
            console.log("LIST REP: ", data);
            res.status(200).json(response_success(data, "CONSULTA EXITOSA"));
        }

    } catch (error) {
        console.error("ERROR: ", error);
        res.status(500).json(response_error("ERROR API-SQL -> " + error['sqlMessage']));
    }
}

export const AdicionarReparacionRepuesto = async (req, res) => {
    const connection = await db_pool_connection.getConnection();

    try {
        const { cantidad, id_reparacion, id_repuesto } = req.body;

        const checkQuery = `
            SELECT 1 FROM reparacion_repuesto 
            WHERE id_reparacion = ? AND id_repuesto = ?
        `;

        const [exists] = await connection.query(checkQuery, [id_reparacion, id_repuesto]);
        if (exists.length > 0) {
            return res.status(409).json(response_error("REPUESTO YA ADICIONADO A ESTA REPARACION"));
        }
        await connection.beginTransaction();

        const consultQuery = `
            SELECT stock FROM repuesto 
            WHERE id = ?
        `;

        const [stockRows] = await connection.query(consultQuery, [id_repuesto]);
        if (stockRows.length === 0) {
            await connection.rollback();
            return res.status(404).json(response_not_found("REPUESTO NO ENCONTRADO"));
        }

        const stockActual = stockRows[0].stock;
        if (stockActual < cantidad) {
            await connection.rollback();
            return res.status(400).json(response_bad_request("STOCK INSUFICIENTE"));
        }

        const insertQuery = `
            INSERT INTO reparacion_repuesto (cantidad, id_reparacion, id_repuesto) 
            VALUES (?, ?, ?)
        `;

        const [insertResult] = await connection.query(insertQuery, [cantidad, id_reparacion, id_repuesto]);
        const nuevoStock = stockActual - cantidad;

        const updateStockQuery = `
            UPDATE repuesto 
            SET stock = ? 
            WHERE id = ?
        `;

        const [updateResult] = await connection.query(updateStockQuery, [nuevoStock, id_repuesto]);
        if (updateResult.affectedRows === 0) {
            await connection.rollback();
            return res.status(400).json(response_bad_request("ERROR AL ACTUALIZAR STOCK"));
        }

        await connection.commit();
        console.log("INSERT REP: ", insertResult);
        res.status(201).json(response_create(insertResult.insertId, "REPUESTO ADICIONADO CON EXITO. STOCK ACTUALIZADO: " + stockActual + " -> " + nuevoStock));

    } catch (error) {
        await connection.rollback();
        console.error("ERROR: ", error);
        res.status(500).json(response_error("ERROR API-SQL -> " + error['sqlMessage']));
    } finally {
        connection.release();
    }
}

export const QuitarReparacionRepuesto = async (req, res) => {
    const connection = await db_pool_connection.getConnection();
    
    try {
        const { id_reparacion, id_repuesto } = req.body;

        const checkQuery = `
            SELECT cantidad FROM reparacion_repuesto 
            WHERE id_reparacion = ? AND id_repuesto = ?
        `;

        const [repuestoRows] = await connection.query(checkQuery, [id_reparacion, id_repuesto]);
        if (repuestoRows.length === 0) {
            return res.status(404).json(response_not_found("EL REPUESTO NO ESTÁ ASOCIADO A ESTA REPARACIÓN"));
        }

        const cantidad = repuestoRows[0].cantidad;
        await connection.beginTransaction();

        const stockQuery = `
            SELECT stock FROM repuesto 
            WHERE id = ?
        `;

        const [stockRows] = await connection.query(stockQuery, [id_repuesto]);
        if (stockRows.length === 0) {
            await connection.rollback();
            return res.status(404).json(response_not_found("REPUESTO NO ENCONTRADO"));
        }

        const stockActual = stockRows[0].stock;
        const nuevoStock = stockActual + cantidad;

        const deleteQuery = `
            DELETE FROM reparacion_repuesto 
            WHERE id_reparacion = ? AND id_repuesto = ?
        `;

        const [deleteResult] = await connection.query(deleteQuery, [id_reparacion, id_repuesto]);
        if (deleteResult.affectedRows === 0) {
            await connection.rollback();
            return res.status(400).json(response_bad_request("NO SE PUDO ELIMINAR EL REGISTRO DE REPARACION_REPUESTO"));
        }

        const updateStockQuery = `
            UPDATE repuesto 
            SET stock = ?
            WHERE id = ?
        `;

        const [updateResult] = await connection.query(updateStockQuery, [nuevoStock, id_repuesto]);
        if (updateResult.affectedRows === 0) {
            await connection.rollback();
            return res.status(400).json(response_bad_request("ERROR AL ACTUALIZAR STOCK"));
        }

        await connection.commit();
        res.status(200).json(response_success(null, "REPUESTO QUITADO CON EXITO. STOCK ACTUALIZADO: " + stockActual + " -> " + nuevoStock));

    } catch (error) {
        await connection.rollback();
        console.error("ERROR: ", error);
        res.status(500).json(response_error("ERROR API-SQL -> " + error['sqlMessage']));
    } finally {
        connection.release();
    }
}
