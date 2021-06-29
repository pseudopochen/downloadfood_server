import ajax from "./ajax.js";

export const getShops = function (req, res) {
  const latitude = req.query.latitude;
  const longitude = req.query.longitude;

  setTimeout(function () {
    const data = require("../data/shops.json");
    res.send({ code: 0, data });
  }, 300);
};

export const searchShops = function (req, res) {
  const { geohash, keyword } = req.query;
  ajax("http://cangdu.org:8001/v4/restaurants", {
    "extras[]": "restaurant_activity",
    geohash,
    keyword,
    type: "search",
  }).then((data) => {
    res.send({ code: 0, data });
  });
};
