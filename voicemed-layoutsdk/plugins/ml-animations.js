//const humanizeDuration = require("humanize-duration");

export default (context, inject) => {
  const maxSize = 2.65
  const growingAnimation = {
    "scale": maxSize,
    easing: 'easeOutSine',
  };
  const growingAnimationLoop = {
    "scale": maxSize,
    "direction": 'alternate',
    "loop": true,
  };
  const breathAnimation = {
    "scale": {value: '*=1'},
    "direction": 'alternate',
    "duration": 1000,
    "loop": true,
    easing: 'easeOutSine',
  };
  const pulseAnimation = {
    "scale": [.9, maxSize * 0.8],
    "direction": 'alternate',
    "duration": 3000,
    "loop": true,
    easing: 'easeOutSine',
  };
  const degrowthAnimation = {
    "scale": .9,
    easing: 'linear',
  };
  const timeString = function (seconds) {
    return new Date(seconds * 1000).toISOString().substr(14, 5)
  }
  const humanizeTimeNoSuffix = function (seconds, options) {
    console.log('request', seconds);
    let _secondRound = Math.trunc(parseFloat(seconds)).toFixed(0);
    console.log('request rounded', _secondRound);
    if (_secondRound < 60) {
      return _secondRound;
    }
    _secondRound = Math.round(seconds / 10) * 10;
    const _minutes = Math.floor(_secondRound / 60);
    const _resSeconds = _secondRound - (_minutes * 60);
    if (_resSeconds === 0) {
      return _minutes + ":00";
    }
    return _minutes + ":" + _resSeconds;
    const ms = seconds * 1000;
  }
  const humanizeTime = function (seconds, options) {
    let suffix = $nuxt.$t('generic.unit_seconds_short');
    let _secondRound = Math.round(seconds / 10) * 10;
    if (_secondRound < 60) {
      return _secondRound + " " + suffix;
    } else {
      suffix = $nuxt.$t('generic.unit_minutes_short');
    }
    const _minutes = Math.floor(_secondRound / 60);
    const _resSeconds = _secondRound - (_minutes * 60);
    if (_resSeconds === 0) {
      return _minutes + " " + suffix;
    }
    return _minutes + ":" + _resSeconds + " " + suffix;
    const ms = seconds * 1000;
  }
  inject('animationHelper', {
    "growing": growingAnimation,
    "growingloop": growingAnimationLoop,
    "breathing": breathAnimation,
    "hold": breathAnimation, /*same as breathing*/
    "degrowing": degrowthAnimation,
    "pulse": pulseAnimation,
  });
  inject('timeString', timeString)
  inject('humanizeTime', humanizeTime)
  inject('humanizeTimeNoSuffix', humanizeTimeNoSuffix)
}
