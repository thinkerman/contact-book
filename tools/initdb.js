"use strict";

const dotenv = require("dotenv");
const { Pool, Client } = require('pg')




const init = async () => {
    // read environment variables
    dotenv.config();

    try {

        const client = new Client({
            user: process.env.PGUSERNAME,
            host: process.env.PGHOST,
            database: process.env.PGDATABASE,
            password: process.env.PGPASSWORD,
            port: process.env.PGPORT,
        })

        // connect to the local database server
        await client.connect();

        const res = await client.query('SELECT * FROM contact');

        // console.log("creating table...");
        const table = await client.query(`CREATE TABLE IF NOT EXISTS contacts2 (
            id SERIAL PRIMARY KEY,
            fname char(50) NOT NULL,
            lname char(50) NOT NULL,
            email char(50) NOT NULL,
            street_address char(100),
            p_code char(7),
            province province,
            country char(50),
            contact_group contact_type
        );`)
        res.rows.map(field => {
            console.log(field.fname)
        })
        await client.end()



    } catch (err) {
        console.log(err);
        throw err;
    }
};

init().then(() => {
    console.log("finished");
}).catch(() => {
    console.log("finished with errors");
});