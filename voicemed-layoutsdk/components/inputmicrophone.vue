<template>
  <div class="mic-input" :data-amplitude="currentAmplitude">
    <div class="bar bar1" :style="'height:'+bar1+'%;'"></div>
    <div class="bar bar2" :style="'height:'+bar2+'%;'"></div>
    <div class="bar bar3" :style="'height:'+bar3+'%;'"></div>
  </div>
</template>
<script>
export default {
  props: {
    amplitude: {
      type: Number,
      default: false
    },
    average: {
      type: Number,
      default: false
    }
  },
  data() {
    return {
      bar1: 0,
      bar2: 0,
      bar3: 0,
      threshold: 1.2
    }
  },
  computed: {
    currentAverage: function () {
      if (this.average < 15) { //Azzera suoni impercettibili
        return
      }
      let isOdd = false;
      if (Math.round(this.average / 10) % 2 == 1) {
        isOdd = true;
      }
      return Math.round(this.average)
    },
    currentAmplitude: function () {
      if (this.amplitude < 15) { //Azzera suoni impercettibili
        this.bar1 = 0;
        this.bar2 = 0;
        this.bar3 = 0;
        return
      }
      //Bar2 è la centrale,
      //Bar 1 e 3 sempre uguali
      if (Math.round(this.amplitude / 10) % 2 == 1) {
        this.bar1 = Math.min(this.amplitude * this.threshold / 2, 10)
        this.bar2 = Math.min(this.amplitude * this.threshold, 60)
        this.bar3 = Math.min(this.amplitude * this.threshold / 2, 10)
      } else {
        this.bar1 = Math.min(this.amplitude * this.threshold, 60)
        this.bar2 = Math.min(this.amplitude * this.threshold / 2, 10)
        this.bar3 = Math.min(this.amplitude * this.threshold, 60)
      }
    }
  }
}
</script>


