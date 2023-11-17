const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const jwtSecret = process.env.JWT_SECRET;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Start of the function
exports.handler = async (event) => {
    const { headers } = event;  // Get the headers

    // Extract the cookie from the headers
    const cookieHeader = headers.cookie;

    // If there is no cookie, return an error
    if (!cookieHeader) {
        return {
            statusCode: 401,
            body: JSON.stringify({ error: 'No cookie.' }),
        };
    }

    // Parse the cookie header to get the value of the HTTP-only cookie
    const userSessionToken = cookie.parse(cookieHeader)['user_session_token'];

    try {
        // Verify token is valid
        const decoded = jwt.verify(userSessionToken, jwtSecret);

		await prisma.achievoToken.findFirst({
			where: {
				associated_user_id: decoded.id,
				jwt_token: userSessionToken
			}
		})
        
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Token verified.', username: decoded.username }),
        };
    } catch (err) {
		console.error(err);
        return {
            statusCode: 401,
            body: JSON.stringify({ error: 'Invalid token.', err }),
        };
    }
};
