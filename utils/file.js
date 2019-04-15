const fs = require('fs');
const es = require('event-stream');
const path = require('path');

exports.saveJSON = async (filePath, json) => new Promise((resolve, reject) => {
    try {
        fs.writeFile(path.resolve(process.cwd(), filePath), JSON.stringify(json), (err) => {
            if (err) throw err;
            console.log(`${filePath} successfully written!`);
            resolve();
        })
    } catch (error) {
        reject(error);
    }
});

exports.readJSON = async (filePath) => new Promise((resolve, reject) => {
    try {
        fs.readFile(path.resolve(process.cwd(), filePath), (err, data) => {
            if (err) throw err;
            resolve(JSON.parse(data));
        })
    } catch (error) {
        reject(error);
    }
});

exports.readTxt = (filePath) => new Promise((resolve, reject) => {
    try {
        fs.createReadStream(path.resolve(process.cwd(), filePath))
            .pipe(es.split())
            .pipe(es.mapSync(line => {
                this.parseLine(line);
            }))
            .on('error', (err) => reject(err))
            .on('end', () => resolve())
    } catch (error) {
        reject(error);
    }
})

exports.parseLine = (line) => {
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