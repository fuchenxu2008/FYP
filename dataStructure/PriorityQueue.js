// to store element and its priority 
class QElement { 
    constructor(element, priority) { 
        this.element = element; 
        this.priority = priority; 
    } 
} 

// PriorityQueue class 
class PriorityQueue { 
    // An array is used to implement priority 
    constructor() { 
        this.items = [];
        this.itemMap = new Map();
    } 

    // functions to be implemented 
    enqueue(element, priority) {
        // creating object from queue element 
        const qElement = new QElement(element, priority); 
        let contain = false; 

        // iterating through the entire item array to add element at the correct location of the Queue 
        for (let i = 0, n = this.items.length; i < n; i++) { 
            if (this.items[i].priority > qElement.priority) { 
                // Once the correct location is found it is enqueued 
                this.items.splice(i, 0, qElement); 
                contain = true; 
                break; 
            } 
        } 

        // if the element have the highest priority it is added at the end of the queue 
        if (!contain) { 
            this.items.push(qElement); 
        }

        this.itemMap.set(element, 1);
    }

    dequeue() {
        // return the dequeued element and remove it. 
        // if the queue is empty returns Underflow 
        if (this.isEmpty()) 
            return "Underflow";
        
        this.itemMap.delete(this.front());
        return this.items.shift(); 
    }

    contains(element) {
        return !!this.itemMap.get(element);
    }

    length() {
        return this.items.length;
    }

    front() {
        // returns the highest priority element in the Priority queue without removing it. 
        if (this.isEmpty()) 
            return "No elements in Queue"; 
        return this.items[0]; 
    }

    isEmpty() {
        // return true if the queue is empty. 
        return this.items.length == 0; 
    }
}

module.exports = PriorityQueue;
