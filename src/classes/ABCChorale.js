import jsHelpers from "@/jsHelpers";
import { Chord, Key } from "tonal";

export default class ABCChorale {
    constructor(abcString, chorale) {
        this.abcString = abcString;
        this.noteList = chorale.getNoteList();
        this.chorale = chorale;
        this.linebreaks = null;
        this.run();
    }

    run() {
        this.addOtherParts()
        const voice1Bars = this.findVoiceLine(1).split(" | ");
        this.linebreaks = jsHelpers.indexOfItemInElement(voice1Bars, "\n");
        // console.log(voice1Bars)
        this.writeBassLine();
        this.writeAltoAndTenorParts();


    }

    getLineBreaks() {
    }

    getString() {
        console.log(this.abcString)
        return this.abcString;
    }

    addOtherParts() {
        const stringToSearch = "V:1 treble ";
        const startingIndex = this.abcString.indexOf(stringToSearch);
        var startSubstring = this.abcString.substring(0, startingIndex + stringToSearch.length + 1)
        const endSubstring = this.abcString.substring(startingIndex + stringToSearch.length + 1, this.abcString.length)

        // startSubstring += "V2: treble\nV3: bass\nV4:bass\n";
        startSubstring += "V:4 bass\n";

        this.abcString = startSubstring + endSubstring;



    }

    findVoiceLine(num) {
        // console.log(this.abcString)
        const startingIndex = this.abcString.indexOf("V:" + num + "\n") + 4;
        const stringPostStartingIndex = this.abcString.substring(startingIndex, this.abcString.length);
        return stringPostStartingIndex.substring(0, stringPostStartingIndex.indexOf('|]'));
    }


    writeAltoAndTenorParts(){
        var altoLineString = "V:2\n";
        var tenorLineString = "V:3\n";


    }

    writeBassLine() {
        var bassLineString = "V:4\n";
        var currentBar = 0;
        var numOfBars = 0;
        for (const note of this.noteList) {
            if (currentBar < note.barNumber) {
                bassLineString += " |";
                currentBar = note.barNumber;
                numOfBars++;
                if (numOfBars == this.linebreaks+1) {
                    bassLineString += "\n";
                }
            }
            if (note.pitch != null) {
                const bassNote = this.getBassNote(note.chord, this.getKey())
                if (typeof bassNote == "undefined") {
                    console.log(note)
                }

                bassLineString += " " + bassNote;
            } else {
                bassLineString += " z"
            }
            if (note.type == "half") {
                var numToAdd = 2;
                if (note.dot) {
                    numToAdd ++;
                }
                bassLineString += numToAdd;
            }
            if (note.nextNote == null) {
                bassLineString += "|]";
            }

            

        }

        this.abcString += bassLineString;
    }

    getBassNote(chord, key) {
        if (typeof chord == "undefined") {
            return; // sort this out
        }
        const formattedChord = this.chorale.separateInversion(chord);
        const triad = this.chorale.getTriadFromNumeral(formattedChord.numeral, key);
        switch (formattedChord.inversion) {
            case "a":
                return triad[0] + ",,";
            case "b":
                return triad[1] + ",,";
            case "c":
                return triad[2] + ",,";

            default:
                throw Error("Invalid inversion");
        }
        // const grades = key.grades;
        // const gradeIndex =  grades.indexOf(numeral);s
        // const chordNotes = Chord.get(key.triads[gradeIndex]).notes;
        // return chordNotes;
    }

    getKey() {
        const stringToSearch = "K:";
        const startingIndex = this.abcString.indexOf(stringToSearch) + 2;
        const stringAfterStaringIndex = this.abcString.substring(startingIndex, this.abcString.length);
        const endingIndex = stringAfterStaringIndex.indexOf("\n");
        const key = stringAfterStaringIndex.substring(0, endingIndex);

        if (key.includes("m")) {
            const tonic = key.substring(0, key.indexOf("m"));
            return Key.minorKey(tonic);
        } else {
            return Key.majorKey(key);
        }
    }


}