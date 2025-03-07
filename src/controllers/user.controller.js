const connection = require('../config/database');

class UserController {

    async getUserById(userId) {
        const sql = 'SELECT * FROM users WHERE id = ?';
        const results = await connection.execute(sql, [userId]);
        return results[0];
    }

    async getUsersByStatus(status) {
        const sql = 'SELECT * FROM users WHERE status = ?';
        const results = await connection.execute(sql, [status]);
        return results;
    }

    async getUsersByNullStatus() {
        const sql = 'SELECT * FROM users WHERE status IS NULL';
        const results = await connection.execute(sql);
        return results;
    }

    async getAllUsers() {
        const sql = 'SELECT * FROM users';
        const results = await connection.execute(sql);
        return results;
    }

    async createUser(userData) {
        const sql = 'INSERT INTO users (name, email, password, phone_number) VALUES (?, ?, ?, ?, ?)';
        const results = await connection.execute(sql, [userData.name, userData.email, userData.password, userData.phone_number]);
        return results.insertId;
    }

    async updateUser(userId, userData) {
        const sql = 'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?';
        await connection.execute(sql, [userData.name, userData.email, userData.password, userId]);
    }

    async updateUserStatus(userId, userData) {
        const sql = 'UPDATE users SET status = ? WHERE id = ?';
        await connection.execute(sql, [userData.status, userId]);
    }

    async deleteUser(userId) {
        const sql = 'DELETE FROM users WHERE id = ?';
        await connection.execute(sql, [userId]);
    }
}

module.exports = new UserController;