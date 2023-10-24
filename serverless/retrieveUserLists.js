const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.handler = async (event, username) => {
    try {
        
        return {
            statusCode: 200,
            body: JSON.stringify(result)
        };
    } catch (error) {
        // Handle any errors
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
