"use strict";
const dotenv = require("dotenv");
const { Client } = require('pg');
const Joi = require('@hapi/joi');
const { emptyQuery } = require("pg-protocol/dist/messages");

dotenv.config();
const client = new Client({
    user: process.env.PGUSERNAME,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
})


let d = [];

const dbOperation = async () => {

    try {
        // connect to the local database server
        await client.connect();


    } catch (err) {
        console.log(err);
        throw err;
    }

}



dbOperation();
const home = {
    method: "GET",
    path: "/",
    handler: (request, h) => {
        return h.response({
            routes: {
                all: 'get all contacts',
                contact: {
                    description: 'get all contacts',
                    params: 'id'
                },
                remove: {
                    description: 'delete single contact',
                    params: 'id'
                },
                add: {
                    description: 'add new contact',
                    params: {
                        fname: 'firstname',
                        lname: 'last name',
                        street: 'street address',
                        p_code: 'postal code',
                        country: 'country name',
                        group: ['friend', 'professional', 'family', 'others'],
                        province: ['AB', 'NL', 'PE', 'NS', 'NB', 'QC', 'ON', 'MN', 'SK', 'BC', 'YT', 'NT', 'NU']
                    }
                },
                search: {
                    description: 'search contact',
                    params: 'key'
                },
                update: {
                    description: 'update contact',
                    params: {
                        field: 'field to update',
                        value: 'new field value'
                    }
                }
            }

        });
    }
};

const all = {
    method: "GET",
    path: "/all",
    handler: async (request, h) => {
        const res = await client.query('SELECT * FROM contact');


        if (res.length <= 0) {
            const responseObject = {
                status: 401,
                rows: 0,
                message: 'No records found'
            }
            return h.response(responseObject);
        }
        return res.rows;
    }
};
const add = {
    method: "POST",
    path: "/add",
    handler: async (request, h) => {
        const params = request.query;
        try {
            const query = "INSERT into contact (fname,lname,email,p_code,province,country,street_address,contact_group) VALUES ('" + params.fname + "','" + params.lname + "','" + params.email + "','" + params.p_code + "','" + params.province + "','" + params.country + "','" + params.street_address + "','" + params.contact_group + "');";
            const res = await client.query(query);
            return res;
        } catch (error) {
            console.log(error)
            throw error
        }
    },
    // options: {
    //     validate: {
    //         payload: Joi.object({
    //             name: Joi.string().min(1).max(15),
    //             lname: Joi.string().min(1).max(15),
    //             email: Joi.string().min(1).max(15)
    //         })
    //     }
    // },
};
const update = {
    method: "POST",
    path: "/update",
    handler: async (request, h) => {
        const params = request.query;
        try {

            const query = "UPDATE contact SET " + params.field + "='" + params.value + "' WHERE id='" + params.id + "';";
            const res = await client.query(query);

            return {
                message: "Record updated",
                success: true
            };

        } catch (error) {
            return {
                message: "Record not updated",
                success: false
            };

        }


    },
    // options: {
    //     validate: {
    //         payload: Joi.object({
    //             name: Joi.string().min(1).max(15),
    //             lname: Joi.string().min(1).max(15),
    //             email: Joi.string().min(1).max(15)
    //         })
    //     }
    // },
};
const contact = {
    method: "GET",
    path: "/contact",
    handler: async (request, h) => {
        const params = request.query;
        const query = "SELECT * FROM contact WHERE id='" + params.id + "'";
        const res = await client.query(query);
        if (res.rowCount < 1) {
            return {
                message: 'No records found',
                success: false
            }
        }

        return res.rows;
    },

};

const search = {
    method: "GET",
    path: "/search",
    handler: async (request, h) => {
        const params = request.query;

        const query = "SELECT * FROM contact WHERE lname LIKE '" + params.key + "%';";
        const res = await client.query(query);

        console.log(res);

        if (res.rowCount < 1) {
            return {
                message: 'No records found',
                success: false
            }
        }
        return res.rows;
    }
}
const remove = {
    method: "POST",
    path: "/remove",
    handler: async (request, h) => {
        const params = request.query;
        try {

            const query = "DELETE from contact WHERE id='" + params.id + "';";
            const res = await client.query(query);
            return {
                message: "Record deleted",
                success: true
            };

        } catch (error) {
            return {
                message: "Record not deleted",
                success: false
            };

        }

    }
};
module.exports = [home, all, contact, add, remove, update, search];