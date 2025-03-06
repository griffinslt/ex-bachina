import jsHelpers from "@/jsHelpers";
import { Chord, Key } from "tonal";

export default class ABCChorale {
    constructor(abcString, chorale) {
        this.abcString = abcString;
        this.abcNotes = this.getOrderOfNotes();
        this.noteList = chorale.getNoteList();
        this.chorale = chorale;
        this.linebreaks = null;
        this.run();
    }

    run() {
        // this.bassPart();//
        const voice1Bars = this.findVoiceLine(1).split(" | ");
        this.linebreaks = jsHelpers.indexOfItemInElement(voice1Bars, "\n");
        // this.writeBassLine();
        // this.writeAltoAndTenorParts();
    }

    getOrderOfNotes(){
        var notes = new Array();
        for (let i = 0; i < 28; i++) {
            var note = String.fromCharCode(i % 7 + 65);
            if (i < 7) {
                note += ",,";
            } else if (i < 14){
                note += ",";
            } else if (i > 20){
                note = note.toLowerCase();
            }
            notes.push(note)
        }
        return notes;
    }

    addPassingNotes(string) {
        var stringAsArray = jsHelpers.splitElementsOfArray(string.split(" | "), " ");
        stringAsArray[0].splice(0, 1);
        stringAsArray[stringAsArray.length - 1].pop();

        stringAsArray = string.split(" ");
        const voiceDefinition = stringAsArray.splice(0, 1);
        const doubleBarLine = stringAsArray.splice(stringAsArray.length - 1, 1);
        var newString = voiceDefinition;

        for (let i = 0; i <= stringAsArray.length - 2; i++) {
            newString += " ";
            if (stringAsArray[i] != "|" && stringAsArray[i] != "\n") {
                var currentNoteVal = stringAsArray[i].charCodeAt(0)

                var n = 1
                while (stringAsArray[i + n] == "|" || stringAsArray[i + n] == "\n") {
                    n++;
                }
                var nextNote = stringAsArray[i + n]

                if (!/\d/.test(stringAsArray[i])) {
                    if (nextNote != undefined) {
                        if (currentNoteVal == nextNote.charCodeAt(0)) {
                            if (currentNoteVal == 65) {
                                currentNoteVal += 7
                            }
                            var temp = stringAsArray[i].slice(1)
                            const newNote = String.fromCharCode(currentNoteVal - 1) + temp;
                            newString += stringAsArray[i] + "1/2 " + newNote + "1/2 "
                        }
                        else if (currentNoteVal == (nextNote.charCodeAt(0) + 2)) {
                            var temp = stringAsArray[i].slice(1)
                            const newNote = String.fromCharCode(currentNoteVal - 1) + temp;
                            newString += stringAsArray[i] + "1/2 " + newNote + "1/2 "

                        } else {
                            newString += stringAsArray[i];
                        }
                    } else {
                        newString += stringAsArray[i];
                    }

                } else {
                    newString += stringAsArray[i];
                }

            } else {
                newString += stringAsArray[i];
            }

        }
        return newString + stringAsArray[stringAsArray.length - 1] + doubleBarLine;

    }

    getString() {
        return this.abcString;
    }

    addBassPart() {
        const stringToSearch = "V:1 treble ";
        const startingIndex = this.abcString.indexOf(stringToSearch);
        var startSubstring = this.abcString.substring(0, startingIndex + stringToSearch.length + 1)
        const endSubstring = this.abcString.substring(startingIndex + stringToSearch.length + 1, this.abcString.length)
        startSubstring += "V:4 bass\n";

        this.abcString = startSubstring + endSubstring;
    }
    addAltoAndTenorParts() {
        const stringToSearch = "V:1 treble ";
        const startingIndex = this.abcString.indexOf(stringToSearch);
        var startSubstring = this.abcString.substring(0, startingIndex + stringToSearch.length + 1)
        const endSubstring = this.abcString.substring(startingIndex + stringToSearch.length + 1, this.abcString.length)
        startSubstring += "V:2 treble\nV:3 bass\n";

        this.abcString = startSubstring + endSubstring;
    }

    findVoiceLine(num) {
        const startingIndex = this.abcString.indexOf("V:" + num + "\n") + 4;
        if (startingIndex == 3) {
            return null
        }
        const stringPostStartingIndex = this.abcString.substring(startingIndex, this.abcString.length);
        return stringPostStartingIndex.substring(0, stringPostStartingIndex.indexOf('|]') + 2);
    }

    removeSharpOrFlat(note) {
        if (note.includes("#")) {
            return note.slice(0, -1);
        }

        return note;
    }


