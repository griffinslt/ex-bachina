import { elements, MusicXML, asserts } from "@stringsync/musicxml"
import Part from "./Part"
import { Chord, Key, Scale } from "tonal"

export default class Chorale {
    constructor(xmlDoc) {
        this.xmlDoc = xmlDoc
        this.cadenceLocations = []
        this.removeHarmony()
        this.reformatXML()
        this.computeFermataLocations()
        this.numOfBars = this.computeNumberOfBars()
        this.addNewParts()
        this.startingKeySignature = { tonic: "", mode: "" }
        this.findKey()



        this.musicXmlObj = MusicXML.parse(new XMLSerializer().serializeToString(this.xmlDoc.documentElement));
        this.parts = [
            this.musicXmlObj.getRoot().getParts()[0],
            this.musicXmlObj.getRoot().getParts()[1],
            this.musicXmlObj.getRoot().getParts()[2],
            this.musicXmlObj.getRoot().getParts()[3],
        ]



        this.timeSignature = { numerator: 4, denominator: 4 }

        this.chooseCadences()
    }
    getChoraleAsString() {
        return this.musicXmlObj.serialize()
    }

    getCadenceLocations() {
        return this.cadenceLocations
    }

    computeNumberOfBars() {
        return this.xmlDoc.getElementsByTagName('measure').length
    }


