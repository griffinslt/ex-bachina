
<template>
  <header>
    <div class="wrapper">
      <nav>
        <div class="row text-end">
    <p>
      <RouterLink to="/" class="btn btn-dark-outline btn-lg shadow-none">Walkthough</RouterLink> | 
      <RouterLink to="/steps" class="btn btn-dark-outline btn-lg shadow-none">Steps</RouterLink> | 
      <button class="btn btn-dark-outline btn-lg border-none">Interactive Stave</button> | 
      <button class="btn btn-dark-outline btn-lg shadow-none">Generate</button></p>
    <br><br>
  </div>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<script>

import { RouterLink, RouterView } from 'vue-router'
export default {
  setup(){




return {RouterLink, RouterView}
  }
}
</script>



