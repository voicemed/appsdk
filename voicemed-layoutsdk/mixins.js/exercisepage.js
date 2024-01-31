import basepage from "~/mixins.js/basepage";
import {mapGetters, mapActions} from 'vuex'

export default {
  name: 'expage',
  mixins: [basepage],
  computed: {
    ...mapGetters({
      getExercises: 'getExercises',
      getCurrentExercise: 'getCurrentExercise'
    }),
    exercise() {
      return this.getCurrentExercise
    },
  },
  mounted() {
    console.log('monti pagina interna ex', this.getExercises, this.getCurrentExercise);

    if(!this.getExercises) {
      // alert('baseModule cannot retrieve exercises list')
      // $nuxt.$router.replace($nuxt.localePath("/"));
      console.warn("Cannot retrieve exercise list in page");
    }
    if(this.getExercises.length===0) {
      // alert('baseModule cannot retrieve exercises list [2]')
      // $nuxt.$router.replace($nuxt.localePath("/"));
      console.error("Cannot retrieve exercise list in page");
    }

  }
}
