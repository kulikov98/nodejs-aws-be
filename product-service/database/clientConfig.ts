import {ConnectionOptions} from "typeorm";
import {Product} from "../models/Product";
import {Stock} from "../models/Stock";


const {PG_HOST, PG_PORT, PG_DATABASE, PG_USERNAME, PG_PASSWORD} = process.env;

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
    synchronize: false,
    logging: true,
}
