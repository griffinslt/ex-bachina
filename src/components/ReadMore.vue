<template>

    <ul v-for="(point, index) in steps" :key="index">
        <li v-if="showContent || index > 3">{{ point }}</li>
    </ul>
    <span class="btn btn-link" @click="toggleContent" v-if="!showContent && steps.length > 2">Read More</span>
    <span class="btn btn-link" @click="toggleContent" v-if="showContent && steps.length > 2">Read Less</span>
</template>


<script>
import { ref } from 'vue';



export default {
    props: ['steps'],
    setup(props) {
        const steps = ref(props.steps);
        const showContent = ref(false);

        const toggleContent = () => {
            showContent.value = !showContent.value
        }

        return { steps, showContent, toggleContent }
    }

}

</script>