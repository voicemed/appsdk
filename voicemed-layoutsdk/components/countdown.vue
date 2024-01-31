<template>
  <div class="countdown_wrapper"></div>
</template>
<script>
const MILLISECONDS_SECOND = 1000;
const EVENT_ABORT = 'abort';
const EVENT_END = 'end';
const EVENT_PROGRESS = 'progress';
const EVENT_START = 'start';
const EVENT_VISIBILITY_CHANGE = 'visibilitychange';

export default {
  name: "CountDown",
  props: {
    interval: {
      type: Number,
      default: 1000
    },
    timerLength: {
      type: Number,
      default: 10000
    },
    reverse: {
      type: Boolean,
      default: false
    },
    now: {
      type: Function,
      default: () => Date.now(),
    },
    emits: {
      EVENT_ABORT,
      EVENT_END,
      EVENT_PROGRESS,
      EVENT_START
    }
  },
  data() {
    return {
      counting: false,
      totalMilliseconds: 0,
      requestId: 0,
      endTime: 0,
      elapsed: 0
    }
  },
  computed: {
    totalSeconds() {
      return Math.floor(this.totalMilliseconds / MILLISECONDS_SECOND);
    }
  },
  watch: {
    $props: {
      deep: true,
      immediate: true,
      handler() {
        this.totalMilliseconds = this.timerLength;
        this.endTime = this.now() + this.timerLength;
        //this.start();
      }
    },
  },
  mounted() {
    document.addEventListener(EVENT_VISIBILITY_CHANGE, this.handleVisibilityChange);
  },

  beforeUnmount() {
    document.removeEventListener(EVENT_VISIBILITY_CHANGE, this.handleVisibilityChange);
    this.pause();
  },
  methods: {
    restart() {
      this.totalMilliseconds = this.timerLength;
      this.endTime = this.now() + this.timerLength;
      this.elapsed = 0;
      this.start();
    },
    start() {
      if (this.counting) {
        return;
      }
      this.counting = true;
      this.$emit(EVENT_START);
      if (document.visibilityState === 'visible') {
        this.continue();
      }
    },
    getElapsed() {
      return this.elapsed;
    },
    continue() {
      if (!this.counting) {
        return;
      }
      const delay = Math.min(this.totalMilliseconds, this.interval);
      if (delay > 0) {
        let init;
        let prev;
        const step = (now) => {
          if (!init) {
            init = now;
          }
          if (!prev) {
            prev = now;
          }
          const range = now - init;
          if (range >= delay || range + ((now - prev) / 2) >= delay) {
            this.progress();
          } else {
            this.requestId = requestAnimationFrame(step);
          }
          prev = now;
        };
        this.requestId = requestAnimationFrame(step);
      } else {
        this.end();
      }
    },
    pause() {
      cancelAnimationFrame(this.requestId);
    },
    progress() {
      if (!this.counting) {
        return;
      }
      this.totalMilliseconds -= this.interval;
      this.elapsed += this.interval;
      if (this.totalMilliseconds > 0) {
        this.$emit(EVENT_PROGRESS, {
          totalSeconds: this.totalSeconds,
          totalMilliseconds: this.totalMilliseconds,
          interval: this.interval,
          elapsed: this.elapsed
        });
      }
      this.continue();
    },
    abort() {
      if (!this.counting) {
        return;
      }
      this.pause();
      this.counting = false;
      this.$emit(EVENT_ABORT);
    },
    end() {
      if (!this.counting) {
        return;
      }
      this.pause();
      this.counting = false;
      this.$emit(EVENT_END, {
        totalSeconds: this.totalSeconds,
        totalMilliseconds: this.totalMilliseconds,
        interval: this.interval,
        elapsed: this.elapsed
      });
      this.totalMilliseconds = 0;
    },
    update() {
      if (this.counting) {
        this.totalMilliseconds = Math.max(0, this.endTime - this.now());
      }
    },
    handleVisibilityChange() {
      switch (document.visibilityState) {
        case 'visible':
          this.update();
          this.continue();
          break;
        case 'hidden':
          this.pause();
          break;
        default:
      }
    }
  }


}
</script>
