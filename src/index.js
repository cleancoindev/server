const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const { GraphQLServer } = require('graphql-yoga');
const admin = require('firebase-admin');

const serviceAccount = require('../secrets/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://dev-cryptominerworld.firebaseio.com/'
});
  
admin.firestore().settings( { timestampsInSnapshots: true })

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => console.log(`Server is running on http://localhost:4000`));
