<template>
  <div :class="['fullPageCard',this.showFooter===false?'no-footer':'']">
    <div class="header" :data-swipe-ignore="!enableSwipte">
      <slot name="header"></slot>
    </div>
    <div class="body" :data-swipe-ignore="!enableSwipte">
      <slot name="body"></slot>
    </div>
    <div class="footer" v-if="showFooter" :data-swipe-ignore="!enableSwipte">
      <slot name="footer"></slot>
    </div>
  </div>

</template>
<script>
export default {
  props: {
    'hidefooter': {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showFooter: true,
      enableSwipte:false
    }
  },
  mounted() {
    this.showFooter = !this.hidefooter;
    if(this.$el.getAttribute("data-swipe-enable")==='true') {
      this.enableSwipte = true;
    }
  }
}
</script>
