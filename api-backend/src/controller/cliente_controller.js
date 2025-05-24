import { db_pool_connection } from "../database/db.js";
import { response_success, response_create, response_not_found, response_error, response_bad_request } from "../response/responses.js";

// CLIENTE
export const IngresarCliente = async (req, res) => {
    try {



    } catch (error) {
        res.status(500).json(response_error("ERROR API-SQL -> " + error['sqlMessage']));
    }
}

export const ConsultarCliente = async (req, res) => {
    try {



    } catch (error) {
        res.status(500).json(response_error("ERROR API-SQL -> " + error['sqlMessage']));
    }
}

export const ActualizarCliente = async (req, res) => {
    try {



    } catch (error) {
        res.status(500).json(response_error("ERROR API-SQL -> " + error['sqlMessage']));
    }
}

export const ListarCliente = async (req, res) => {
    try {



    } catch (error) {
        res.status(500).json(response_error("ERROR API-SQL -> " + error['sqlMessage']));
    }
}

export const EliminarCliente = async (req, res) => {
    try {



    } catch (error) {
        res.status(500).json(response_error("ERROR API-SQL -> " + error['sqlMessage']));
    }
}