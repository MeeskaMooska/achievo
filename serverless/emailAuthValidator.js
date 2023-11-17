const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.handler = async (event) => {
    let body;
    try {
        // Parse the request body
        body = JSON.parse(event.body);
    } catch (parseError) {
        console.error('Invalid JSON format: ', parseError);

        // Return a 400 response for invalid JSON format
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Invalid JSON format.', details: parseError.message }),
        };
    }

    // Extract the email extension from the parsed body
    const extension = body;

    try {
        // Query the database to check if the email extension exists
        const storedExtension = await prisma.achievoEmailExtension.findUnique({
            where: {
                extension: extension,
            },
        });

        if (storedExtension) {
            try {
                // Update the user record to mark email validation as true
                await prisma.achievoUser.update({
                    where: {
                        email: storedExtension.email,
                    },
                    data: {
                        email_valid: true,
                    },
                });
            } catch (error) {
                // Return a 500 response if updating user validation fails
                return {
                    statusCode: 500,
                    body: JSON.stringify({ error: 'Failed to update user validation.' }),
                };
            }

            try {
                // Delete the email extension record after verification
                await prisma.achievoEmailExtension.delete({
                    where: {
                        extension: extension,
                    },
                });
            } catch (error) {
                // Return a 500 response if deleting email extension fails
                return {
                    statusCode: 500,
                    body: JSON.stringify({ error: 'Failed to delete email extension.' }),
                };
            }

            // Return a 200 response for successful email verification
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Email verified.' }),
            };
        } else {
            // Return a 401 response if the email extension is not found
            return {
                statusCode: 401,
                body: JSON.stringify({ error: 'Email not verified.' }),
            };
        }
    } catch (error) {
        console.error('Database error: ', error);

        // Return a 500 response for internal server error
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error.' }),
        };
    }
};
