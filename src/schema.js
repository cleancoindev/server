'use strict';

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
  totalPlots: Int
  plotsBought: Int
  plotsMined: Int
  plotsAvailable: Int
  name: String
  currentPrice: Int
  lastPrice: Int
  profitEarned: Int
  owner: User!
  onSale: Boolean
  lastBought: Float
  countryId: Int
  mapIndex: Int
  description: String
  image: String
  roi: Int
}

type Query {
  user(id: String!): User
  countries: [Country]
}

type Mutation {
  buyCountry (id: String!, newOwnerId: String!, price: Int!, gift: Boolean!, timeOfPurchase: Float!, totalPlots: Int!) : Country!
  giftCountry (id: String!, newOwnerId: String!, gift: Boolean!, timeOfGifting: Float!) : Country!
}
`;

module.exports = typeDefs;
