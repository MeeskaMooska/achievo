

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

    const { userId } = body;

    try {
        const userLists = await prisma.achievoUser.findUnique({
            where: {
                id: userId
            },
            include: {
                lists: true
            }
        })

        return {
            statusCode: 200,
            body: JSON.stringify(userLists.lists)
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error })
        };
    }
};
