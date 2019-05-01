class Polygon {
    constructor({ POLY_ID }, { coordinates }) {
        this.POLYID = POLY_ID.toString();
        this.vertices = coordinates[0];
    }
}

module.exports = Polygon;