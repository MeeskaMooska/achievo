
const { compareHashed } = require('./hashHandler');

exports.handler = async (event) => {
    let body;
    try {
        body = JSON.parse(event.body);
    } catch (parseError) {
        console.error('Invalid JSON format: ', parseError);
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'JSON Error.', parseError }),
        };
    }

    const { userId, code } = body;

    // Check if code is valid
    try {
        const existingCode = await prisma.achievoResetCode.findFirst({
            where: {
                associatedUserId: userId,
            },
        })

        if (existingCode) {
            // Match user id
            if (compareHashed(code, existingCode.code)) {
                return {
                    statusCode: 200,
                    body: JSON.stringify({ message: 'Code verified.' }),
                }
            }
        }

        if (!existingCode) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Invalid code.' }),
            };
        }
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Server error.', error }),
        };
    }
}