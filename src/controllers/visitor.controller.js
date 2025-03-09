const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');
const { AuthenticationError } = require('../utils/errors');


class VisitorController {
    async addVisitor(body) {
        try {
            const { name, email, phone_number, message } = body;

            // Validate input
            const errors = {};
            if (!name || name.trim() === '') {
                errors.name = 'Name is required';
            }
            if (!email || email.trim() === '') {
                errors.email = 'Email is required';
            } else {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    errors.email = 'Invalid email format';
                }
            } 
        
            if (!phone_number || phone_number.trim() === '') {
                errors.phone_number = 'Phone number is required';
            } else {
                const phoneRegex = /^\+27\d{9}$/;
                if (!phoneRegex.test(phone_number)) {
                    errors.phone_number = 'Invalid South African phone number format';
                }
            }
            if (!message || message.trim() === '') {
                errors.message = 'Message is required';
            }

            if (Object.keys(errors).length > 0) {
                throw new AuthenticationError(JSON.stringify(errors));
            }

            const [result] = await db.execute(
                'INSERT INTO visitors (name, email, phone_number, message) VALUES (?, ?, ?, ?)',
                [name, email, phone_number, message]
            ); 

            const [visitor] = await db.execute(
                'SELECT email, phone_number, name FROM visitors WHERE id = ?',
                [result.insertId]
            );

            return {
                status: "success", 
                visitor
              };

        }
        catch (error) {
            if (error instanceof AuthenticationError) {
                throw error;
            } else {
                throw new AuthenticationError(error.message || 'An error occurred during registration');
            }
        }
    }
}

module.exports = new VisitorController();