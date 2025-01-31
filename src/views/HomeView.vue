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
          <button class="btn btn-info">Load a Different Melody</button></p>
        <div id="audio" class=""></div>
      </div>

    </div>
    <div class="col">
      <v-network-graph class="graph" :nodes="nodes" :edges="edges" :layouts="layouts" />
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
import graphData from '@/composables/graphData';
import theoryData from '@/composables/theoryData';


export default {

  setup() {

    const { nodes, edges, layouts } = graphData
    console.log()
    const steps = theoryData.steps
    const currentStep = ref(1)

    const scores = ref([
      '253',
      '254',
      '259',
      '264',
      '291',
      '438',
    ])
    const currentScore = ref(scores.value[3])

    const errors = ref([])

    // const { string, error, load } = getXMLAsString('/scores/BWV_0' + currentScore.value + '.xml')
    const { string, error, load } = getXMLAsString('/scores/BWV_0' + currentScore.value + '.xml')
    const xmlString = ref(string.value)
    load()
    if (error.value) {
      errors.value.push(error)
    }



    const showScore = () => {
      const { text, error, convert } = xmlToAbc(xmlString.value)
      convert()
      if (error.value) {
        errors.value.push(error.value)
      }
      var visualObj = renderAbc("target", text.value);

      // code for playback
      var abcOptions = { add_classes: true };
      var audioParams = { chordsOff: true };

      var cursorControl = new CursorControl();

      if (synth.supportsAudio()) {
        var synthControl = new synth.SynthController();
        synthControl.load("#audio",
          cursorControl,
          {
            displayLoop: false,
            displayRestart: false,
            displayPlay: true,
            displayProgress: true,
            displayWarp: false
          }
        );
        var createSynth = new synth.CreateSynth();
        createSynth.init({ visualObj: visualObj[0] }).then(function () {
          synthControl.setTune(visualObj[0], false, audioParams).then(function () {
            console.log("Audio successfully loaded.")
          }).catch(function (error) {
            console.warn("Audio problem:", error);
          });
        }).catch(function (error) {
          console.warn("Audio problem:", error);
        });
      } else {
        document.querySelector("#audio").innerHTML =
          "Audio is not supported in this browser.";
      }



    }

    const nextStep = () => {
      if (currentStep.value < steps.length-1) {
        currentStep.value++
      }
    }

    const previousStep = () => {
      if (currentStep.value > 0) {
        console.log("here")
        currentStep.value--
      }
    }


    const scoreAsObject = () => {
      const xmlDoc = new DOMParser().parseFromString(string.value, "text/xml")
      var c = new Chorale(xmlDoc)
      xmlString.value = c.getChoraleAsString()
      console.log(xmlString.value)

    }


    // waits until the file is read
    watch(string, () => {
      scoreAsObject()
      showScore()

    })



    return { errors, scores, edges, nodes, layouts, steps, currentStep, nextStep, previousStep }
  }

}

</script>
<style>
@import 'abcjs/abcjs-audio.css';

.graph {
  width: 100%;
  height: 600px;
}
</style>
