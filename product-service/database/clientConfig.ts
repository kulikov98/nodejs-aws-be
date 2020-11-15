import { ConnectionOptions } from "typeorm";
import {Product, Stock} from "../models/index";


const { PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD } = process.env;

export const CONNECTION_OPTIONS: ConnectionOptions = {
    type: "postgres",
    host: PG_HOST,
    port: +PG_PORT,
    username: PG_USERNAME,
    password: PG_PASSWORD,
    database: PG_DATABASE,
    entities: [Product, Stock],
    ssl: {
        rejectUnauthorized: false
    },
    connectTimeoutMS: 5000,
    synchronize: true,
}
