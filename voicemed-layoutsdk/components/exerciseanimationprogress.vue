<template>
  <div v-bind:class="['donut_progress']">
    <vc-donut
      background="#FFFFFF"
      foreground="#848CE633"
      :size="100" unit="%" :thickness="5"
      :sections='[{"label":"progress","value":currentPercent,"color":primaryColor}]' :total="100"
      :start-angle="0" :auto-adjust-text-size="true">

      <!--<div  v-for="n in exercisescount" :class="['slices',n<=currentExercise?doneClass:'','nth-'+n]" :style="getRotation(n)">
      </div>-->
      <!-- slot inside -->
      <slot name="inside"></slot>
      <!-- end slot indide -->
    </vc-donut>
  </div>
</template>
<script>
  export default {
    props: {
      value : {
        type:Number,
        default:0
      },
      exerciseSteps:{
        type:Number,
        default:1
      },
      startPercent: {
        type:Number,
        default: 0
      },
      doneClass: {
        type:String,
        default:'done'
      },
      maxPercent : {
        type:Number,
        default: 1
      },
      runningPercent: {
        type:Number,
        default: 0
      }
    },
    computed : {
      primaryColor() {
        return $nuxt.$config.env.environment.indexOf('voicemed_')>-1?"#EC483F":"#848CE6";
      },
      exercisescount() {
        return this.exerciseSteps
      },
      currentExercise() {
        return this.value
      },
      currentPercent() {
        return this.runningPercent
      }
    },
    methods: {
      getRotation(index) {
        if(index === 0) {
          return "transform:rotate(0deg);";
        }
        //Get deg for position
        const angles = 360/(this.exercisescount)*(index);
        return "transform:rotate("+angles+"deg);";
      },
    }
  }
</script>
