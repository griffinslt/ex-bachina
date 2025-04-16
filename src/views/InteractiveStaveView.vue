<template>

    <div class="alert alert-warning text-start" role="alert">
        <ul>
            <li>This page is still under construction...</li>
        </ul>
    </div>

    <div v-if="errors.length > 0" class="alert alert-danger text-start" role="alert">
        <ul v-for="error in errors" :key="error">
            <li> {{ error }}</li>
        </ul>
    </div>

    <div class="row text-center">
        <div class="col">
            <h1>Interactive Stave</h1>
            <br>
            <div id="target"></div>
            <div id="audio" class=""></div>
            <div class="bg-light border rounded my-3 p-5 text-start">
                <p><strong>{{ steps[currentStep].title }}</strong></p>

                <div v-if="currentStep == 1">
                    <form @submit.prevent="handleSubmit" class="p-2">
                        <input required type="text" v-model="testTonic" placeholder="Tonic e.g. C" class="form-control m-2">
                        <input required type="text" v-model="testMode" placeholder="Mode e.g. Major or Minor"
                            class="form-control m-2">
    
                        <button class="btn btn-info">Submit</button>
                    </form>

                </div>

                <div v-if="correct">
                    <p><strong>That is the correct answer!</strong></p>
                    <button @click="nextStep" class="btn btn-primary text-white">Next Step</button>
                </div>
                <hr>

                <div v-if="showHints">
                    <button class="btn btn-secondary text-white" @click="toggleShowHints">Hide Hints</button>
                    <br>
                    <br>
                    <ReadMore :steps="steps" :currentStep="currentStep" :key="componentKey" />
                    
                </div>
                <div v-else>
                    <button class="btn btn-secondary text-white" @click="toggleShowHints">Show Hints</button>
                </div>


                <div class="text-center">
                    <p v-if="currentStep == 3">
                        <button class="btn btn-info" @click="toggleChordTable">Chord Table</button>
                    </p>
                    <p v-if="currentStep == 4">
                        <button class="btn btn-info" @click="toggleChordDiagram">Chord Progression Flow Chart</button> |
                        <button class="btn btn-info" @click="toggleChordTable">Chord Table</button>
                    </p>
                    <button class="btn btn-danger" v-if="currentStep == 7" @click="backToStart">Back To Start</button>
                </div>
            </div>
        </div>
        <div class="col">
            <br>
            <FlowDiagram :currentStep="currentStep" :key="componentKey" />
        </div>
    </div>
    <div v-if="showChordTable">
        <Modal @close="toggleChordTable">
            <ChordTable :choraleKey="choraleKey" />
        </Modal>
    </div>
    <div v-if="showChordDiagram">
        <Modal @close="toggleChordDiagram">
            <h5>Chord Progression Flow Chart</h5>
            <img src="/chord_progressions.svg" />
        </Modal>
    </div>
</template>

<script>

import Chorale from '@/classes/Chorale';
import CursorControl from '@/classes/CursorControl';
import FlowDiagram from '@/components/FlowDiagram.vue';
import getXMLAsString from '@/composables/getXMLAsString';
import xmlToAbc from '@/composables/xmlToAbc';
import { renderAbc, synth } from 'abcjs';
import { ref, watch } from 'vue';
import theoryData from '@/composables/theoryData';
import ABCChorale from '@/classes/ABCChorale';
import ReadMore from '@/components/ReadMore.vue';
import ChordTable from '@/components/ChordTable.vue';
import Modal from '@/components/Modal.vue';

