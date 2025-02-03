<template>
    <h1>Steps</h1>

    <p>Click a Flashcard to reveal the content </p>
    <div class="row">
        <div  v-for="step in steps" :key=step.title class="col">
            <FlashCard :step="step"/>
        </div>
    </div>
</template>

<script>
import theoryData from '@/composables/theoryData';
import FlashCard from '@/components/FlashCard.vue';


export default {
    setup() {
        const steps = theoryData.steps;
        return { steps };
    },
    components: { FlashCard }
}

</script>
