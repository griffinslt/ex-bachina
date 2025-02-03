<template>
    <v-network-graph class="graph" :nodes="nodes" :edges="edges" :layouts="layouts" />
</template>

<script>

import graphData from '@/composables/graphData';

export default {
    props: [],
    setup() {
        const { nodes, edges, layouts } = graphData;

        return { nodes, edges, layouts };
    }
}
</script>