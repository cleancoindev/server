'use strict';
const admin = require('firebase-admin');
const { ApolloError, ValidationError } = require('apollo-server');

const resolvers = {
  User: {
    async countries(user) {
      try {
        const userCountries = await admin
          .firestore()
          .collection('countries')
          .where('owner', '==', user.userId)
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
    async mapCountries() {
      const mapCountries = await admin
        .database()
        .ref('worldMap/objects/units/geometries')
        .once('value')
        .then(snap => snap.val());
      const countries = mapCountries
        .map(country => country.properties)
        .filter(country => country.countryId !== 200);
      return countries;
    },
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
        const user = { ...userDoc.data(), userId: userDoc.id };

        return user || new ValidationError('User ID not found!');
      } catch (error) {
        throw new ApolloError(error);
      }
    }
  },
  Mutation: {
    buyCountry: async (_, args) => {
      console.log('args', args);
      try {
        const countryRef = await admin.firestore().doc(`countries/${args.id}`);
        await countryRef.set(
          {
            id: args.id,
            owner: args.newOwnerId,
            onSale: false,
            lastPrice: args.price,
            lastBought: args.timeOfPurchase,
            totalPlots: args.totalPlots,
            plotsBought: 0,
            plotsMined: 0,
            plotsAvailable: args.totalPlots,
            name: args.id,
            imageLinkLarge: args.imageLinkLarge,
            imageLinkMedium: args.imageLinkMedium,
            imageLinkSmall: args.imageLinkSmall,
            countryId: args.countryId,
            mapIndex: args.mapIndex,
            roi: args.roi
          },
          { merge: true }
        );
        const countryDoc = await countryRef.get();
        return countryDoc.data();
      } catch (error) {
        throw new ApolloError(error);
      }
    }
  }
};

module.exports = resolvers;
