"use strict";
const dotenv = require("dotenv");
const { Client } = require('pg');

dotenv.config();
const client = new Client({
    user: process.env.PGUSERNAME,
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
})


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
                    description: 'get single contacts',
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
                    params: ['lname', 'fname', 'group'],
                    note: 'group requires full text'

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

            // set default values for fields
            const contactDetails = {
                fname: params.fname,
                lname: params.lname,
                email: params.email,
                pcode: params.p_code || '',
                province: params.province || 'ON',
                country: params.country || '',
                street: params.street_address || '',
                group: params.contact_group || 'others',
                rowCount: 0

            }

            const query = "INSERT into contact (fname,lname,email,p_code,province,country,street_address,contact_group) VALUES ('" + contactDetails.fname + "','" + contactDetails.lname + "','" + contactDetails.email + "','" + contactDetails.pcode + "','" + contactDetails.province + "','" + contactDetails.country + "','" + contactDetails.street + "','" + contactDetails.group + "');";
            const res = await client.query(query);
            contactDetails.rowCount = res.rowCount;

            return contactDetails;
        } catch (error) {
            console.log(error)
            throw error
        }
    },
};
const update = {
    method: "POST",
    path: "/update",
    handler: async (request, h) => {
        const params = request.query;
        try {

            const query = "UPDATE contact SET " + params.field + "='" + params.value + "' WHERE id='" + params.id + "';";
            const res = await client.query(query);

            // Get updated contact details
            const updatedContactDetails = await (client.query("SELECT * FROM contact WHERE id='" + params.id + "'"));
            return {
                message: "Record updated",
                success: true,
                contact: updatedContactDetails.rows
            };

        } catch (error) {
            return {
                message: "Record not updated",
                success: false
            };

        }


    },
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

        const searchParameters = ['fname', 'lastname', 'group'];

        if (!params.fname && !params.lname && !params.group) return {
            status: 'OK',
            message: 'query requires first, lastname or group'
        }

        let query = null;
        if (params.fname) {
            query = "SELECT * FROM contact WHERE fname LIKE '" + params.fname + "%';";
        } else if (params.fname) {
            query = "SELECT * FROM contact WHERE lname LIKE '" + params.lname + "%';";
        } else {
            query = "SELECT * FROM contact WHERE contact_group = '" + params.group + "';";
        }

        const res = await client.query(query);
        console.log(query)
        if (res.rowCount < 1) {
            return {
                message: 'No records found',
                success: false,
                rowCount: res.rowCount
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
                success: true,
                rowCount: res.rowCount
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