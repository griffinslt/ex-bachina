export default class MyNote {
    constructor(previousNote=null, nextNote=null, pitch=null, type, barNumber, dot) {
        this.previousNote = previousNote;
        this.nextNote = nextNote;
        this.pitch = pitch;
        this.type = type;
        this.barNumber = barNumber;
        this.chord = null
        this.dot = dot;
    }

    setNextNote(note){
        this.nextNote = note;
    }
    setPreviousNote(note){
        this.previousNote = note;
    }
}