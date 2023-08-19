const {dbInstance} = require('../../config/database')
const {returnInserted} = require('../utils/query')
const tableName = 'users'

exports.create = async (data) => {
    const db = await dbInstance;
    const rs = await db
        .request()
        .query(`INSERT INTO ${tableName} (username, email, password, firstName, lastName, gender, image)
                ${returnInserted}
                VALUES ('${data.username}','${data.email}', '${data.password}', '${data.firstName}', '${data.lastName}', '${data.gender}', '${data.image}')`)

    return {
        data: rs.recordset[0],
        rowsAffected: rs.recordset[0].rowsAffected
    };
}

exports.read = async () => {
    const db = await dbInstance;
    const rs = await db
        .request()
        .query(`SELECT *
                FROM ${tableName}`)

    return rs.recordset;
}

exports.update = async (id, data) => {
    const db = await dbInstance;
    const rs = await db
        .request()
        .query(`UPDATE ${tableName} SET
                username='${data[0].username}, email='${data[0].email}'
                WHERE id = ${id}`);

    return rs.rowsAffected;
}

exports.delete = async (id) => {
    const db = await dbInstance;
    const rs = await db
        .request()
        .query(`DELETE FROM ${tableName}
                WHERE id = ${id}`)

    return rs.rowsAffected;
}

exports.readById = async (id) => {
    const db = await dbInstance;
    const rs = await db
        .request()
        .query(`SELECT *
                    FROM ${tableName} 
                    WHERE id = ${id} `);

    return rs.recordset;
}

exports.readByEmail = async (email) => {
    const db = await dbInstance;
    const rs = await db
        .request()
        .query(`SELECT *
                    FROM ${tableName} 
                    WHERE email = '${email}' `);

    return rs.recordset[0];
}

exports.readByUsername = async (username) => {
    const db = await dbInstance;
    const rs = await db
        .request()
        .query(`SELECT *
                    FROM ${tableName} 
                   WHERE username = '${username}' `);    

    return rs.recordset[0];
}
