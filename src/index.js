const { GraphQLServer } = require('graphql-yoga')
var admin = require("firebase-admin");
const { ApolloError, ValidationError } = require( 'apollo-server');

const serviceAccount = require('../secrets/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://dev-cryptominerworld.firebaseio.com'
});

const typeDefs = `
type User {
  id: ID!
  imageURL: String!
  name: String!
  walletId: String!
  countries:[Country]
  userId: String!
}

type Country {
  id: ID!
  totalPlots: Int!
  plotsBought: Int!
  plotsMined: Int!
  plotsAvailable: Int!
  name: String!
  currentPrice: Int!
  lastPrice: Int
  profitEarned: Int
  lastBought: Int
  owner: User!
}

type Query {
  user(id: String!): User
  countries: [Country]
}
`;

const resolvers = {
  // Query: {
  //   info: () => `This is the API of a Hackernews Clone`
  // }
  User: {
    async countries(user) {
      try {
        const userCountries = await admin
          .firestore()
          .collection('countries')
          .where('userId', '==', 
          user.userId)
          .get();
        
        return userCountries.docs.map(country => country.data());
      } catch (error) {
        throw new ApolloError(error);
      }
    }
  },
  Country: {
    async owner(country) {
      try {
        const countryOwner = await admin
          .firestore()
          .doc(`user/${country.owner}`)
          .get();
        return countryOwner.data();
      } catch (error) {
        throw new ApolloError(error);
      }
    }
  },
  Query: {
    async countries() {
      const countries = await admin
        .firestore()
        .collection('countries')
        .get();
      return countries.docs.map(country => country.data());
    },
    async user(_, args) {
      try {
        const userDoc = await admin
          .firestore()
          .doc(`users/${args.id}`)
          .get();
        const user = {...userDoc.data(), userId: userDoc.id}
     
        return user || new ValidationError('User ID not found!');
      } catch (error) {
        throw new ApolloError(error);
      }
    }
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});
server.start(() => console.log(`Server is running on http://localhost:4000`));
