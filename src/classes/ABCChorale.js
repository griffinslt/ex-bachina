export default class ABCChorale {
    constructor(abcString, noteList) {
        this.abcString = abcString;
        this.noteList = noteList;
        this.run();        
    }

    run(){
        this.addOtherParts()
        const voice1Bars = this.findVoiceLine(1).split(" | ");
        console.log(voice1Bars)
        var voice4Bars = voice1Bars;

        
    }

    addOtherParts(){
        const stringToSearch = "V:1 treble ";
        const startingIndex = this.abcString.indexOf(stringToSearch);
        var startSubstring = this.abcString.substring(0,startingIndex + stringToSearch.length + 1)
        const endSubstring = this.abcString.substring(startingIndex + stringToSearch.length + 1,this.abcString.length)

        startSubstring += "V2: treble\nV3: bass\nV4:bass\n";
        
        this.abcString = startSubstring + endSubstring;

    }

    findVoiceLine(num){
        console.log(this.abcString)
        const startingIndex = this.abcString.indexOf("V:"+ num +"\n") + 4;
        const stringPostStartingIndex = this.abcString.substring(startingIndex, this.abcString.length);
        return stringPostStartingIndex.substring(0, stringPostStartingIndex.indexOf('|]'));
    }

    writeBassLine(){
        var bassLineString = "V:4"
        for(note of this.noteList){
            
        }
    }


}