<template>
    <div class="row text-center">
        <div class="col">
            <h1>Interactive Stave</h1>
            <div id="target"></div>
            <div id="audio" class=""></div>
        </div>
        <div class="col">
            <br>
            <FlowDiagram :currentStep="currentStep" :key="componentKey" />
        </div>
    </div>
</template>

<script>

import FlowDiagram from '@/components/FlowDiagram.vue';
import { ref } from 'vue';

export default {
    setup() {
        const componentKey = ref(1);
        const currentStep = ref(0);
        var chorale = null;
        var abcChorale = null;

        return { componentKey, currentStep}
    },
    components: { FlowDiagram }
}
</script>