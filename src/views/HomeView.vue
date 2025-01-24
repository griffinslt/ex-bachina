<template>
  <div v-if="errors.length > 0" class="alert alert-danger text-start" role="alert">
    <ul v-for="error in errors" :key="error">
      <li> {{ error }}</li>
    </ul>
  </div>
  <div class="text-center bg-light border rounded p-5">
    <h1>Bachian Harmony for Teaching Computing in the Classroom</h1>
  </div>
  <div class="text-center">
    <br><br>
    <div id="target"></div>
  </div>



</template>

<script>
import getXMLAsString from '@/composables/getXMLAsString';
import xmlToAbc from '@/composables/xmlToAbc';
import { renderAbc } from 'abcjs';
import { ref, watch } from 'vue';
import Chorale from '@/classes/Chorale'


export default {

  setup() {
    const scores = ref([
      '253',
      '254',
      '259',
      '264',
      '291',
      '438',
    ])
    const currentScore = ref(scores.value[2])

    const errors = ref([])

    const { string, error, load } = getXMLAsString('/scores/BWV_0' + currentScore.value +'.xml')   
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
      renderAbc("target", text.value);
    }
    
    
    
    const scoreAsObject = () => {
      const xmlDoc = new DOMParser().parseFromString(string.value, "text/xml")
      var c = new Chorale(xmlDoc)
      xmlString.value = c.getChoraleAsString()

    } 
    
    
    // waits until the file is read
    watch(string, () => {
      scoreAsObject()
      showScore()
    
    })



    return { errors, scores }
  }

}

</script>
