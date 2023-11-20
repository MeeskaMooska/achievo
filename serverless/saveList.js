// Save list function Version - 0.0.1
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

    const { list, user } = body;

    try {
        const newList = await prisma.achievoList.create({
            data: {
                title: list.title,
                description: list.description,
                userId: user.id
            }
        })

        console.log(list.item)

        const data = list.item.map(item => ({
            value: item.value,
            completed: item.completed,
            listId: newList.id
          }));

        /**const data = Array.from({ length: list.item.length }).map(() => ({
            value: list.item.value,
            completed: list.item.completed,
            listId: newList.id
        })) */

        console.log(data)

        await prisma.achievoItem.createMany({
            data
        })

        console.log(newList)
    } catch (error) {
        console.error(error)
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Server Error.', error }),
        };
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'testing' }),
    };
};
