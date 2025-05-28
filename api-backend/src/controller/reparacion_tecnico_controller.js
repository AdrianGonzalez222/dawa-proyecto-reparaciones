import { db_pool_connection } from "../database/db.js";
import {
  response_success,
  response_create,
  response_not_found,
  response_error,
  response_bad_request,
} from "../response/responses.js";

// REPACION-TECNICO
export const AsignarReparacionTecnico = async (req, res) => {
  const connection = await db_pool_connection.getConnection();

  try {
    const { id_reparacion, id_tecnico } = req.body;
    await connection.beginTransaction();

    const stateQuery = `
            SELECT estado
            FROM reparacion
            WHERE id = ?
        `;

    const [stateRows] = await connection.query(stateQuery, [id_reparacion]);
    if (stateRows[0].estado !== "pendiente") {
      await connection.rollback();
      return res
        .status(400)
        .json(response_bad_request("REPARACION NO DISPONIBLE"));
    }

    const updateQuery = `
            UPDATE reparacion 
            SET estado = 'asignada', fecha_asignacion = NOW() 
            WHERE id = ?
        `;

    const [updateResult] = await connection.query(updateQuery, [id_reparacion]);

    const insertQuery = `
            INSERT INTO reparacion_tecnico
            (id_tecnico, id_reparacion)
            VALUES (?, ?)
        `;

    const [rows] = await connection.query(insertQuery, [
      id_tecnico,
      id_reparacion,
    ]);
    await connection.commit();
    console.log("STATE REPAIR: ", stateRows);
    console.log("UPDATE REPAIR: ", updateResult);
    console.log("ASIGNAR REPAIR: ", rows);
    res
      .status(201)
      .json(response_create(rows.insertId, "REPARACIÓN ASIGNADA CON ÉXITO"));
  } catch (error) {
    await connection.rollback();
    console.error("ERROR: ", error);
    res
      .status(500)
      .json(response_error("ERROR API-SQL -> " + error.sqlMessage));
  } finally {
    connection.release();
  }
};

export const ConsultarReparacionTecnico = async (req, res) => {
  try {
    const { id_tecnico } = req.body;
    const query = `
            SELECT 
                r.id, r.equipo, r.fecha_asignacion, r.fecha_fin, r.estado,
                c.cedula, CONCAT(c.nombres, ' ', c.apellidos) AS nombre_cliente,
                r.problema, rt.observacion, rt.precio_servicio, c.celular, c.direccion
            FROM reparacion r
            INNER JOIN reparacion_tecnico rt ON r.id = rt.id_reparacion
            INNER JOIN cliente c ON r.id_cliente = c.id
            WHERE rt.id_tecnico = ?
            ORDER BY r.fecha_asignacion DESC
        `;

    const [rows] = await db_pool_connection.query(query, [id_tecnico]);
    if (rows.length <= 0) {
      return res
        .status(404)
        .json(
          response_not_found("LISTA DE REPARACIONES DEL TECNICO NO ENCONTRADAS")
        );
    } else {
      rows.forEach((row) => {
        ["fecha_asignacion", "fecha_fin"].forEach((field) => {
          if (row[field]) {
            row[field] = new Date(row[field]).toLocaleString("en-US", {
              timeZone: "America/Bogota",
            });
          }
        });
      });

      console.log("PERSONAL ORDER-REPAIR: ", rows);
      res.status(200).json(response_success(rows, "CONSULTA EXITOSA"));
    }
  } catch (error) {
    console.error("ERROR: ", error);
    res
      .status(500)
      .json(response_error("ERROR API-SQL -> " + error["sqlMessage"]));
  }
};

export const ActualizarDatosReparacionTecnico = async (req, res) => {
  try {
    const { id_reparacion, observacion, precio_servicio, estado } = req.body;

    if (!id_reparacion) {
      return res.status(400).json(response_error("Falta el ID de reparación."));
    }

    const fields = [];
    const values = [];

    if (observacion !== undefined) {
      fields.push("observacion = ?");
      values.push(observacion);
    }

    if (precio_servicio !== undefined) {
      fields.push("precio_servicio = ?");
      values.push(precio_servicio);
    }

    if (estado !== undefined) {
      fields.push("estado = ?");
      values.push(estado);
      if (estado === "reparado") {
        fields.push("fecha_reparado = NOW()");
      }
    }

    if (fields.length === 0) {
      return res
        .status(400)
        .json(response_error("No se proporcionaron datos para actualizar."));
    }

    const query = `
      UPDATE reparacion_tecnico
      SET ${fields.join(", ")}
      WHERE id_reparacion = ?
    `;
    values.push(id_reparacion);

    const [rows] = await db_pool_connection.query(query, values);

    if (rows.affectedRows === 0) {
      return res
        .status(404)
        .json(response_not_found("ORDEN DE REPARACION NO ENCONTRADA"));
    }

    console.log("UPDATE ORDER-REPAIR:", rows);
    res
      .status(200)
      .json(
        response_success(null, "ORDEN DE REPARACION ACTUALIZADA CON EXITO")
      );
  } catch (error) {
    console.error("ERROR:", error);
    res
      .status(500)
      .json(response_error("ERROR API-SQL -> " + error["sqlMessage"]));
  }
};
