const { readJSON } = require('./utils/file');

readJSON('./resources/sfo_roads.json')
    .then(roads => console.log(roads))