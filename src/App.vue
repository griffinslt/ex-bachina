<template>
  <header>
    <div class="wrapper">
      <nav>
        <div class="row text-end">
          <p>
            <RouterLink to="/" class="btn btn-dark-outline btn-lg shadow-none">Home</RouterLink> |
            <RouterLink to="/walkthrough" class="btn btn-dark-outline btn-lg shadow-none">Walkthough</RouterLink> |
            <RouterLink to="/steps" class="btn btn-dark-outline btn-lg shadow-none">Steps</RouterLink> |
            <RouterLink to="/interactive-stave" class="btn btn-dark-outline btn-lg border-none">Interactive Stave
            </RouterLink> 
            <!-- | -->
            <!-- <RouterLink to="/generate" class="btn btn-dark-outline btn-lg shadow-none">Generate</RouterLink> -->
          </p>
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
  setup() {
    return { RouterLink, RouterView }
  }
}
</script>
