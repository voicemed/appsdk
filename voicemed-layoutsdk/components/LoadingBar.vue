<template>
  <div v-if="loading" :class="['loading-page',(currentPage&&currentPage.name?currentPage.name:'')]" style="display: none;">
    <div class="loading" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import {mapGetters} from "vuex";

export default Vue.extend({
  computed: {
    ...mapGetters({
      getCurrentPage: 'getCurrentPage'
    }),
    currentPage() {
      return this.getCurrentPage
    }
  },
  data: () => ({
    loading: false
  }),
  methods: {
    start () {
      this.loading = true
    },
    finish () {
      this.loading = false
    }
  }
})
</script>

<style scoped>
.loading-page {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0,0,0,.3);
  z-index: 1000;
  padding: 1rem;
  text-align: center;
  font-size: 3rem;
  font-family: sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.loading {
  display: inline-block;
  width: 10rem;
  height: 10rem;
  border: 15px solid rgba(255, 255, 255, 0.705);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
}
@keyframes spin {
  to {
    -webkit-transform: rotate(360deg);
  }
}
</style>
