const { Client } = require('@elastic/elasticsearch')
const faker = require('faker')

const client = new Client({ node: 'http://localhost:9200' })
// client.info(console.log)

const seedUsers = async () => {
    const indexExist = await client.indices.exists({ index: 'users' })
    if (indexExist?.body) {
        await client.indices.delete({ index: 'users' })
    }
}

const createIndexUsers = async (users) => {
    await client.indices.create({ index: 'users' })

    const body = users.flatMap((user, index) => [
        { index: { _index: 'users' } }, user
    ])

    await client.bulk({ refresh: true, body })
}

const createUsers = async (numUsers = 5) => {
    const users = Array(numUsers)
        .fill(null)
        .map(() => faker.helpers.createCard());

    return await createIndexUsers(users);
};

seedUsers()
    .then(() => createUsers(10000))
    .then(() => console.log('done'))
    .catch(console.log)