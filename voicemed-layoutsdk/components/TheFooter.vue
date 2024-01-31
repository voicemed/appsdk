<template>
  <v-footer
    app
  >
    <span>Airlyn &copy; {{ new Date().getFullYear() }}</span>
    <v-spacer/>
    <small>{{$nuxt.$config.env.version}}</small>
  </v-footer>
</template>
