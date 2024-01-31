<template>
  <v-app :class="[deviceClass]">
    <v-main
      :class="['mainApp',currentRoute, currentRouteClean,deviceClass]">
      <Nuxt class="navpages"/>
    </v-main>
  </v-app>
</template>

<script>


export default {
  name: 'DefaultLayoutWithOverlay',
  data() {
    return {
      title: 'Airlyn',
      showOverlay: true,
    }
  },
  watch: {
    '$route.name': function () {
      this.checkCurrentRoute()
    }
  },
  computed: {
    deviceClass() {
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
    },
    currentPage() {
      return this.getCurrentPage
    },
    currentRoute() {
      if (this.$route.name.indexOf("index") !== -1) {
        return 'index';
      }
      if (this.$route.name.indexOf("today") !== -1) {
        return 'today';
      }
      if (this.$route.name.indexOf("user-me") !== -1) {
        return 'me';
      }
      return this.$route.name;
    },
    currentRouteClean() {
      if (this.$route.name.indexOf("index") !== -1) {
        return 'index';
      }
      if (this.$route.name.indexOf("today") !== -1) {
        return 'today';
      }
      if (this.$route.name.indexOf("user-me") !== -1) {
        return 'me';
      }
      return $nuxt.getRouteBaseName(this.$route);
    }
  },
  methods: {
    checkCurrentRoute() {
      //console.log('retrieve route route', $nuxt.getRouteBaseName(), this.$route,this.$route.name);
      if(this.$route && this.$route.name) {
        if (this.$route.name.indexOf("index") !== -1) {
          this.withBottom = true;
          return;
        }
        if (this.$route.name.indexOf("settings") !== -1) {
          this.withBottom = true;
          return;
        }
        if (this.$route.name.indexOf("user-me") !== -1) {
          this.withBottom = true;
          return;
        }
        if (this.$route.name.indexOf("today") !== -1) {
          this.withBottom = true;
          return;
        }
        if (this.$route.name.indexOf("entries") !== -1) {
          this.withBottom = true;
          return;
        }
      }
      this.withBottom = false;
    },
  },

  mounted() {
    this.checkCurrentRoute();
  }
}
</script>
