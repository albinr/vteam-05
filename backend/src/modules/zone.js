const pool = require('../db/db.js');

async function showZones() {
    try {
        const [rows] = await pool.query(`
            SELECT
                zone_id,
                name,
                city,
                type,
                ST_X(coordinates) AS longitude,
                ST_Y(coordinates) AS latitude,
                capacity,
                radius
            FROM Zone
        `);
        return rows;
    } catch (error) {
        console.error("Error att hämta zoner:", error);
        throw error;
    }
}

async function addZone(name, city, type, longitude, latitude, capacity, radius = 25) {
    try {
        const [result] = await pool.query(`
            INSERT INTO Zone (name, city, type, coordinates, capacity, radius)
            VALUES (?, ?, ?, POINT(?, ?), ?, ?)
        `, [name, city, type, longitude, latitude, capacity, radius]);

        return { zoneId: result.insertId, message: 'Zone added successfully' };
    } catch (error) {
        console.error("Error att lägga till zon:", error);
        throw error;
    }
}

async function searchZone(type, search) {
    try {
        const validFields = ['zone_id', 'name', 'city'];
        if (!validFields.includes(type)) {
            throw new Error("Invalid type. Valid types are 'zone_id', 'name', or 'city'.");
        }

        const query = `
            SELECT
                zone_id,
                name,
                city,
                type,
                ST_X(coordinates) AS longitude,
                ST_Y(coordinates) AS latitude,
                capacity,
                radius
            FROM Zone
            WHERE ${type} = ?
        `;

        const [rows] = await pool.query(query, [search]);
        return rows;
    } catch (error) {
        console.error("Error att söka zon:", error);
        throw error;
    }
}

async function updateZone(zoneId, updatedData) {
    try {
        const data = [];
        const params = [];

        if (updatedData.name !== undefined) {
            data.push("name = ?");
            params.push(updatedData.name);
        }

        if (updatedData.city !== undefined) {
            data.push("city = ?");
            params.push(updatedData.city);
        }

        if (updatedData.type !== undefined) {
            data.push("type = ?");
            params.push(updatedData.type);
        }

        if (updatedData.longitude !== undefined && updatedData.latitude !== undefined) {
            data.push("coordinates = POINT(?, ?)");
            params.push(updatedData.longitude, updatedData.latitude);
        }

        if (updatedData.capacity !== undefined) {
            data.push("capacity = ?");
            params.push(updatedData.capacity);
        }

        if (updatedData.radius !== undefined) {
            data.push("radius = ?");
            params.push(updatedData.radius);
        }

        params.push(zoneId);

        const sql = `UPDATE Zone SET ${data.join(", ")} WHERE zone_id = ?`;

        const [result] = await pool.query(sql, params);

        if (result.affectedRows === 0) {
            throw new Error(`Ingen zon med ID ${zoneId} hittades.`);
        }

        return { message: "Zon uppdaterad", affectedRows: result.affectedRows };
    } catch (error) {
        console.error("Error vid uppdatering av zon:", error.message);
        throw error;
    }
}

async function deleteZone(zoneId) {
    try {
        const sql = `DELETE FROM Zone WHERE zone_id = ?`;
        const [result] = await pool.query(sql, [zoneId]);

        if (result.affectedRows === 0) {
            throw new Error(`Ingen zon med ID ${zoneId} hittades.`);
        }

        return { message: "Zon raderad", affectedRows: result.affectedRows };
    } catch (error) {
        console.error("Error vid radering av zon:", error.message);
        throw error;
    }
}

async function deleteAllZones() {
    try {
        const sql = `DELETE FROM Zone`;
        const [result] = await pool.query(sql);

        return { message: "Alla zoner raderade" };
    } catch (error) {
        console.error("Error vid radering av alla zoner:", error.message);
        throw error;
    }
}

module.exports = {
    showZones,
    addZone,
    searchZone,
    updateZone,
    deleteZone,
    deleteAllZones
};