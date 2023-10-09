const { PrismaClient } = require('@prisma/client');
const { hashPassword } = require('./passwordHasher');
const jwt = require('jsonwebtoken');
const prisma = new PrismaClient();
const jwtSecret = process.env.JWT_SECRET;

// Start of the function
exports.handler = async (event) => {
    // Attempt to parse json body
    let body;
    try {
        body = JSON.parse(event.body);
    } catch (parseError) {
        console.error('Invalid JSON format: ', parseError);
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'JSON Error.', parseError}),
        };
    }

    const token = body.token;

    // Verify token
    jwt.verify(token, jwtSecret, async (err, decoded) => {
        if (err) {
            console.error('Invalid token: ', err);
            return {
                statusCode: 401,
                body: JSON.stringify({ error: 'Invalid token.', err }),
            };
        }
        console.log('decoded: ', decoded);
    });
};