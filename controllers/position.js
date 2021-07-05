import ajax from "./ajax.js";
export const getPosition = function (req, res) {
  const { geohash } = req.params;
  ajax(`http://cangdu.org:8001/v2/pois/${geohash}`).then((data) => {
    res.send({ code: 0, data });
  });
};
