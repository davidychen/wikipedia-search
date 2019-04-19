import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";
import { HTTP } from "meteor/http";
import { check } from "meteor/check";



Meteor.methods({
  wikiSearch(term) {
    check(term, String);

    // Meteor.call("...", (err, res) => {....})
    if (Meteor.isServer) {
      let wikipedia = require("node-wikipedia");
      return new Promise((resolve, reject) => {
        wikipedia.page.data(term, { content: true }, resolve);
      });
    }
  }
});
