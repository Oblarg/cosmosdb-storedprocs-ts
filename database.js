const Cosmos = require('@azure/cosmos');


const client = new Cosmos.CosmosClient(
    'YOUR_CONNNECTION_STRING'
);
const db = client.database('YOUR_DATABASE_NAME');

const exampleContainer = db.container('exampleContainer');

module.exports = {
    exampleContainer,
};
