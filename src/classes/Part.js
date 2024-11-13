export default class Part {
    constructor(name, chorale) {
        this.name = name
        this.chorale = chorale
        this.bars = [] // should be of size chorale.getNumOfBars()
    }
}


