import { db_pool_connection } from "../database/db.js";
import { response_success, response_create, response_not_found, response_error, response_bad_request } from "../response/responses.js";

// REPUESTO
export const IngresarRepuesto = async (req, res) => {
    try {



    } catch (error) {
        res.status(500).json(response_error("ERROR API-SQL -> " + error['sqlMessage']));
    }
}

export const ConsultarRepuesto = async (req, res) => {
    try {



    } catch (error) {
        res.status(500).json(response_error("ERROR API-SQL -> " + error['sqlMessage']));
    }
}

export const ActualizarRepuesto = async (req, res) => {
    try {



    } catch (error) {
        res.status(500).json(response_error("ERROR API-SQL -> " + error['sqlMessage']));
    }
}

export const ListarRepuesto = async (req, res) => {
    try {



    } catch (error) {
        res.status(500).json(response_error("ERROR API-SQL -> " + error['sqlMessage']));
    }
}

export const EliminarRepuesto = async (req, res) => {
    try {



    } catch (error) {
        res.status(500).json(response_error("ERROR API-SQL -> " + error['sqlMessage']));
    }
}