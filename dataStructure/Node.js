class Node {
    constructor({ ID }, { coordinates }) {
        this.NODEID = ID.toString();
        this.x = coordinates[0];
        this.y = coordinates[1];
    }
}

module.exports = Node;