import Vue from 'vue'


export default (context, inject) => {
  const doubleRequestAnimationFrame = (callback) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(callback)
    })
  }
  const forceNextTick = (callback) => {
    if (callback && typeof callback === 'function') {
      doubleRequestAnimationFrame(callback)
    } else {
      return new Promise(resolve => {
        doubleRequestAnimationFrame(resolve)
      })
    }
  }
  inject('forceNextTick', forceNextTick)
}
