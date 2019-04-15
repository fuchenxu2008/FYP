const shapefile = require('shapefile');
const fs = require('fs');
const es = require('event-stream');
const path = require('path');

const readShapeFile = async (filePath) => {
    const source = await shapefile.open(filePath);
    return source.read();
}

const saveJSON = async (fileName, json) => new Promise((resolve, reject) => {
    try {
        fs.writeFile(path.resolve(__dirname, fileName),JSON.stringify(json), (err) => {
            if (err) throw err;
        })
    } catch (error) {
        reject(error);
    }
});

// readShapeFile('./sfo_poly.shp').then(GeoJSON => {
//     saveJSON('sfo_poly.json', GeoJSON);
// })

const readTxt = (fileName) => new Promise((resolve, reject) => {
    try {
        fs.createReadStream(path.resolve(__dirname, fileName))
            .pipe(es.split())
            .pipe(es.mapSync(line => {
                console.log(parseLine(line));
            }))
            .on('error', (err) => reject(err))
            .on('end', () => resolve())
    } catch (error) {
        reject(error);
    }
})

const parseLine = (line) => {
    let regex = /([-|\d|.]+)|(<.*>)/g
    const result = line.match(regex);
    if (result.length !== 6) {
        console.log('result: ', result);
        throw new Error('Line parsed error');
    }
    return {
        edge_id: result[0],
        start_node_id: result[1],
        end_node_id: result[2],
        length_of_the_edge: result[3], // in meters
        speed_limit: result[4], // in meters per second
        geometry: result[5],
    }
}

// re'adTxt('sfo_roads.txt')
const ogr2ogr = require('ogr2ogr')
ogr2ogr(path.resolve(__dirname, 'sfo_roads.shp'))
    .options(["--config", "SHAPE_RESTORE_SHX", "TRUE"])
    .exec(function (err, data) {
        console.log('err: ', err);
        console.log(data);
    })