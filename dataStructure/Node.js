class Node {
    constructor({ ID }, { coordinates }) {
        this.NODEID = ID.toString();
        this.vertex = coordinates;
    }
}

module.exports = Node;