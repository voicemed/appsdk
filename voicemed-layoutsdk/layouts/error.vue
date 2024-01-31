<template>
  <v-app dark :class="[deviceClass]">
    <h1 v-if="error.statusCode === 404">
      {{ pageNotFound }}
    </h1>
    <h1 v-else>
      {{ otherError }}
    </h1>
    <NuxtLink to="/">
      Home page
    </NuxtLink>
  </v-app>
</template>

<script>
export default {
  name: 'EmptyLayout',
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred'
    }
  },
  computed: {
    deviceClass()
    {
      let deviceClasses = [];
      if ($nuxt.$device.isMobile) {
        deviceClasses.push("mobile");
      }
      if ($nuxt.$device.isIos) {
        deviceClasses.push("ios");
      }
      if ($nuxt.$device.isApple) {
        deviceClasses.push("apple");
      }
      if ($nuxt.$device.isChrome) {
        deviceClasses.push("chrome");
      }
      if ($nuxt.$device.isAndroid) {
        deviceClasses.push("android");
      }
      return deviceClasses.join(" ");
    }
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  }
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
