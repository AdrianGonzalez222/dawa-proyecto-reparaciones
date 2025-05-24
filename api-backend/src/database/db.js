import { createPool } from "mysql2/promise";
import { HOST_DB, USER_DB, DATABASE, PASSWORD, PORT_DB } from "../config/config.js";

export const db_pool_connection = createPool(
    {
        host: HOST_DB,
        user: USER_DB,
        password: PASSWORD,
        database: DATABASE,
        port: PORT_DB,
    }
);