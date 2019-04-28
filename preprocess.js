const ogr2ogr = require('ogr2ogr');
const path = require('path');
const { saveJSON } = require('./utils/file');

const convertShapeToGeoJSON = (filePath) => new Promise((resolve, reject) => {
    try {
        ogr2ogr(path.resolve(process.cwd(), filePath))
        .options(["--config", "SHAPE_RESTORE_SHX", "TRUE"])
        .exec(function (err, data) {
            if (err) throw err;
            resolve(data);
        })
    } catch (error) {
        reject(error);
    }
})

const processRoads = () => convertShapeToGeoJSON('./resources/sfo_roads.shp.zip')
    .then(roads => saveJSON('./resources/sfo_roads.json', roads));

const processNodes = () => convertShapeToGeoJSON('./resources/sfo_nodes.shp.zip')
    .then(nodes => saveJSON('./resources/sfo_nodes.json', nodes));

const processPoly = () => convertShapeToGeoJSON('./resources/sfo_poly.shp.zip')
    .then(poly => saveJSON('./resources/sfo_poly.json', poly));

const preprocess = async () => {
    await Promise.all([
        processRoads(),
        processNodes(),
        processPoly(),
    ])
    .catch(err => console.log(err))
}

preprocess();