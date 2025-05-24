import { db_pool_connection } from "../database/db.js";
import { response_success, response_create, response_not_found, response_error, response_bad_request } from "../response/responses.js";

// REPARACION-REPUESTO
export const IngresarReparacionRepuesto = async (req, res) => {
    try {



    } catch (error) {
        res.status(500).json(response_error("ERROR API-SQL -> " + error['sqlMessage']));
    }
}

export const ConsultarReparacionRepuesto = async (req, res) => {
    try {



    } catch (error) {
        res.status(500).json(response_error("ERROR API-SQL -> " + error['sqlMessage']));
    }
}

export const ActualizarReparacionRepuesto = async (req, res) => {
    try {



    } catch (error) {
        res.status(500).json(response_error("ERROR API-SQL -> " + error['sqlMessage']));
    }
}

export const ListarReparacionRepuesto = async (req, res) => {
    try {



    } catch (error) {
        res.status(500).json(response_error("ERROR API-SQL -> " + error['sqlMessage']));
    }
}