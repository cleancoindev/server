'use strict';

const typeDefs = `

type MapCountry {
  id: ID!
  countryId: Int!
  plots: Int!
  price: Float!
  roi: Float!
  east: Float!
  north: Float!
  name: String!
  mapIndex: Int!
  imageLinkLarge: String!
  imageLinkMedium: String!
  imageLinkSmall: String!
  sold: Boolean!
}

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
  owner: User!
  imageLinkLarge: String!
  imageLinkMedium: String!
  imageLinkSmall: String!
  countryId: Int!
  mapIndex: Int!
  name: String!
  totalPlots: Int!
  plotsBought: Int!
  plotsMined: Int!
  plotsAvailable: Int!
  lastPrice: Float!
  onSale: Boolean!
  roi: Float!
  lastBought: Float!
}

type Query {
  user(id: String!): User
  countries: [Country]
  mapCountries: [MapCountry]
}

type Mutation {
  buyCountry (
            id: String!,
            newOwnerId: String!,
            timeOfPurchase: Float!,
            price: Float!,
            totalPlots: Int!,
            imageLinkLarge: String!,
            imageLinkMedium: String!,
            imageLinkSmall: String!,
            countryId: Int!,
            mapIndex: Int!,
            roi: Float!,
  ) : Country!

          
                   
                   
                    
                    
                      
}
`;

module.exports = typeDefs;
