import { elements, MusicXML, asserts } from "@stringsync/musicxml"
import Part from "./Part"
import MyNote from "./Note"
import { Chord, Key, Scale } from "tonal"
import { Duration, Note, Rest, Type } from "@stringsync/musicxml/dist/generated/elements"

export default class Chorale {
    constructor(xmlDoc) {
        this.xmlDoc = xmlDoc;
        this.cadenceLocations = [];
        this.removeHarmony();
        this.reformatXML();
        this.computeFermataLocations()
        this.numOfBars = this.computeNumberOfBars();
        this.addNewParts();
        // console.log(this.xmlDoc)
        this.startingKeySignature = { tonic: "", mode: "" };
        this.findKey();
        this.noteList = [];


        this.musicXmlObj = MusicXML.parse(new XMLSerializer().serializeToString(this.xmlDoc.documentElement));
        // console.log(this.musicXmlObj)
        this.parts = [
            this.musicXmlObj.getRoot().getParts()[0],
            this.musicXmlObj.getRoot().getParts()[1],
            this.musicXmlObj.getRoot().getParts()[2],
            this.musicXmlObj.getRoot().getParts()[3],
        ];
        // this.fillMeasuresWithRests()
        // console.log(this.musicXmlObj)



        this.timeSignature = { numerator: 4, denominator: 4 };

        this.getListOfAllNotes();
        this.addCadenceChordsToNotes();
    }
    getChoraleAsString() {
        // return new XMLSerializer().serializeToString(this.xmlDoc.documentElement)
        return this.musicXmlObj.serialize();
    }

    getCadenceLocations() {
        return this.cadenceLocations;
    }

    computeNumberOfBars() {
        return this.xmlDoc.getElementsByTagName('measure').length;
    }


    computeFermataLocations() {
        const allFermatas = Array.from(this.xmlDoc.getElementsByTagName('fermata'));
        var locations = [];
        allFermatas.forEach(fermata => {
            const note = fermata.parentElement.parentElement;
            const bar = note.parentElement;
            const barNumber = parseInt(bar.getAttribute('number'));
            const noteNumber = Array.prototype.indexOf.call(bar.getElementsByTagName("note"), note);
            locations.push({
                barNumber: barNumber,
                noteNumber: noteNumber
            })
        })
        this.cadenceLocations = locations
    }


    removeHarmony() {
        // Remove all voices that are not <voice>1</voice>
        var voiceElements = Array.from(this.xmlDoc.getElementsByTagName('voice'))
        for (const element of voiceElements) {
            if (element.innerHTML != "1") {
                element.parentElement.remove()
            }
        }
    }

    reformatXML() {
        // Remove non-essential elements from MusicXML

        const essentialElements = [
            "score-partwise", "work", "work-title", "part-list", "score-part", "part-name", "part",
            'measure', "attributes", "divisions", "key", "fifths", "mode", "time", "fermata", "notations",
            "beats", "beat-type", "clef", "sign", "line", "note", "pitch", "step", "octave", "duration",
            "type", "direction", "direction-type", "metronome", "beat-unit", "per-minute", "barline",
            "rest", "bar-style", "backup", "accidental", "alter"
        ]

        const allElements = Array.from(this.xmlDoc.getElementsByTagName("*"))

        var allElementsAsString = []

        for (const element of allElements) {
            allElementsAsString.push(element.tagName)
        }


        const filteredElementNames = allElementsAsString.filter(element => {
            return !essentialElements.includes(element);
        });


        for (const element of filteredElementNames) {
            var elementsToDelete = Array.from(this.xmlDoc.getElementsByTagName(element))
            for (const elementToDelete of elementsToDelete) {
                elementToDelete.remove()
            }
        }
    }

    getListOfAllNotes() {
        // return
        const part1Bars = this.parts[0].getMeasures()
        var myNotes = []
        for (let j = 0; j < part1Bars.length; j++) {
            var barContents = part1Bars[j].contents[0]
            var notes = this.notesFromBar(barContents)
            for (let i = 0; i < notes.length; i++) {
                const pitch = this.pitchFromNote(notes[i])
                const myNote = new MyNote(null, null, pitch, notes[i].getType().contents[0], j)
                myNotes.push(myNote)
            }


            for (let i = 0; i < myNotes.length; i++) {
                if (i > 0) {
                    myNotes[i].setPreviousNote(myNotes[i - 1])
                }

                if (i < myNotes.length - 1) {
                    myNotes[i].setNextNote(myNotes[i + 1])
                }
            }

        }

        this.noteList = myNotes;

    }

