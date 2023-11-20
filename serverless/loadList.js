const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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

    const { listId } = body;

    try {
        const userLists = await prisma.achievoUser.findUnique({
            where: {
                id: userId
            },
            include: {
                lists: true
            }
        })
    } catch (error) {
        console.error(error)
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Server Error.', error }),
        };
    }
}
