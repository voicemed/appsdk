<template>
  <div class="mic-input bigversion" :data-amplitude="currentAmplitude">
    <div v-for="(b,idx) in bars" :key="'bar_'+idx" :class="['bar','bar'+idx]" :style="'height:'+bars[idx]+'%;'"></div>
  </div>
</template>
<script>
const barNumber = 13;
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
      bars: [],
      threshold: 1.2
    }
  },
  mounted() {
    this.$set(this,'bars',[]);
    for (let i = 0; i < this.maxBars; i++) {
      this.bars.push(0);
    }
  },
  computed: {
    maxBars: function () {
      return barNumber;
    },
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
        for (var i = 0; i < this.bars.length; i++) {
          this.bars[i] = 0
        }
        return
      }
      //Bar 7 valore max
      //Bar 6->0 decrescente
      //Bar 8->max decrescente
      //Bar2 è la centrale,
      //Bar 1 e 3 sempre uguali
      const amplitude = this.amplitude * this.threshold;
      if (Math.round(this.amplitude / 10) % 2 == 1) {
        const fullValue = Math.min(amplitude, 60);
        this.bars[6] = fullValue;
        for (var i = 0; i < 6; i++) {
          let range = [(i+1) * 16, Math.min(100,(i + 2) * 16)];
          let perc = Math.random() * (range[0] - range[1]) + range[1];
          this.bars[5 - i] = Math.min(10, fullValue * (perc / 100))
          this.bars[7 + i] = Math.min(10, fullValue * (perc / 100))

        }
      } else {
        const fullValue = amplitude
        this.bars[6] = Math.min(amplitude / 2, 10)
        for (var i = 0; i < 6; i++) {
          let range = [(i+1) * 16, Math.min(100,(i + 2) * 16)];
          let perc = 100 - (Math.random() * (range[0] - range[1]) + range[1]);
          this.bars[5 - i] = Math.min(60, fullValue * (perc / 100))
          this.bars[7 + i] = Math.min(60, fullValue * (perc / 100))
        }
      }
    }
  }
}
</script>