    addCadenceChordsToNotes() {
        const cadenceChords = this.chooseCadences();
        for (let i = 0; i < this.cadenceLocations.length; i++) {
            const notesFromBar = this.noteList.filter(note => note.barNumber == this.cadenceLocations[i].barNumber);
            const cadenceNote = notesFromBar[this.cadenceLocations[i].noteNumber];
            var currentNote = cadenceNote;
            for (let j = cadenceChords[i].length - 1; j >= 0; j--) {
                currentNote.chord = cadenceChords[i][j];
                currentNote = currentNote.previousNote;
            }
        }
    }


    addNewParts() {
        this.addNewPart("P2", "Alto")
        this.addNewPart("P3", "Tenor")
        this.addNewPart("P4", "Bass")
        const partList = this.xmlDoc.getElementsByTagName("part-list")[0]
        // console.log(this.xmlDoc)


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
        for (let i = 0; i < this.numOfBars; i++) {
            const newBar = this.xmlDoc.createElement('measure')
            const attributes = this.xmlDoc.createElement('attributes')
            newBar.setAttribute('number', i);
            // attributes.innerHTML = "<key><fifths>1</fifths><mode>major</mode></key><time symbol='common'><beats>4<beats><beat-type>4</beat-type><time><clef><sign>C</sign><line>4</line></clef>"
            // newBar.appendChild(attributes)
            part.appendChild(newBar)
            // const note = this.xmlDoc.createElement('note')
            // const rest = this.xmlDoc.createElement('rest')
            // const duration = this.xmlDoc.createElement('duration')
            // const type = this.xmlDoc.createElement('type')
            // const pitch = this.xmlDoc.createElement('pitch')
            // const step = this.xmlDoc.createElement('step')
            // const octave = this.xmlDoc.createElement('octave')
            // duration.innerHTML = 1920
            // type.innerHTML="whole"

            // step.innerHTML="B"
            // octave.innerHTML=4

            // if (i % 2 ==0) {
            //     note.appendChild(rest)

            // } else {
            //     pitch.appendChild(step)
            //     pitch.appendChild(octave)
            //     note.appendChild(pitch)

            // }

            // note.appendChild(type)
            // note.appendChild(duration)
            // newBar.appendChild(note)


        }
    }

    fillMeasuresWithRests() {
        return
        for (const part of this.parts.slice(1)) {
            const bars = part.getMeasures()
            for (const bar of bars) {
                const rest = new Rest()
                rest.measure = true
                // console.log(rest)
                const beatsPerMeasure = 4// Numerator of the time signature (e.g., 4/4)
                const divisionsPerBeat = 4// Divisions per beat (e.g., quarter note = 4 divisions)
                const totalDuration = beatsPerMeasure * divisionsPerBeat;

                const type = new Type()

                // const duration = new Duration(1920)

                // note.contents[0].push(rest, duration)
                const note = new Note()
                var duration = note.contents[0].filter(value => asserts.isDuration(value))[0]
                note.contents[5] = type
                // console.log(type)
                duration.contents[0] = 1920

                // note.contents[0].push(rest)
                // console.log(note.contents[0].filter(value => !asserts.isPitch(value)))

                // console.log(duration.contents[0])


                // note.contents[0].push(rest)

                bar.contents[0].push(note)
                // console.log(bar.notes)

                console.log(note)


            }
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
            throw new Error("This program cannot handle multiple keys.")
        }
        if (typeof mode == 'undefined') {
            throw new Error("Poor MusicXML - Mode note defined.")
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
            throw new Error("Unknown Mode")

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
        // console.log(currentKey.chordScales[0])
        console.log(currentKey)

        var previousCadences = []
        for (const cadenceLocation of this.cadenceLocations) {
            const melodicPatternForCadence = this.getThreeCadenceNotes(part1Bars, cadenceLocation, currentKey)
            const possibleCadenceHere = this.getPossibleCadences(melodicPatternForCadence) // if there is no possible cadence then maybe it is a sign to modulate
            if (possibleCadenceHere.length == 0) {
                previousCadences.push("No cadences found")
            } else {
                const selectedCadence = this.selectCadence(previousCadences, possibleCadenceHere)
                previousCadences.push(selectedCadence)
            }
        }
        return previousCadences
    }

    selectOtherChords() {
        // for each note that does not have a selected chord, select one


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
        if (typeof pitchObj == "undefined") {
            return // do something proper here

        }
        const octaveObj = pitchObj.getOctave()
        const stepObj = pitchObj.getStep()
        const stepText = stepObj.contents[0] + this.getAccidentalFromNote(note)

        return { step: stepText, octave: octaveObj.contents[0] }


    }

    getAccidentalFromNote(note) {
        var textAccidental = ""
        if (note.getAccidental() != null) {
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
                secondNotePositionInBar = notes.length - 1
                secondNote = notes[secondNotePositionInBar]
            } else {
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
                firstNote = notes[notes.length - 1]
            } else {
                firstNote = notes[secondNotePositionInBar - 1]
            }
            const firstNotePositionInScale = this.getNotePositionInScale(firstNote, currentKey)

            return [firstNotePositionInScale + 1, secondNotePositionInScale + 1, thirdNotePositionInScale + 1]

        }

        // throw new Error("Melodic Pattern Not Calculated Properly")
        console.log(cadenceBar)


    }


