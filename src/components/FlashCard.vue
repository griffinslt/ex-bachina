<template>

    <div class="card-container">
            <div @click="toggleFlashCard" class="card m-2">
            <div class="card-body">
                <h5 v-if="!showContent" class="card-title"> {{ step.title }} </h5>
                <div v-if="showContent" class="card-text"> 
                    <ul v-for="point in step.content">
                        <li>{{ point }}</li>
                    </ul></div>
            </div>
        </div>
    </div>

</template>

<script>
import { ref } from 'vue';


export default {
    props: ['step'],
    setup(props) {
        const step = ref(props.step);
        const showContent = ref(false);

        const toggleFlashCard = () => {
            showContent.value = !showContent.value
        }

        return {step, showContent, toggleFlashCard}
    }

}

</script>

<style>

.card-container:active .card {
  transform: rotateY(180deg);}

.card {
  position: relative;
  transition: transform 0.8s;
  transform-style: preserve-3d;
  width: 300px;
  min-height: 300px;
}

</style>