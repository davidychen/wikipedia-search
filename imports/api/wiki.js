import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";
import { HTTP } from "meteor/http";
import { check } from "meteor/check";

export const TopSearch = new Mongo.Collection("search");

if (Meteor.isServer) {
  Meteor.publish("top-search", function searchPublication() {
    return TopSearch.find(
      {},
      {
        fields: {
          term: 1,
          count: 1
        },
        limit: 10,
        sort: { count: -1 }
      }
    );
  });
}

Meteor.methods({
  wikiSearch(term) {
    check(term, String);

    // Meteor.call("...", (err, res) => {....})
    if (Meteor.isServer) {
      TopSearch.update(
        { term: term },
        { $inc: { count: 1 } },
        { upsert: true }
      );
      let wikipedia = require("node-wikipedia");
      return new Promise((resolve, reject) => {
        wikipedia.page.data(term, { content: true }, resolve);
      });
    }
  }
});
