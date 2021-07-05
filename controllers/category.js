import fs from 'fs'
import path from 'path'
export const getCategory = function (req, res) {

    const jsonString = fs.readFileSync(path.resolve() + "/data/index_category.json");
    //console.log(jsonString);
    const data = JSON.parse(jsonString);
    res.send({ code: 0, data });

};
