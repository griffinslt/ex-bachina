<template>
    <h1>Steps</h1>
    <p>There is a flashcard for each step of the harmonising process. Click on a flashcard to reveal the content </p>
    <hr>
    <div class="row">
        <div class="col">
            <div class="row">
                <div  v-for="step in steps" :key=step.title class="col">
                    <FlashCard :step="step"/>
                </div>
            </div>
        </div>
        <!-- <div class="col">
            <FlowDiagram />
        </div> -->
    </div>
</template>

<script>
import theoryData from '@/composables/theoryData';
import FlashCard from '@/components/FlashCard.vue';
import FlowDiagram from '@/components/FlowDiagram.vue';


export default {
    setup() {
        const steps = theoryData.steps;
        steps.shift()
        return { steps };
    },
    components: { FlashCard, FlowDiagram }
}

</script>
