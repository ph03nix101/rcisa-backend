
const  query = require('../config/database');

class UserController {
    constructor() {
        this.query = query;
    }

    async getUserById(userId) {
        const sql = 'SELECT * FROM users WHERE id = ?';
        const results = await this.query(sql, [userId]);
        return results[0];
    }

    async createUser(userData) {
        const sql = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        const results = await this.query(sql, [userData.name, userData.email, userData.password]);
        return results.insertId;
    }

    async updateUser(userId, userData) {
        const sql = 'UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?';
        await this.query(sql, [userData.name, userData.email, userData.password, userId]);
    }

    async deleteUser(userId) {
        const sql = 'DELETE FROM users WHERE id = ?';
        await this.query(sql, [userId]);
    }
}

module.exports = new UserController;