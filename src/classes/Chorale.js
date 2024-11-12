import Voice from "./Voice"

export default class Chorale {
    constructor(xmlDoc) {
        this.xmlDoc = xmlDoc
        this.cadenceLocations = [] 
        this.removeHarmony()
        this.reformatXML()
        this.computeFermataLocations()

        this.voices = [
            new Voice("S"),
            new Voice("A"),
            new Voice("T"),
            new Voice("B"),
        ]
        this.numOfBars = 0

        this.timeSignature = { numerator: 4, denominator: 4 }
        this.startingKeySignature = ""
    }
    getChoraleAsString() {
        return new XMLSerializer().serializeToString(this.xmlDoc.documentElement);
    }

    getCadenceLocations(){
        return this.cadenceLocations
    }
    

    computeFermataLocations() {
        const allFermatas = Array.from(this.xmlDoc.getElementsByTagName('fermata'))
        var locations = []
        allFermatas.forEach(fermata => {
            const note = fermata.parentElement.parentElement 
            const bar = note.parentElement
            const barNumber = bar.getAttribute('number')
            const noteNumber = Array.prototype.indexOf.call(bar.getElementsByTagName("note"), note);
            locations.push({
                barNumber: barNumber,
                noteNumber: noteNumber
            })
        })
        this.cadenceLocations = locations
    }

    removeHarmony() {
        // remove all voices that are not <voice>1</voice>

        var voiceElements = Array.from(this.xmlDoc.getElementsByTagName('voice'))
        voiceElements.forEach(element => {
            if (element.innerHTML != "1") {
                element.parentElement.remove()
            }
        });
    }

    reformatXML() {
        // remove non-essential elements from music xml

        const essentialElements = [
            "score-partwise", "work", "work-title", "part-list", "score-part", "part-name", "part",
            'measure', "attributes", "divisions", "key", "fifths", "mode", "time", "fermata", "notations",
            "beats", "beat-type", "clef", "sign", "line", "note", "pitch", "step", "octave", "duration",
            "type", "direction", "direction-type", "metronome", "beat-unit", "per-minute", "barline"
        ]

        const allElements = Array.from(this.xmlDoc.getElementsByTagName("*"))

        var allElementsAsString = []
        allElements.forEach(element => {
            allElementsAsString.push(element.tagName)
        });


        const filteredElementNames = Array.from(allElementsAsString).filter(element => {
            return !essentialElements.includes(element);
        });


        filteredElementNames.forEach(element => {
            var elementsToDelete = Array.from(this.xmlDoc.getElementsByTagName(element))
            elementsToDelete.forEach(elementToDelete => {
                elementToDelete.remove()
            });
        });
    }
}