    getPossibleCadences(melodicPattern) {
        // console.log("###")
        // console.log(melodicPattern)
        var possibleCadences = []

        if (typeof melodicPattern == "undefined") {
            return []
        }

        if (JSON.stringify(melodicPattern) == JSON.stringify([3, 2, 1])) {
            possibleCadences.push(["Ic", "V", "I"])
            possibleCadences.push(["Ib", "V", "I"]) // should use a passing note int he base for this one
        } else if (JSON.stringify(melodicPattern) == JSON.stringify([2, 2, 1]) || JSON.stringify(melodicPattern) == JSON.stringify([2, 2, 3])) {
            possibleCadences.push(["ii7b", "V", "I"]) // use Ib or vi as approach chords for ii7b
            possibleCadences.push(["V", "I"]) // to be used with a four three suspension
        } else if (JSON.stringify(melodicPattern) == JSON.stringify([8, 7, 8])) {
            possibleCadences.push(["V", "I"]) // to be used with a four three suspension
            possibleCadences.push(["ii7b", "V", "I"])
            possibleCadences.push(["Ic", "V", "I"])
        } else if (JSON.stringify(melodicPattern) == JSON.stringify([6, 7, 8])) {
            possibleCadences.push(["IV", "viib", "I"]) //double the third in viib
            possibleCadences.push(["IV", "V", "I"])
        } else if (JSON.stringify(melodicPattern) == JSON.stringify([3, 3, 2])) {
            possibleCadences.push(["Ib", "V", "I"])
        } else if (JSON.stringify(melodicPattern) == JSON.stringify([4, 3, 2])) {
            possibleCadences.push(["viib", "Ib", "V"])
            possibleCadences.push(["IVb", "I", "V"])
        } else if (JSON.stringify(melodicPattern) == JSON.stringify([1, 2, 1])) {
            possibleCadences.push(["Ib", "V", "I"])
            possibleCadences.push(["Ib", "ii7b", "I"])
        } else if (JSON.stringify(melodicPattern) == JSON.stringify([1, 1, 7])) { // 887
            possibleCadences.push(["Ib", "V", "I"])
        } else if (JSON.stringify(melodicPattern) == JSON.stringify([5, 4, 3])) {
            possibleCadences.push(["I", "viib", "Ib"]) // there are some serious caveats with these
            possibleCadences.push(["Ib", "viib", "I"]) // there are some serious caveats with these
        } else if (JSON.stringify(melodicPattern) == JSON.stringify([5, 4, 5])) {
            possibleCadences.push("ivb to V in a minor key")
        } else if (JSON.stringify(melodicPattern) == JSON.stringify([1, 1, 1])) { //888
            possibleCadences.push(["IVc", "I", "I"])  //with auxillary note decaration of the I-I inner parts
        }

        melodicPattern.shift()
        if (JSON.stringify(melodicPattern) == JSON.stringify([6, 5])) {
            possibleCadences.push(["iv", "V"]) //unlikely
            possibleCadences.push(["IV", "I"])  //there are alternatives apparently
        } else if (JSON.stringify(melodicPattern) == JSON.stringify([1, 2])) {
            possibleCadences.push(["I", "V"])
            possibleCadences.push(["IV", "V"])
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

    selectCadence(previousCadences, possibleCadences) {
        // previousCadences = previousCadences.sort(() => 0.5 - Math.random())
        possibleCadences = possibleCadences.sort(() => 0.5 - Math.random())

        // if any of the possible cadences are in the previous cadences, remove them unless there would be no more possible cadences (variety is better)
        // for (const possibleCadence of possibleCadences) {
        //     console.log(this.inlcudesArray(possibleCadence, previousCadences))
        //     if (this.inlcudesArray(possibleCadence, previousCadences) && possibleCadences.length > 1) {
        //         const indexToRemove = this.indexOfArray(possibleCadence, previousCadences)
        //         console.log("Index: " + indexToRemove)
        //         possibleCadences.splice(indexToRemove, 1)

        //     }
        // }
        return possibleCadences[0]

    }

    inlcudesArray(needle, haystack) {
        if (JSON.stringify(haystack).includes(JSON.stringify(needle))) {
            return true
        }
        return false
    }

    indexOfArray(needle, haystack) {
        console.log(haystack)
        for (let i = 0; i < haystack.length; i++) {
            if (JSON.stringify(haystack[i]) == JSON.stringify(needle)) {
                return i
            }
        }
        return null
    }








}

