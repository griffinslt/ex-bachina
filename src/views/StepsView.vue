<template>
    <h1>Steps</h1>
    <div class="row">
        <div class="col-md-8"><p>There is a flashcard for each step of the harmonising process. Click on a flashcard to reveal the content </p></div>
        <div class="col text-end"><button @click="toggleAddNewFlashCard" class="btn btn-primary text-white">Add new flashcard</button></div>
    </div>
    
    <hr>
    <div class="row">
        <div class="col">
            <div class="row">
                <div  v-for="step in steps" :key=step.title class="col">
                    <FlashCard :step="step"/>
                </div>
            </div>
        </div>
    </div>

    <div v-if="showAddNewFlashCardModal">
    <Modal @close="toggleAddNewFlashCard">
      <h5>Add a new flashcard</h5>
      <form @submit.prevent="handleSubmit" class="p-2">
        <input required type="text" v-model="term" placeholder="Term" class="form-control m-2">
        <textarea required class="form-control m-2" v-model="definition" rows="7" placeholder="Definition"></textarea>

        <button class="btn btn-primary text-white">Submit</button>
      </form>
    </Modal>
</div>
</template>

<script>
import theoryData from '@/composables/theoryData';
import FlashCard from '@/components/FlashCard.vue';
import FlowDiagram from '@/components/FlowDiagram.vue';
import { ref } from 'vue';
import Modal from '@/components/Modal.vue';



export default {
    setup() {
        const steps = ref(theoryData.steps.slice(1).slice(0, -1));
        const showAddNewFlashCardModal = ref(false);
        const term = ref("");
        const definition = ref("");
        
        const toggleAddNewFlashCard = () => {
            showAddNewFlashCardModal.value = !showAddNewFlashCardModal.value;
        }

        const handleSubmit = () => {
            console.log(definition.value);
            steps.value.push({
                title: term.value,
                content: definition.value.split(/\n/)
            });
            toggleAddNewFlashCard();
        }
        
        return { steps, showAddNewFlashCardModal, term, definition, toggleAddNewFlashCard, handleSubmit};
    },
    components: { FlashCard, FlowDiagram, Modal }
}

</script>
