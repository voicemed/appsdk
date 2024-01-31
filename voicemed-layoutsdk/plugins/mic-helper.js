import sanitizeHtml from 'sanitize-html';


export default (context, inject) => {
  const initAudio = (deviceLists) => {
    if (window.stream) {
      window.stream.getTracks().forEach(track => {
        track.stop();
      });
    }
    const supportedConstraints = navigator.mediaDevices.getSupportedConstraints();
    console.log('got supported Contraints:', supportedConstraints);
    let mandatoryContraints = {
      "googEchoCancellation": "false",
      "googAutoGainControl": "false",
      "googNoiseSuppression": "false",
      "googHighpassFilter": "false"
    };
    let optionalContraints = {};
    /*
    if (typeof supportedConstraints['sampleRate'] !== 'undefined' && supportedConstraints['sampleRate'] === true) {
      optionalContraints['sampleRate'] = 44100; //Max Quality
    }
    if (typeof supportedConstraints['volume'] !== 'undefined' && supportedConstraints['volume'] === true) {
      optionalContraints['volume'] = 1.0; //Max Volume
    }
    */
    if (typeof supportedConstraints['echoCancellation'] !== 'undefined' && supportedConstraints['echoCancellation'] === true) {
      mandatoryContraints['echoCancellation'] = false; //Suppress echo canc
    }
    /*
    if (typeof supportedConstraints['noiseSuppression'] !== 'undefined' && supportedConstraints['noiseSuppression'] === true) {
      mandatoryContraints['noiseSuppression'] = false; //Suppress noise canc
    }
    if (typeof supportedConstraints['autoGainControl'] !== 'undefined' && supportedConstraints['autoGainControl'] === true) {
      mandatoryContraints['autoGainControl'] = false; //Disable auto volume
    }
     */
    let audiosource = false;
    let audioDevicePreferred = false;
    /*
    if (deviceLists && Array.isArray(deviceLists.audio) && deviceLists.audio.length > 0) {
      const spearkerphones = deviceLists.audio.filter((dev) => dev.id.toLowerCase().indexOf("speaker") !== -1 || dev.name.toLowerCase().indexOf("speaker") !== -1);
      //const defaults = deviceLists.audio.filter((dev) => dev.id.toLowerCase().indexOf("default") !== -1);
      if (spearkerphones.length > 0) {
        audiosource = spearkerphones[0].id;
      }
      if(audiosource) {
        //deviceId: audiosource ? {exact: audiosource} : undefined,
        if (typeof supportedConstraints['deviceId'] !== 'undefined' && supportedConstraints['deviceId'] === true) {
          mandatoryContraints['deviceId'] = audiosource ? {exact: audiosource} : undefined;
        }
      }
    }
    */
    const userMediaParams = {
      //"audio": (typeof mandatoryContraints['deviceId'] !=='undefined') ? mandatoryContraints : {"mandatory":mandatoryContraints }
      "audio": {
        "mandatory": mandatoryContraints,
        "optional": []
      }
    };
    console.log('ready to initAudio recording with constraints:', JSON.stringify(userMediaParams))
    console.log(userMediaParams)
    if (!navigator.getUserMedia)
      navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    if (!navigator.cancelAnimationFrame)
      navigator.cancelAnimationFrame = navigator.webkitCancelAnimationFrame || navigator.mozCancelAnimationFrame;
    if (!navigator.requestAnimationFrame)
      navigator.requestAnimationFrame = navigator.webkitRequestAnimationFrame || navigator.mozRequestAnimationFrame;

    if (!navigator.mediaDevices && !navigator.mediaDevices.getUserMedia) {
      navigator.userMedia = navigator.mozGetUserMedia || navigator.getUserMedia
      if (!navigator.userMedia) {
        return new Promise((resolve, reject) => {
          reject("Please Update or Use Different Browser");
        })
      }
      return new Promise((resolve, reject) => {
        navigator.getUserMedia(userMediaParams, function (stream) {
          resolve(stream);
        }, function (error) {
          reject(error);
        });
      });
    }
    return navigator.mediaDevices.getUserMedia(userMediaParams);
  }
  const initVideo = (contraints) => {
    if (window.stream) {
      window.stream.getTracks().forEach(track => {
        track.stop();
      });
    }
    if (!navigator.getUserMedia)
      navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    if (!navigator.cancelAnimationFrame)
      navigator.cancelAnimationFrame = navigator.webkitCancelAnimationFrame || navigator.mozCancelAnimationFrame;
    if (!navigator.requestAnimationFrame)
      navigator.requestAnimationFrame = navigator.webkitRequestAnimationFrame || navigator.mozRequestAnimationFrame;

    if (!navigator.mediaDevices && !navigator.mediaDevices.getUserMedia) {
      navigator.userMedia = navigator.mozGetUserMedia || navigator.getUserMedia
      if (!navigator.userMedia) {
        return new Promise((resolve, reject) => {
          reject("Please Update or Use Different Browser");
        })
      }
      return navigator.getUserMedia(contraints);
    }
    return navigator.mediaDevices.getUserMedia(contraints);
  }
  const recorder = function (source, cfg) {
    var config = cfg || {};
    var bufferLen = config.bufferLen || 4096;
    this.context = source.context;
    if (!this.context.createScriptProcessor) {
      this.node = this.context.createJavaScriptNode(bufferLen, 2, 2);
    } else {
      this.node = this.context.createScriptProcessor(bufferLen, 2, 2);
    }
    var worker = cfg.worker;
    worker.postMessage({
      command: 'init',
      config: {
        sampleRate: this.context.sampleRate
      }
    });
    var recording = false,
      currCallback;

    this.node.onaudioprocess = function (e) {
      if (!recording) return;
      worker.postMessage({
        command: 'record',
        buffer: [
          e.inputBuffer.getChannelData(0),
          e.inputBuffer.getChannelData(1)
        ]
      });
    }
    this.configure = function (cfg) {
      for (var prop in cfg) {
        if (cfg.hasOwnProperty(prop)) {
          config[prop] = cfg[prop];
        }
      }
    }
    this.record = function () {
      recording = true;
    }
    this.stop = function () {
      recording = false;
    }
    this.clear = function () {
      worker.postMessage({command: 'clear'});
    }
    this.getBuffers = function (cb) {
      currCallback = cb || config.callback;
      worker.postMessage({command: 'getBuffers'})
    }
    this.exportWAV = function (cb, type) {
      currCallback = cb || config.callback;
      type = type || config.type || 'audio/wav';
      if (!currCallback) throw new Error('Callback not set');
      worker.postMessage({
        command: 'exportWAV',
        type: type
      });
    }
    this.exportMonoWAV = function (cb, type) {
      currCallback = cb || config.callback;
      type = type || config.type || 'audio/wav';
      if (!currCallback) throw new Error('Callback not set');
      worker.postMessage({
        command: 'exportMonoWAV',
        type: type
      });
    }
    worker.onmessage = function (e) {
      var blob = e.data;
      currCallback(blob);
    }
    source.connect(this.node);
    this.node.connect(this.context.destination);   // if the script node is not connected to an output the "onaudioprocess" event is not triggered in chrome.
  };
  const clearAudioVideoStreams = () => {
    if (window.stream) {
      window.stream.getTracks().forEach(track => {
        track.stop();
      });
    }
  }

  const checkMicCamPermissions = function () {
    if (!navigator.getUserMedia)
      navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    if (!navigator.cancelAnimationFrame)
      navigator.cancelAnimationFrame = navigator.webkitCancelAnimationFrame || navigator.mozCancelAnimationFrame;
    if (!navigator.requestAnimationFrame)
      navigator.requestAnimationFrame = navigator.webkitRequestAnimationFrame || navigator.mozRequestAnimationFrame;

    if (!navigator.mediaDevices && !navigator.mediaDevices.getUserMedia) {
      navigator.userMedia = navigator.mozGetUserMedia || navigator.getUserMedia
      if (!navigator.userMedia) {
        return new Promise((resolve, reject) => {
          reject(new DOMException('Unsupported browser', 'unsupported'));
        })
      }
      return navigator.getUserMedia({'video': true, 'audio': true});
    }
    return navigator.mediaDevices.getUserMedia({'video': true, 'audio': true});
  };
  const getUserMedia = function (contraints) {
    if (!navigator.getUserMedia)
      navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    if (!navigator.mediaDevices && !navigator.mediaDevices.getUserMedia) {
      navigator.userMedia = navigator.mozGetUserMedia || navigator.getUserMedia
      if (!navigator.userMedia) {
        return null;
      }
      return navigator.getUserMedia(contraints);
    }
    return navigator.mediaDevices.getUserMedia(contraints);
  }
  const enumerateMediaDevices = function () {
    if (!navigator.mediaDevices) {
      return new Promise((resolve, reject) => {
        reject('Cannot enumerate media Devices');
      });
    }
    return navigator.mediaDevices.enumerateDevices()
      .then(mediaDevices => {
        const videoDevices = [];
        const audioDevices = [];
        mediaDevices.forEach(mediaDevice => {
          if (mediaDevice.kind === 'videoinput') {
            videoDevices.push({
              name: mediaDevice.label,
              id: mediaDevice.deviceId,
              kind: mediaDevice.kind
            })
          }
          if (mediaDevice.kind === 'audioinput') {
            audioDevices.push({
              name: mediaDevice.label,
              id: mediaDevice.deviceId,
              kind: mediaDevice.kind
            })
          }
        })
        return {
          "video": videoDevices,
          "audio": audioDevices
        };
      });
  }
  const peakLevels = function (buffer) {

    const rawData = buffer;
    const samples = 70; // Number of samples we want to have in our final data set
    const blockSize = Math.floor(rawData.length / samples); // the number of samples in each subdivision
    const filteredData = [];
    for (let i = 0; i < samples; i++) {
      let blockStart = blockSize * i; // the location of the first sample in the block
      let sum = 0;
      for (let j = 0; j < blockSize; j++) {
        sum = sum + Math.abs(rawData[blockStart + j]) // find the sum of all the samples in the block
      }
      filteredData.push(sum / blockSize); // divide the sum by the block size to get the average
    }
    return filteredData;
  }
  const normalizeLevels = function (peaks) {
    const multiplier = Math.pow(Math.max(...peaks), -1);
    return peaks.map(n => n * multiplier);
  }

  const htmlDecode = function(input) {
    var doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
  }
  const clean = function (dirty,forceLowerCase) {
    if(forceLowerCase === true) {
      dirty = (dirty+"").toLowerCase();
    }
    return htmlDecode(sanitizeHtml(dirty, {
      allowedTags: [],
      allowedAttributes: {},
      allowedIframeHostnames: false
    })).trim();
  }


  inject('initAudio', initAudio)
  inject('initVideo', initVideo)
  inject('closeStream', clearAudioVideoStreams)
  inject('Recorder', recorder);
  inject('checkPermissions', checkMicCamPermissions);
  inject('getUserMedia', getUserMedia);
  inject('enumerateMediaDevices', enumerateMediaDevices);
  inject('peakLevels', peakLevels);
  inject('normalizeLevels', normalizeLevels);
  inject('sanitizeInput', clean);
}