export default {
    setup() {
        const currentStep = ref(1);
        const correct = ref(false);
        const testTonic = ref("");
        const testMode = ref("");
        const showHints = ref(false);
        const showChordTable = ref(false)
        const showChordDiagram = ref(false)
        const componentKey = ref(1);
        const choraleKey = ref(null);
        var chorale = null;
        const steps = ref(theoryData.steps);
        const stepsCopy = JSON.parse(JSON.stringify(steps.value));
        const contextSteps = ref(null);
        var abcChorale = null;

        const scores = ref([
            "253",
            // '254',
            "259",
            "264",
            "291",
            "438",
        ]);
        const abcText = ref(null)
        const currentScore = ref(scores.value[2]);
        const errors = ref([]);
        // const { string, error, load } = getXMLAsString('/scores/BWV_0' + currentScore.value + '.xml')
        const { string, error, load } = getXMLAsString("/ex-bachina/scores/BWV_0" + currentScore.value + ".xml");
        const xmlString = ref(string.value);

        load();
        if (error.value) {
            errors.value.push(error);
        }
        const showScore = () => {
            var visualObj = renderAbc("target", abcText.value);
            // code for playback
            var abcOptions = { add_classes: true };
            var audioParams = { chordsOff: true };
            var cursorControl = new CursorControl();
            if (synth.supportsAudio()) {
                var synthControl = new synth.SynthController();
                synthControl.load("#audio", cursorControl, {
                    displayLoop: false,
                    displayRestart: false,
                    displayPlay: true,
                    displayProgress: true,
                    displayWarp: false
                });
                var createSynth = new synth.CreateSynth();
                createSynth.init({ visualObj: visualObj[0] }).then(function () {
                    synthControl.setTune(visualObj[0], false, audioParams).then(function () {
                        console.log("Audio successfully loaded.");
                    }).catch(function (error) {
                        console.warn("Audio problem:", error);
                    });
                }).catch(function (error) {
                    console.warn("Audio problem:", error);
                });
            }
            else {
                document.querySelector("#audio").innerHTML =
                    "Audio is not supported in this browser.";
            }
        };

        const getABCString = () => {
            const { text, error, convert } = xmlToAbc(xmlString.value);
            convert();
            abcText.value = text.value;
            if (error.value) {
                errors.value.push(error.value);
            }
        }

        const nextStep = () => {
            if (currentStep.value < steps.value.length - 1) {
                correct.value = false;
                currentStep.value++;
            }
        };
        const previousStep = () => {
            if (currentStep.value > 1) {
                currentStep.value--;
            }
        };
        const loadDifferentMelody = () => {
            currentScore.value = Math.floor(Math.random() * (scores.value.length - 1)); // not working 
            // console.log(currentScore.value);
        };
        const scoreAsObject = () => {
            const xmlDoc = new DOMParser().parseFromString(string.value, "text/xml");
            chorale = new Chorale(xmlDoc);
            xmlString.value = chorale.getChoraleAsString();
        };

        const backToStart = async () => {
            for (let i = 0; i < 6; i++) {
                currentStep.value--;
                await new Promise((resolve) => setTimeout(resolve, 0.1 * 1000));
            }
        }

        const toggleChordTable = () => {
            showChordTable.value = !showChordTable.value;
        }
        const toggleChordDiagram = () => {
            showChordDiagram.value = !showChordDiagram.value;
        }
        const toggleShowHints = () => {
            showHints.value = !showHints.value;
        }

        // waits until the file is read
        watch(string, () => {
            scoreAsObject();
            getABCString();
            showScore();
        });


        //force reload readmore component
        watch(currentStep, () => {
            componentKey.value++;
            steps.value = JSON.parse(JSON.stringify(stepsCopy));
            contextSteps.value = [];

            console.log(steps.value)
            console.log(stepsCopy)


            if (currentStep.value == 1) {
                const key = chorale.getKey();
                choraleKey.value = key;
                contextSteps.value = ["In this this case, the key is " + key.tonic + " " + key.mode];
            } else if (currentStep.value == 2) {

                const cadenceLocations = chorale.getCadenceLocations();
                contextSteps.value = ["In this case there are  " + cadenceLocations.length + " cadences. These can be found in the following locations: "];
                for (const cadence of cadenceLocations) {
                    contextSteps.value.push("Bar " + cadence.barNumber + " note " + (cadence.noteNumber + 1))
                }

            } else if (currentStep.value == 3) {
                // choose cadence chords


                contextSteps.value = [];

                for (let i = 0; i < chorale.getMelodicPatterns().length; i++) {
                    var stepString = "For cadence number " + (i + 1) + " the melodic pattern is ";
                    for (const element of chorale.getMelodicPatterns()[i]) {
                        stepString += element + "-";
                    }
                    stepString = stepString.slice(0, -1) + ". This means that the possible chords are ";
                    for (const cadence of chorale.possibleCadences[i]) {
                        for (const chord of cadence) {
                            stepString += chord + "-";
                        }
                        stepString = stepString.slice(0, -1) + " or ";
                    }
                    stepString = stepString.slice(0, -4) + ". ";

                    for (const chord of chorale.selectedCadences[i]) {
                        stepString += chord + "-";

                    }
                    stepString = stepString.slice(0, -1) + " has been selected.";
                    contextSteps.value.push(stepString);
                }





            } else if (currentStep.value == 4) {
                contextSteps.value = [];
                var stepString = "The chords selected here are "

                for (const chord of jsHelpers.pluck(chorale.noteList, 'chord')) {
                    stepString += chord + "-";
                }
                stepString = stepString.slice(0, -1) + ".";
                contextSteps.value.push(stepString);

                if (abcChorale != null) {
                    abcChorale.removeBassLine();
                    abcText.value = abcChorale.getString();
                    showScore();

                }

            } else if (currentStep.value == 5) {
                contextSteps.value = [];
                if (abcChorale == null) {
                    abcChorale = new ABCChorale(abcText.value, chorale)
                }

                if (abcChorale.findVoiceLine(4) == null) {
                    abcChorale.writeBassLine();
                    abcText.value = abcChorale.getString();
                }

                if (abcChorale.findVoiceLine(2) != null || abcChorale.findVoiceLine(3) != null) {
                    abcChorale.removeAltoAndTenorLines();
                    abcText.value = abcChorale.getString();
                }
                showScore();


            } else if (currentStep.value == 6) {
                contextSteps.value = [];

                if (abcChorale.findVoiceLine(2) == null && abcChorale.findVoiceLine(3) == null) {
                    abcChorale.writeAltoAndTenorParts();
                    abcText.value = abcChorale.getString();
                    showScore();
                }
            } else {
                contextSteps.value = [];
            }

            // add contextual steps to the steps to be displayed
            //   for (const step of contextSteps.value){
            //     steps.value[currentStep.value].content.push(step);
            //   }
        });

        const handleSubmit = () => {
            const lowerTonic = testTonic.value.toLowerCase();
            const lowerMode = testMode.value.toLowerCase();
            if (lowerTonic == "g" && lowerMode == "major") {
                correct.value = true;
            }
        };

        return { errors, scores, steps, currentStep, componentKey, contextSteps, showChordTable, showChordDiagram, choraleKey, showHints, testTonic, testMode, correct, nextStep, previousStep, loadDifferentMelody, backToStart, toggleChordTable, toggleChordDiagram, toggleShowHints, handleSubmit };
    },
    components: { FlowDiagram, ReadMore, Modal, ChordTable }
}
</script>