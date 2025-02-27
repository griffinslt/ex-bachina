<template>
    <div style="top: 0;position: fixed;background: rgba(0, 0, 0, 0.5);width: 100%;height: 100%;" class=" d-flex justify-content-center"  @click="$emit('close')">
        <div class="card my-5 p-2 text-center" style="min-width: 500px; height: 60%;"  @click="$emit('close')">
            <slot>

            </slot>
        </div>
    </div>
</template>


<script>
export default {
    setup(){
        
    }
    
    
}
</script>




<style>

</style>