    writeAltoAndTenorParts() {
        this.addAltoAndTenorParts();
        var altoLineString = "V:2\n";
        var tenorLineString = "V:3\n";
        var currentBar = 0;
        var numOfBars = 0;
        var previousNote = null;

        for (const note of this.noteList) {
            if (currentBar < note.barNumber) {
                altoLineString += " |";
                tenorLineString += " |";
                currentBar = note.barNumber;
                numOfBars++;
                if (numOfBars == this.linebreaks + 1) {
                    altoLineString += "\n";
                    tenorLineString += "\n";
                }
            }

            if (note.pitch != null) {
                const selectedNotes = this.selectAltoAndTenorNotes(note, previousNote);
                previousNote = selectedNotes;
                const altoNote = selectedNotes.alto;
                const tenorNote = selectedNotes.tenor;
                altoLineString += " " + altoNote;
                tenorLineString += " " + tenorNote;
            } else {
                altoLineString += " z";
                tenorLineString += " z";
            }

            if (note.type == "half") {
                var numToAdd = 2;
                if (note.dot) {
                    numToAdd++;
                }
                altoLineString += numToAdd;
                tenorLineString += numToAdd;
            }
            if (note.nextNote == null) {
                altoLineString += "|]";
                tenorLineString += "|]";
            }



        }

        this.abcString += this.addPassingNotes(altoLineString) + "\n";
        this.abcString += this.addPassingNotes(tenorLineString) + "\n";
    }


    selectAltoAndTenorNotes(note, previousNote) {


        if (previousNote) {
            console.log(previousNote);
        } 

        const sopranoNote = note.pitch.step;
        const bassnote = this.getBassNote(note.chord).replaceAll(",", "");
        const formattedChord = this.chorale.separateInversion(note.chord);
        const notesNotYetUsed = this.chorale.getTriadFromNumeral(formattedChord.numeral).filter(
            (val) => val != sopranoNote && val != bassnote
        );



        if (notesNotYetUsed.length == 2) {
            return {
                alto: this.removeSharpOrFlat(notesNotYetUsed[0]),
                tenor: this.removeSharpOrFlat(notesNotYetUsed[1]) + ","
            }
        } else {
            return {
                alto: this.removeSharpOrFlat(notesNotYetUsed[0]),
                tenor: this.removeSharpOrFlat(jsHelpers.randomise(this.chorale.getTriadFromNumeral(formattedChord.numeral))[0]) + ","
            }
        }

    }

    removeBassLine(){
        const bassline = this.findVoiceLine(4);
        this.abcString = this.abcString.replace(bassline, "");
        this.abcString = this.abcString.replace("\nV:4\n", "");
        this.abcString = this.abcString.replace("V:4 bass\n", "");
    }
    removeAltoAndTenorLines(){
        const altoLine = this.findVoiceLine(2);
        const tenorLine = this.findVoiceLine(3);
        this.abcString = this.abcString.replace(altoLine, "");
        this.abcString = this.abcString.replace("\nV:2\n", "");
        this.abcString = this.abcString.replace("V:2 treble\n", "");

        this.abcString = this.abcString.replace(tenorLine, "");
        this.abcString = this.abcString.replace("\nV:3\n", "");
        this.abcString = this.abcString.replace("V:3 bass\n", "");
    }
    

    writeBassLine() {
        this.addBassPart();
        var bassLineString = "V:4\n";
        var currentBar = 0;
        var numOfBars = 0;
        for (const note of this.noteList) {
            if (currentBar < note.barNumber) {
                bassLineString += " |";
                currentBar = note.barNumber;
                numOfBars++;
                if (numOfBars == this.linebreaks + 1) {
                    bassLineString += " \n";
                }
            }
            if (note.pitch != null) {
                const bassNote = this.getBassNote(note.chord)
                if (typeof bassNote == "undefined") {
                    console.log(note)
                }

                bassLineString += " " + this.removeSharpOrFlat(bassNote);
            } else {
                bassLineString += " z";
            }
            if (note.type == "half") {
                var numToAdd = 2;
                if (note.dot) {
                    numToAdd++;
                }
                bassLineString += numToAdd;
            }
            if (note.nextNote == null) {
                bassLineString += " |]";
            }
        }

        this.abcString += this.addPassingNotes(bassLineString) + "\n";
    }

    getBassNote(chord) {
        if (typeof chord == "undefined") {
            return; // sort this out
        }
        const formattedChord = this.chorale.separateInversion(chord);
        const triad = this.chorale.getTriadFromNumeral(formattedChord.numeral);
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
    }

}