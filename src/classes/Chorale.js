import Voice from "./Voice"

export default class Chorale {
    constructor(xmlDoc) {
        this.xmlDoc = xmlDoc
        
        this.reformatXML()
        
        var cadenceLocations = []
        // console.log(xmlDoc.getElementById("P1").tagName)
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

    reformatXML() {
        /* We should remove non-esssential elements from our xml object
        We should do this by deciding what are essential elements and then remove any of the others
        Essential elements:
            score-partwise, work, work-title, part-list, score-part, part-name, part, measure, attributes, divisions,
            key, fifths, mode, time, beats, beat-type, clef, sign, line, note, pitch, step, octave, duration, type,
            direction, direction-type, metronome, beat-unit, per-minute
        */

            const essentialElements = [
                "score-partwise", "work", "work-title", "part-list", "score-part","part-name",
                "part", 'measure', "attributes", "divisions", "key", "fifths", "mode", "time",
                "beats", "beat-type", "clef", "sign", "line", "note", "pitch", "step", "octave",
                "duration", "type", "direction", "direction-type", "metronome", "beat-unit", "per-minute"
            ]
    
            const allElements = Array.from(this.xmlDoc.getElementsByTagName("*"))
    
            var allElementsAsString = []
            allElements.forEach(element => {
                allElementsAsString.push(element.tagName)
            });
    
            console.log(allElementsAsString)
    
            const filteredElementNames = Array.from(allElementsAsString).filter(element => {
                return !essentialElements.includes(element);
              });
    
            console.log(filteredElementNames)
    
            filteredElementNames.forEach(element => {
                var elementsToDelete = Array.from(this.xmlDoc.getElementsByTagName(element))
                elementsToDelete.forEach(elementToDelete => {
                    elementToDelete.remove()
                });
            });
    }
}

