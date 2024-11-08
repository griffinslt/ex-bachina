<template>
  <div v-if="errors.length > 0" class="alert alert-danger text-start" role="alert">
    <ul v-for="error in errors" :key="error">
      <li> {{ error }}</li>
    </ul>
  </div>
  <div class="text-center bg-light border rounded p-5">
    <h1>Bachian Harmony for Teaching Computing in the Classroom</h1>
  </div>
  <br><br><br>
  <div class="text-center">
    <br><br>
    <div ref="paper" id="target"></div>
    <button @click="showScore(string)" class="btn btn-primary">Load Score</button>
  </div>

</template>

<script>
import getXMLAsString from '@/composables/getXMLAsString';
import xmlToAbc from '@/composables/xmlToAbc';
import { renderAbc } from 'abcjs';
import { ref } from 'vue';


export default {

  setup() {

    const errors = ref([])
    const { string, error, load } = getXMLAsString('/helloworld.xml')   
    load()
    if (error.value) {
      errors.value.push(error)
    }

    const showScore = (xml) => {
      const { text, error, convert } = xmlToAbc(string.value)
      convert()
      if (error.value) {
        errors.value.push(error.value)
      }
      console.log(text.value, error.value)
      renderAbc("target", text.value);
      console.log("ran code")

    }

    return { showScore, string, errors }
  }

}

</script>
