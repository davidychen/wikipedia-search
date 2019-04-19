import { Mongo } from "meteor/mongo";
import { Meteor } from "meteor/meteor";
import { HTTP } from "meteor/http";
import { check } from "meteor/check";

Meteor.methods({
  wiki(search) {
    check(search, String);
    let wikipedia = require("node-wikipedia");
    wikipedia.page.data("Clifford_Brown", { content: true }, function(
      response
    ) {
      console.log(response);
      // structured information on the page for Clifford Brown (wikilinks, references, categories, etc.)
    });
    // Meteor.call("...", (err, res) => {....})
    if (Meteor.isServer) {
      this.unblock();
      const url = "https://en.wikipedia.org/w/api.php";
      let params = {
        action: "query",
        format: "json",
        list: "search",
        prop: "info",
        inprop: "url",
        alunique: 1,
        utf8: "",
        origin: "*",
        srsearch: search,
        srlimit: 100
      };
      try {
        // let params = { address: streetAddress, key: GOOGLE_API_KEY };
        let response = HTTP.call("GET", url, { params: params });
        // console.log("RESPONSE", JSON.parse(response.content));
        return JSON.parse(response.content);
        // let fullJSON = JSON.parse(response.content);
        // console.log("ADDRESSS LOCATION PARSE JSON", fullJSON);
        //console.log(fullJSON);
        // return fullJSON.results[0].geometry.location;
      } catch (e) {
        console.log("address error" + e);
      }
    }
  },
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