    computeFermataLocations() {
        const allFermatas = Array.from(this.xmlDoc.getElementsByTagName('fermata'))
        var locations = []
        allFermatas.forEach(fermata => {
            const note = fermata.parentElement.parentElement
            const bar = note.parentElement
            const barNumber = parseInt(bar.getAttribute('number'))
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
            "type", "direction", "direction-type", "metronome", "beat-unit", "per-minute", "barline",
            "rest", "bar-style", "backup", "accidental", "alter"
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

    addNewParts() {
        this.addNewPart("P2", "Alto")
        this.addNewPart("P3", "Tenor")
        this.addNewPart("P4", "Bass")
        const partList = this.xmlDoc.getElementsByTagName("part-list")[0]
        console.log(this.xmlDoc)


    }

    addNewPart(id, name) {
        const partList = this.xmlDoc.getElementsByTagName("part-list")[0]
        const scorePart = this.xmlDoc.createElement("score-part")
        scorePart.id = id
        const partName = this.xmlDoc.createElement("part-name")
        partName.textContent = name
        scorePart.appendChild(partName)
        partList.appendChild(scorePart)

        const part = this.xmlDoc.createElement('part');
        part.id = id

        const scorePartWise = this.xmlDoc.getElementsByTagName("score-partwise")[0]
        scorePartWise.appendChild(part);


        // Add a measures to the new part
        this.initialiseBars(part)

    }

    initialiseBars(part) {
        // const measure = this.xmlDoc.createElement('measure')
        // measure.setAttribute('number', 0);
        // measure.innerHTML = '<attributes><divisions>4</divisions><key><fifths>0</fifths></key><time symbol="common"><beats>4</beats><beat-type>4</beat-type></time><staves>2</staves><clef number="1"><sign>G</sign><line>2</line></clef><clef number="2"><sign>F</sign><line>4</line></clef></attributes>'
        // const note = this.xmlDoc.createElement('note');
        // note.innerHTML = "<pitch><step>E</step><octave>4</octave></pitch><duration>1</duration><type>quarter</type>"
        // part.appendChild(measure)
        // measure.appendChild(note)


        // const note2 = this.xmlDoc.createElement('note');
        // note2.innerHTML = "<pitch><step>E</step><octave>4</octave></pitch><duration>1</duration><type>quarter</type>"

        // const note3 = this.xmlDoc.createElement('note');
        // note3.innerHTML = "<pitch><step>E</step><octave>3</octave></pitch><duration>1</duration><type>quarter</type>"

        // const note4 = this.xmlDoc.createElement('note');
        // note4.innerHTML = "<pitch><step>E</step><octave>5</octave></pitch><duration>1</duration><type>quarter</type>"

        // const note5 = this.xmlDoc.createElement('note');
        // note5.innerHTML = "<pitch><step>E</step><octave>4</octave></pitch><duration>1</duration><type>quarter</type>"


        // const measure2 = this.xmlDoc.createElement('measure')
        // measure2.setAttribute('number', 1);
        // part.appendChild(measure2)
        // measure2.appendChild(note2)
        // measure2.appendChild(note3)
        // measure2.appendChild(note4)
        // measure2.appendChild(note5)

        // just sets the number of bars for each part
        for (let i = 0; i <= this.numOfBars; i++) {
            const newBar = this.xmlDoc.createElement('measure')
            newBar.setAttribute('number', i);
            part.appendChild(newBar)

        }
    }

    findKey() {
        const keyElements = this.xmlDoc.getElementsByTagName("key")
        var mode = null
        var fifths = null
        if (keyElements.length == 1) {
            fifths = parseInt(keyElements[0].getElementsByTagName("fifths")[0].innerHTML)
            mode = keyElements[0].getElementsByTagName("mode")[0]
        } else {
            throw new Error("This program cannot handle multiple keys");
        }
        if (typeof mode == 'undefined') {
            mode = "major" // This might be a bad idea - may need to check for accidentals
        }
        this.startingKeySignature = this.fifthsToKey(fifths, mode.innerHTML)



    }

    fifthsToKey(fifths, mode) {
        const majorKeys = [
            'Cb', 'Gb', 'Db', 'Ab', 'Eb', 'Bb', 'F', 'C',
            'G', 'D', 'A', 'E', 'B', 'F#', 'C#',
        ];
        const minorKeys = [
            'Ab', 'Eb', 'Bb', 'F', 'C', 'G', 'D', 'A',
            'E', 'B', 'F#', 'C#', 'G#', "D#", "A#"
        ];

        const index = fifths + 7

        if (mode == "major") {
            return { tonic: majorKeys[index], mode: mode }
        } else if (mode == "minor") {
            return { tonic: minorKeys[index], mode: mode }
        } else {
            throw new Error("Unknown Mode");

        }

    }


    chooseCadences() {
        // for each fermata location select chords
        //get part
        // const part1 = this.musicXmlObj.getRoot().getParts()[0]
        const part1Bars = this.parts[0].getMeasures()

        var currentKey = null
        if (this.startingKeySignature.mode == "major") {
            currentKey = Key.majorKey(this.startingKeySignature.tonic)
        } else {
            currentKey = Key.minorKey(this.startingKeySignature.tonic)

        }
        console.log(currentKey)


        this.cadenceLocations.forEach(cadenceLocation => {
            const melodicPatternForCadence = this.getThreeCadenceNotes(part1Bars, cadenceLocation, currentKey)
            const possibleCadenceHere = this.getPossibleCadences(melodicPatternForCadence)
            // console.log(possibleCadenceHere)
        });
    }

    notesFromBar(bar) {
        var notes = []
        bar.forEach(element => {
            if (asserts.isNote(element)) {
                notes.push(element)
            }
        });

        return notes
    }

    pitchFromNote(note) {
        const pitchObj = note.contents[0].filter(value => asserts.isPitch(value))[0]
        const octaveObj = pitchObj.getOctave()
        const stepObj = pitchObj.getStep()
        const stepText = stepObj.contents[0] + this.getAccidentalFromNote(note)

        return { step: stepText, octave: octaveObj.contents[0] }


    }

    getAccidentalFromNote(note){
        var textAccidental = ""
        if(note.getAccidental() != null){
            textAccidental = note.getAccidental().contents[0]
        }
        switch (textAccidental) {
            case "sharp":
                return "#"
            case "flat":
                return "b"
            default:
                return ""
        }

    }

    getThreeCadenceNotes(part1Bars, cadenceLocation, currentKey) {
        // get the final note


        var cadenceBar = part1Bars[cadenceLocation.barNumber]
        if (typeof cadenceBar != "undefined") {
            var barContents = cadenceBar.contents[0]
            var notes = this.notesFromBar(barContents)
            const thirdNote = notes[cadenceLocation.noteNumber]
            
            
            
            //find out what note it is in relation to our key
            let thirdNotePositionInScale = this.getNotePositionInScale(thirdNote, currentKey)
            // get the second note
            var secondNote = null
            var barNumber = cadenceLocation.barNumber
            var secondNotePositionInBar = null
            if (cadenceLocation.noteNumber == 0) {
                // go to previous bar
                barNumber--
                cadenceBar = part1Bars[barNumber]
                barContents = cadenceBar.contents[0]
                notes = this.notesFromBar(barContents)
                secondNotePositionInBar = notes.length-1
                secondNote = notes[secondNotePositionInBar]
            } else{
                secondNotePositionInBar = cadenceLocation.noteNumber - 1
                secondNote = notes[secondNotePositionInBar]
            }
            
            const secondNotePositionInScale = this.getNotePositionInScale(secondNote, currentKey)
            // get the first note
            var firstNote = null
            if (secondNotePositionInBar == 0) {
                barNumber--
                cadenceBar = part1Bars[barNumber]
                barContents = cadenceBar.contents[0]
                notes = this.notesFromBar(barContents)
                firstNote = notes[notes.length-1]
            } else{
                firstNote = notes[secondNotePositionInBar - 1] 
            }
            const firstNotePositionInScale = this.getNotePositionInScale(firstNote, currentKey)

            return [firstNotePositionInScale + 1, secondNotePositionInScale + 1, thirdNotePositionInScale + 1]
            
        }

        // throw new Error("Melodic Pattern Not Calculated Properly")
        

    }


    getPossibleCadences(melodicPattern) {
        // console.log("###")
        console.log(melodicPattern)
        var possibleCadences = []

        if (JSON.stringify(melodicPattern) == JSON.stringify([3,2,1])) {
            possibleCadences.push(["Ic", "V", "I"])
            possibleCadences.push(["Ib", "V", "I"]) // should use a passing note int he base for this one
        } else if(JSON.stringify(melodicPattern) == JSON.stringify([2,2,1])) {
            possibleCadences.push(["ii7b", "V", "I"]) // use Ib or vi as approach chords for ii7b
            possibleCadences.push(["V", "I"]) // to be used with a four three suspension
        } else if (JSON.stringify(melodicPattern) == JSON.stringify([8, 7, 8])){
            possibleCadences.push(["V", "I"]) // to be used with a four three suspension
            possibleCadences.push(["ii7b", "V", "I"])
            possibleCadences.push(["Ic", "V", "I"])
        } else if (JSON.stringify(melodicPattern) == JSON.stringify([6, 7, 8])){
            possibleCadences.push(["IV", "viib", "I"]) //double the third in viib
            possibleCadences.push(["IV", "V", "I"])
        } else if (JSON.stringify(melodicPattern) == JSON.stringify([3, 3, 2])){
            possibleCadences.push(["Ib", "V", "I"])
        } else if (JSON.stringify(melodicPattern) == JSON.stringify([4, 3, 2])){
            possibleCadences.push(["viib", "Ib", "V"])
            possibleCadences.push(["IVb", "I", "V"])
        } else if (JSON.stringify(melodicPattern) == JSON.stringify([1, 2, 1])){
            possibleCadences.push(["Ib", "V", "I"])
            possibleCadences.push(["Ib", "ii7b", "I"])
        } else if (melodicPattern == [8, 8, 7]){
            possibleCadences.push(["Ib", "V", "I"])
        }

        return possibleCadences

    }

    getNotePositionInScale(cadenceNote, currentKey) {
        if (typeof cadenceNote != "undefined") {
            const pitch = this.pitchFromNote(cadenceNote)
            // console.log(currentKey.type == 'minor')
            var notePosition = null
            if (currentKey.type == 'minor') {
                notePosition = currentKey.melodic.scale.indexOf(pitch.step)
                // console.log("####")
                // console.log("Pitch:" + pitch.step)
                // console.log("Scale:" + currentKey.melodic.scale)
                // console.log("NotePositionInScale:" + notePosition)
            } else {
                notePosition = currentKey.scale.indexOf(pitch.step)

            }
            return notePosition
        }

    }








}

