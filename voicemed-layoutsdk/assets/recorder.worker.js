const _workerFunctions = {
  init: function (config) {
    _workerFunctions.sampleRate = config.sampleRate;
  },
  record: function (inputBuffer) {
    _workerFunctions.recBuffersL.push(inputBuffer[0]);
    _workerFunctions.recBuffersR.push(inputBuffer[1]);
    _workerFunctions.recLength += inputBuffer[0].length;
  },
  exportWAV: function (type) {
    var bufferL = _workerFunctions.mergeBuffers(_workerFunctions.recBuffersL, _workerFunctions.recLength);
    var bufferR = _workerFunctions.mergeBuffers(_workerFunctions.recBuffersR, _workerFunctions.recLength);
    var interleaved = _workerFunctions.interleave(_workerFunctions.bufferL, _workerFunctions.bufferR);
    var dataview = _workerFunctions.encodeWAV(interleaved);
    var audioBlob = new Blob([dataview], {type: type});

    self.postMessage(audioBlob);
  },
  exportMonoWAV: function (type) {
    var bufferL = _workerFunctions.mergeBuffers(_workerFunctions.recBuffersL, _workerFunctions.recLength);
    var dataview = _workerFunctions.encodeWAV(bufferL, true);
    var audioBlob = new Blob([dataview], {type: type});

    self.postMessage(audioBlob);
  },
  getBuffers: function () {
    var buffers = [];
    buffers.push(_workerFunctions.mergeBuffers(_workerFunctions.recBuffersL, _workerFunctions.recLength));
    buffers.push(_workerFunctions.mergeBuffers(_workerFunctions.recBuffersR, _workerFunctions.recLength));
    self.postMessage(buffers);
  },
  clear: function () {
    _workerFunctions.recLength = 0;
    _workerFunctions.recBuffersL = [];
    _workerFunctions.recBuffersR = [];
  },
  mergeBuffers: function (recBuffers, recLength) {
    var result = new Float32Array(recLength);
    var offset = 0;
    for (var i = 0; i < recBuffers.length; i++) {
      result.set(recBuffers[i], offset);
      offset += recBuffers[i].length;
    }
    return result;
  },
  interleave: function (inputL, inputR) {
    var length = inputL.length + inputR.length;
    var result = new Float32Array(length);

    var index = 0,
      inputIndex = 0;

    while (index < length) {
      result[index++] = inputL[inputIndex];
      result[index++] = inputR[inputIndex];
      inputIndex++;
    }
    return result;
  },
  floatTo16BitPCM: function (output, offset, input) {
    for (var i = 0; i < input.length; i++, offset += 2) {
      var s = Math.max(-1, Math.min(1, input[i]));
      output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
  },
  writeString: function (view, offset, string) {
    for (var i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  },
  encodeWAV: function (samples, mono) {
    var buffer = new ArrayBuffer(44 + samples.length * 2);
    var view = new DataView(buffer);
    /* RIFF identifier */
    _workerFunctions.writeString(view, 0, 'RIFF');
    /* file length */
    view.setUint32(4, 32 + samples.length * 2, true);
    /* RIFF type */
    _workerFunctions.writeString(view, 8, 'WAVE');
    /* format chunk identifier */
    _workerFunctions.writeString(view, 12, 'fmt ');
    /* format chunk length */
    view.setUint32(16, 16, true);
    /* sample format (raw) */
    view.setUint16(20, 1, true);
    /* channel count */
    view.setUint16(22, mono ? 1 : 2, true);
    /* sample rate */
    view.setUint32(24, _workerFunctions.sampleRate, true);
    /* byte rate (sample rate * block align) */
    view.setUint32(28, _workerFunctions.sampleRate * 4, true);
    /* block align (channel count * bytes per sample) */
    view.setUint16(32, 4, true);
    /* bits per sample */
    view.setUint16(34, 16, true);
    /* data chunk identifier */
    _workerFunctions.writeString(view, 36, 'data');
    /* data chunk length */
    view.setUint32(40, samples.length * 2, true);

    _workerFunctions.floatTo16BitPCM(view, 44, samples);

    return view;
  },
  recLength: 0,
  recBuffersL: [],
  recBuffersR: [],
  sampleRate: null
}
self.addEventListener('message',(e)=>{
  switch (e.data.command) {
    case 'init':
      _workerFunctions.init(e.data.config);
      break;
    case 'record':
      _workerFunctions.record(e.data.buffer);
      break;
    case 'exportWAV':
      _workerFunctions.exportWAV(e.data.type);
      break;
    case 'exportMonoWAV':
      _workerFunctions.exportMonoWAV(e.data.type);
      break;
    case 'getBuffers':
      _workerFunctions.getBuffers();
      break;
    case 'clear':
      _workerFunctions.clear();
      break;
  }
})
