const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const jwtSecret = process.env.JWT_SECRET;

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
        // Verify token
        const decoded = jwt.verify(userSessionToken, jwtSecret);
        
        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Token verified.', username: decoded.username }),
        };
    } catch (err) {
        return {
            statusCode: 401,
            body: JSON.stringify({ error: 'Invalid token.', err }),
        };
    }
};
