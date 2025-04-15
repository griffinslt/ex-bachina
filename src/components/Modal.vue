<template>
    <div style="background: rgba(0, 0, 0, 0.5);" class="d-flex justify-content-center full-width"  @click="$emit('close')">
        <div class="card my-5 p-2 text-center" style="min-width: 500px; height: 50%;"  @click.stop="">
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
.full-width {
    width: 100vw;
    height: 100vw;
    position: fixed;
    left: 50%;
    right: 50%;
    margin-left: -50vw;
    margin-right: -50vw;
    top: 50%;
    bottom: 50%;
    margin-top: -30vw;
    margin-bottom: 20vw;
}
</style>