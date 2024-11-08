import Voice from "./Voice"

export default class Chorale {
    constructor(xmlDoc) {

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

    

        const allElements = Array.from(xmlDoc.getElementsByTagName("*"))

        var allElementsAsString = []
        allElements.forEach(element => {
            allElementsAsString.push(element.tagName)
        });

        console.log(allElementsAsString)

        // console.log(essentialElements)
        // console.log(allElements)

        const filteredElements = Array.from(allElementsAsString).filter(element => {
            return !essentialElements.includes(element);
          });

        console.log(filteredElements)

        // filteredElements.forEach(element => {
        //     xmlDoc.getElementsByTagName()
        // });
    
        var cadenceLocations = []
        console.log(xmlDoc.getElementById("P1").tagName)
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
    test() {
        console.log('working')
    }
}

