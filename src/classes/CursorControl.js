export default class CursorControl {
    constructor() {
        this.beatSubdivisions = 2;
        this.onStart = function () {
            console.log("The tune has started playing.");
        };
        this.onFinished = function () {
            console.log("The tune has stopped playing.");
        };
        this.onBeat = function (beatNumber) {
            console.log("Beat " + beatNumber + " is happening.");
        };
        this.onEvent = function (event) {
            console.log("An event is happening", event);
        };
    }
}