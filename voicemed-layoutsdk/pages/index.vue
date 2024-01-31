<template>
  <div class="opening">
    Voicemed Loader
  </div>
</template>
<script>
import basepage from '~/mixins.js/basepage'
import {mapGetters, mapActions} from 'vuex'

export default {
  name: 'welcome',
  layout: 'defaultwithoverlay',
  transition: {
    name: 'fade'
  }
}
</script>
