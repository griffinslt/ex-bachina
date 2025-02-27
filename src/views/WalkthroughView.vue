<template>
  <div v-if="errors.length > 0" class="alert alert-danger text-start" role="alert">
    <ul v-for="error in errors" :key="error">
      <li> {{ error }}</li>
    </ul>
  </div>

  <div class="row">
    <div class="col text-center">
      <h1>Bach Harmony Generator</h1>
      <div class="">
        <br><br>
        <div id="target"></div>
        <div id="audio" class=""></div>
        <div class="bg-light border rounded my-3 p-5 text-start">
          <p><strong>{{ steps[currentStep].title }}</strong></p>
          <ReadMore :steps="steps" :currentStep="currentStep" :key="componentKey"/>
          <p  v-if="currentStep == 4">
            <button class="btn btn-info" @click="toggleChordDiagram">Chord Progression Flow Chart</button> | 
            <button class="btn btn-info" @click="toggleChordTable">Chord Table</button>
          </p>
          <button class="btn btn-danger" v-if="currentStep == 6" @click="backToStart">Back To Start</button>
        </div>
        <p class="text-start">
          <button @click="previousStep" class="btn btn-secondary">Back a Step</button> |
          <button @click="nextStep" class="btn btn-primary text-white">Next Step</button> |
          <button @click="loadDifferentMelody" class="btn btn-info">Load a Different Melody</button>
        </p>
      </div>
      
    </div>
    <div class="col">
      <FlowDiagram />
    </div>
  </div>
  <div v-if="showChordTable">
    <Modal @close="toggleChordTable">
      <ChordTable :choraleKey="choraleKey"/>
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
import getXMLAsString from '@/composables/getXMLAsString';
import xmlToAbc from '@/composables/xmlToAbc';
import { renderAbc, synth } from 'abcjs';
import { ref, watch } from 'vue';
import Chorale from '@/classes/Chorale'
import CursorControl from '@/classes/CursorControl';
import theoryData from '@/composables/theoryData';
import FlowDiagram from '@/components/FlowDiagram.vue';
import ABCChorale from '@/classes/ABCChorale';
import ReadMore from '@/components/ReadMore.vue';
import jsHelpers from '@/jsHelpers';
import Modal from '@/components/Modal.vue';
import ChordTable from '../components/ChordTable.vue';


export default {
  setup() {
    const showChordTable = ref(false)
    const showChordDiagram = ref(false)
    const componentKey = ref(1);
    const currentStep = ref(0);
    const choraleKey = ref(null);
    var chorale = null;
    const steps = ref(theoryData.steps);
    const stepsCopy = theoryData.steps;
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
    const { string, error, load } = getXMLAsString("/scores/BWV_0" + currentScore.value + ".xml");
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
        currentStep.value++;
      }
    };
    const previousStep = () => {
      if (currentStep.value > 0) {
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

    const toggleChordTable = () =>{
      showChordTable.value = !showChordTable.value;
    }
    const toggleChordDiagram = () =>{
      showChordDiagram.value = !showChordDiagram.value;
    }

    // waits until the file is read
    watch(string, () => {
      scoreAsObject();
      getABCString();
      showScore();
    });


    //force reload readmore component
    watch(currentStep, () => {
      steps.value = stepsCopy;
      componentKey.value++;
      if (currentStep.value == 1) {
        const key = chorale.getKey();
        choraleKey.value=key;
        contextSteps.value = ["In this this case, the key is " + key.tonic + " " + key.mode];
      } else if (currentStep.value == 2) {

        const cadenceLocations = chorale.getCadenceLocations();
        contextSteps.value = ["In this case there are  " + cadenceLocations.length + " cadences. These can be found in the following locations: "];
        for (const cadence of cadenceLocations){
          contextSteps.value.push("Bar " + cadence.barNumber + " note " + (cadence.noteNumber + 1))
        }
        
      } else if (currentStep.value == 3) {
        // choose cadence chords


        contextSteps.value = [];
      
        for (let i = 0; i < chorale.getMelodicPatterns().length; i++) {
          var stepString = "For cadence number " + (i + 1) + " the melodic pattern is ";
          for (const element of chorale.getMelodicPatterns()[i]){
            stepString +=  element + "-";
          }
          stepString = stepString.slice(0, -1) + ". This means that the possible chords are ";
          for (const cadence of chorale.possibleCadences[i]){
            for (const chord of cadence){
              stepString += chord + "-";
            }
            stepString = stepString.slice(0, -1) + " or ";
          }
          stepString = stepString.slice(0, -4) + ". ";
          
          for (const chord of chorale.selectedCadences[i]){
            stepString += chord + "-";
            
          }
          stepString = stepString.slice(0, -1) + " has been selected.";
          contextSteps.value.push(stepString);
        }
        
        
        
        
        
      } else if (currentStep.value == 4){
        contextSteps.value = [];
        var stepString = "The chords selected here are "
        
        for (const chord of jsHelpers.pluck(chorale.noteList, 'chord')){
          stepString += chord + "-";
        }
        stepString = stepString.slice(0, -1) + ".";
        contextSteps.value.push(stepString);

        if (abcChorale != null) {
          abcChorale.removeBassLine();
          abcText.value = abcChorale.getString();
          showScore();
          
        }

      } else if (currentStep.value == 5){
        contextSteps.value = [];
        if (abcChorale == null){
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


      } else if (currentStep.value == 6){
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
      for (const step of contextSteps.value){
        steps.value[currentStep.value].content.push(step);
      }
    });
    return { errors, scores, steps, currentStep, componentKey, contextSteps, showChordTable, showChordDiagram, choraleKey, nextStep, previousStep, loadDifferentMelody, backToStart, toggleChordTable, toggleChordDiagram };
  },
  components: { FlowDiagram, ReadMore, Modal, ChordTable }
}

</script>
<style>
@import 'abcjs/abcjs-audio.css';
</style>
