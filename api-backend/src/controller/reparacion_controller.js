import { db_pool_connection } from "../database/db.js";
import { response_success, response_create, response_not_found, response_error, response_bad_request } from "../response/responses.js";

// REPARACION
export const IngresarReparacion = async (req, res) => {
    try {



    } catch (error) {
        res.status(500).json(response_error("ERROR API-SQL -> " + error['sqlMessage']));
    }
}

export const ConsultarReparacion = async (req, res) => {
    try {



    } catch (error) {
        res.status(500).json(response_error("ERROR API-SQL -> " + error['sqlMessage']));
    }
}

export const ActualizarReparacion = async (req, res) => {
    try {



    } catch (error) {
        res.status(500).json(response_error("ERROR API-SQL -> " + error['sqlMessage']));
    }
}

export const ListarReparacion = async (req, res) => {
    try {



    } catch (error) {
        res.status(500).json(response_error("ERROR API-SQL -> " + error['sqlMessage']));
    }
}

export const EliminarReparacion = async (req, res) => {
    try {



    } catch (error) {
        res.status(500).json(response_error("ERROR API-SQL -> " + error['sqlMessage']));
    }
}