class Road {
    constructor({ EDGEID, STARTID, ENDID, LENGTH, SPD }) {
        this.EDGEID = EDGEID.toString();
        this.STARTID = STARTID.toString();
        this.ENDID = ENDID.toString();
        // this.LENGTH = LENGTH; // [m]
        // this.SPD = SPD; // [m/s]
        this.COST = LENGTH / SPD;
    }

    isEqual(anotherRoad) {
        return this.STARTID === anotherRoad.ENDID
            && this.ENDID === anotherRoad.STARTID
            && this.COST === anotherRoad.COST
    }
}

module.exports = Road;