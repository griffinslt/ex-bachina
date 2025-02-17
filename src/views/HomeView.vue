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
        <div class="bg-light border rounded my-3 p-5 text-start">
          <p><strong>{{ steps[currentStep].title }}</strong></p>
          <ul v-for="point in steps[currentStep].content">
            <li>{{ point }}</li>
          </ul>
        </div>
        <p class="text-start">
          <button @click="nextStep" class="btn btn-primary text-white">Next Step</button> |
          <button @click="previousStep" class="btn btn-secondary">Back a Step</button> |
          <button @click="loadDifferentMelody" class="btn btn-info">Load a Different Melody</button>
        </p>
        <div id="audio" class=""></div>
      </div>

    </div>
    <div class="col">
      <FlowDiagram />
    </div>
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


export default {
  setup() {
    var chorale = null;
    const steps = theoryData.steps;
    const currentStep = ref(1);
    const scores = ref([
      "253",
      // '254',
      "259",
      "264",
      "291",
      "438",
    ]);
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
      const { text, error, convert } = xmlToAbc(xmlString.value);
      convert();
      if (error.value) {
        errors.value.push(error.value);
      }
      // console.log(text.value)
      const abcChorale = new ABCChorale(text.value, chorale.getNoteList())
      var visualObj = renderAbc("target", text.value);
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
    const nextStep = () => {
      if (currentStep.value < steps.length - 1) {
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
      // console.log(xmlString.value);
    };
    // waits until the file is read
    watch(string, () => {
      scoreAsObject();
      showScore();
    });
    return { errors, scores, steps, currentStep, nextStep, previousStep, loadDifferentMelody };
  },
  components: { FlowDiagram }
}

</script>
<style>
@import 'abcjs/abcjs-audio.css';
</style>
