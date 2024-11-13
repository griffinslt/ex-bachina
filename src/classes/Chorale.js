import Part from "./Part"

export default class Chorale {
    constructor(xmlDoc) {
        this.xmlDoc = xmlDoc
        this.cadenceLocations = []
        this.removeHarmony()
        this.reformatXML()
        this.computeFermataLocations()
        this.numOfBars = this.computeNumberOfBars()
        this.addNewParts()
        this.findKey()

        this.voices = [
            new Part("S"),
            new Part("A"),
            new Part("T"),
            new Part("B"),
        ]



        this.timeSignature = { numerator: 4, denominator: 4 }
        this.startingKeySignature = ""
    }
    getChoraleAsString() {
        return new XMLSerializer().serializeToString(this.xmlDoc.documentElement);
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
            const barNumber = bar.getAttribute('number')
            const noteNumber = Array.prototype.indexOf.call(bar.getElementsByTagName("note"), note);
            locations.push({
                barNumber: barNumber,
                noteNumber: noteNumber
            })
        })
        this.cadenceLocations = locations
    }

    findKey() {
        const keyElements = this.xmlDoc.getElementsByTagName("key")
        var mode = null
        var fifths = null
        if (keyElements.length == 1) {
            fifths = parseInt(keyElements[0].getElementsByTagName("fifths")[0].innerHTML)
            mode = keyElements[0].getElementsByTagName("mode")[0]
            // console.log(fifths, mode)
        } else {
            console.log("Multiple keys")
        }
        if (typeof mode == 'undefined') {
            mode = "major" // This might be a bad idea - may need to check for accidentals
        }
        this.startingKeySignature = this.fifthsToKey(fifths, mode)
        console.log(this.startingKeySignature)



    }

    fifthsToKey(fifths, mode) {
        const majorKeys = [
            'Cb', 'Gb', 'Db', 'Ab','Eb','Bb','F','C',
            'G', 'D', 'A', 'E', 'B', 'F#', 'C#',
        ];
        const minorKeys = [
            'Ab', 'Eb','Bb', 'F', 'C', 'G', 'D', 'A',
            'E', 'B', 'F#', 'C#', 'G#', "D#", "A#"
        ];
        
        const index = fifths + 7

        if (mode == "major") {
            return majorKeys[index] + " " + mode
        } else if (mode == "minor") {
            return minorKeys[index] + " " + mode 
        } else{
            throw new Error("Unknown Mode");
            
        }

        console.log(index)

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
        for (let i = 0; i <= this.numOfBars; i++) {
            const newBar = this.xmlDoc.createElement('measure')
            newBar.setAttribute('number', i);
            part.appendChild(newBar)

        }






    }
}

