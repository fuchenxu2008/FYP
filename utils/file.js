const fs = require('fs');
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
