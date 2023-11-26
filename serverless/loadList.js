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
        const list = await prisma.achievoList.findUnique({
            where: {
                id: listId
            },
            include: {
                items: true
            }
        })
        
        return {
            statusCode: 200,
            body: JSON.stringify({ list: list }),
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Server Error.', error }),
        };
    }
}
