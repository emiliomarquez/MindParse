class Greetings {
    constructor() {
        this.greetings = [
            ["Hello,",""]
            ,["Welcome,",""]
            ,["Howdy,",""]
            ,["Greetings,",""]
            ,["G'day,",""]
            ,["Hey,",""]
            /* uhh... */
            ,["A wild","has appeared!"]
            ,["Is that...","?!?"]
            ,["Hey", ", come here often?"]
            ,["Hey", ", how are ya?"]
            ,["Take a load off", "and relax"]
            ,["Back at it again," , "?"]
            ,["Hydrate yet,", "?"]
        ];
    }

    generateRandomGreeting() {
            return this.greetings[Math.floor(Math.random() * this.greetings.length)];
    }
}

export default Greetings;