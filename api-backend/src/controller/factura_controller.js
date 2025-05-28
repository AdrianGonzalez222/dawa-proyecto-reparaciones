import { db_pool_connection } from "../database/db.js";
import { response_success, response_create, response_not_found, response_error, response_bad_request } from "../response/responses.js";

// FACTURA
export const IngresarFactura = async (req, res) => {
    const connection = await db_pool_connection.getConnection();

    try {

        const { num_fact, iva_app, iva, subtotal, total, id_reparacion } = req.body;
        await connection.beginTransaction();

        const query = `
            SELECT estado FROM reparacion WHERE id = ?
        `;

        const [repairRows] = await connection.query(query, [id_reparacion]);

        if (repairRows.length === 0) {
            await connection.rollback();
            return res.status(404).json(response_not_found("REPARACIÓN NO ENCONTRADA"));
        }

        if (repairRows[0].estado === 'cancelada' || repairRows[0].estado === 'finalizada') {
            await connection.rollback();
            return res.status(400).json(response_bad_request("LA REPARACIÓN YA FUE FINALIZADA O CANCELADA"));
        }

        const insertFacturaQuery = `
            INSERT INTO factura (num_fact, iva_app, iva, subtotal, total, id_reparacion)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const [insertResult] = await connection.query(insertFacturaQuery, [
            num_fact, iva_app, iva, subtotal, total, id_reparacion
        ]);

        const updateReparacionQuery = `
            UPDATE reparacion
            SET estado = 'finalizada', fecha_fin = NOW()
            WHERE id = ?
        `;

        await connection.query(updateReparacionQuery, [id_reparacion]);
        await connection.commit();
        res.status(201).json(response_create(insertResult.insertId, "FACTURA INGRESADA Y REPARACIÓN FINALIZADA"));

    } catch (error) {
        await connection.rollback();
        console.error("ERROR: ", error);
        res.status(500).json(response_error("ERROR API-SQL -> " + error.sqlMessage));
    } finally {
        connection.release();
    }
}

export const ConsultarReparadosFactura = async (req, res) => {
    try {

        const { id_tecnico } = req.body;

        const reparacionesQuery = `
            SELECT 
                r.id, r.equipo, r.problema,
                c.cedula, CONCAT(c.nombres, ' ', c.apellidos) AS nombre_cliente,
                rt.precio_servicio, rt.estado, rt.fecha_reparado
            FROM reparacion r
            INNER JOIN reparacion_tecnico rt ON r.id = rt.id_reparacion
            INNER JOIN cliente c ON r.id_cliente = c.id
            WHERE rt.id_tecnico = ? AND rt.estado = 'reparado'
            ORDER BY rt.fecha_reparado DESC
        `;

        const [reparaciones] = await db_pool_connection.query(reparacionesQuery, [id_tecnico]);
        if (reparaciones.length === 0) {
            return res.status(404).json(response_not_found("REPARACIONES NO ENCONTRADAS"));
        }

        const repuestoQuery = `
            SELECT 
                rr.id_reparacion,
                rr.cantidad,
                r.codigo, r.descripcion, r.precio,
                r.id AS id_repuesto
            FROM reparacion_repuesto rr
            INNER JOIN repuesto r ON rr.id_repuesto = r.id
            WHERE rr.id_reparacion IN (?)
        `;

        const reparacionIds = reparaciones.map(r => r.id);
        const [repuestos] = await db_pool_connection.query(repuestoQuery, [reparacionIds]);

        const reparacionesConRepuestos = reparaciones.map(reparacion => ({
            ...reparacion,
            repuestos: repuestos.filter(r => r.id_reparacion === reparacion.id)
        }));

        res.status(200).json(response_success(reparacionesConRepuestos, "CONSULTA EXITOSA"));

    } catch (error) {
        console.error("ERROR: ", error);
        res.status(500).json(response_error("ERROR API-SQL -> " + error['sqlMessage']));
    }
}

export const ListarFactura = async (req, res) => {
    try {

        const query = `
            SELECT 
                f.id, f.num_fact, f.total, f.fecha, f.estado,
                c.cedula AS cedula_cliente, CONCAT(c.nombres, ' ', c.apellidos) AS cliente,
                CONCAT(t.nombres, ' ', t.apellidos) AS tecnico
            FROM factura f
            INNER JOIN reparacion r ON  r.id = f.id_reparacion
            INNER JOIN reparacion_tecnico rt ON rt.id_reparacion = f.id_reparacion
            INNER JOIN cliente c ON c.id = r.id_cliente
            INNER JOIN tecnico t ON t.id = rt.id_tecnico
            ORDER BY f.fecha DESC
        `;
        
        const [rows] = await db_pool_connection.query(query);
        if (rows.length <= 0) {
            return res.status(404).json(response_not_found("FACTURAS NO ENCONTRADAS"));
        } else {
            console.log("LIST FAC: ", rows);
            res.status(200).json(response_success(rows, "CONSULTA EXITOSA"));
        }

    } catch (error) {
        console.error("ERROR: ", error);
        res.status(500).json(response_error("ERROR API-SQL -> " + error['sqlMessage']));
    }
}

export const AnularFactura = async (req, res) => {
    const connection = await db_pool_connection.getConnection();
    
    try {

        const { id } = req.body;
        await connection.beginTransaction();

        const querySelect = `
            SELECT estado FROM factura WHERE id = ?
        `;

        const [facturaRows] = await connection.query(querySelect, [id]);
        if (facturaRows.length === 0) {
            await connection.rollback();
            return res.status(404).json(response_not_found("FACTURA NO ENCONTRADA"));
        }

        if (facturaRows[0].estado === 'anulada') {
            await connection.rollback();
            return res.status(400).json(response_bad_request("LA FACTURA YA ESTÁ ANULADA"));
        }

        const queryUpdate = `
            UPDATE factura
            SET iva_app = 0.00, iva = 0.00, subtotal = 0.00, total = 0.00, estado = 'anulada'
            WHERE id = ?
        `;

        const [updateResult] = await connection.query(queryUpdate, [id]);

        await connection.commit();  
        console.log("UPDATE FACTURA: ", querySelect);
        console.log("UPDATE FACTURA: ", updateResult);
        res.status(200).json(response_success(null, "FACTURA ANULADA CON ÉXITO"));

    } catch (error) {
        await connection.rollback();
        console.error("ERROR: ", error);
        res.status(500).json(response_error("ERROR API-SQL -> " + error.sqlMessage));
    } finally {
        connection.release();
    }
}
