import RecorderWorker from '~/assets/recorder.worker.js'

export default (context, inject) => {
  inject('worker', {
    createRecorderWorker () {
      return new RecorderWorker()
    }
  })
}
