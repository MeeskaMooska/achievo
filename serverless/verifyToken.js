// Token Verfication function Version - 0.0.1
const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const jwtSecret = process.env.JWT_SECRET;
const HOSTNAME = process.env.HOSTNAME;
const axios = require('axios');

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

    // Verify token validity
    const decoded = jwt.verify(userSessionToken, jwtSecret);

    try {
        const response = await axios.post(`${HOSTNAME}/achievo_api/verify_token`, {user_id: decoded.id, access_token: userSessionToken})
        const is_valid = response.status === 200 ? true : false;

        if (is_valid) {
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Token verified.', username: decoded.username, email: decoded.email, id: decoded.id}),
            };
        }

        return {
            statusCode: 401,
            body: JSON.stringify({ error: 'Invalid token.' }),
        };
    } catch (err) {
		console.error(err);
        return {
            statusCode: 401,
            body: JSON.stringify({ error: 'Invalid token.', err }),
        };
    }
};
