//import DeviceDetector from "device-detector-js";
import {Device} from '@capacitor/device';

export default (context, inject) => {
  const deviceInfo = {
    currentUUID: null,
    fillUUID: function () {
      if ($nuxt.$capacitor) {
        if ($nuxt.$capacitor.isNativePlatform()) {
          return $nuxt.$capacitorDevice.getId().then((r) => {
            console.log('got uuid', r);
            if (r.uuid) {
              deviceInfo.currentUUID = r.uuid
            }
          });
        } else {
          return new Promise((resolve, reject) => {
            resolve((new Date()).getTime())
          }).then((r) => {
            deviceInfo.currentUUID = r;
          })
        }
      }
    },
    getInfo: async function () {
      //if (context.$capacitor) {
      //  console.log('siamo in piattaforma nativa, verifica device info');
      return new Promise((resolve, reject) => {
        Device.getInfo().then((dev) => {
          let parts = [];
          if (dev) {
            if (dev.name) {
              parts.push(dev.name)
            }
            if (dev.platform) {
              parts.push(dev.platform)
            }
            if (dev.osVersion) {
              parts.push(dev.osVersion)
            }
            if (dev.manufacturer) {
              parts.push(dev.manufacturer)
            }
          }
          resolve(parts.join(" "));
        }).catch((e) => {
          console.error("Cannot retrieve device info", e)
          reject(e)
        })
      })
      //}
      /*
      return new Promise((resolve, reject) => {
        const deviceDetector = new DeviceDetector();
        const result = deviceDetector.parse(navigator.userAgent);
        let parts = [];
        if (result) {
          if (result.os && result.os.name) {
            parts.push(result.os.name)
          }
          if (result.os && result.os.version) {
            parts.push(result.os.version)
          }
          if (result.device && result.device.type) {
            parts.push(result.device.type)
          }
          if (result.device && result.device.brand) {
            parts.push(result.device.brand)
          }
          if (result.device && result.device.model) {
            parts.push(result.device.model)
          }
          resolve(parts.join(" "));
        } else {
          resolve(navigator.userAgent);
        }
      });
      */
    },
    getInfoObject: async function () {
      //if (context.$capacitor) {
      //  console.log('siamo in piattaforma nativa, verifica device info');
      return new Promise((resolve, reject) => {
        Device.getInfo().then((dev) => {
          let parts = {};
          if (dev) {
            Object.keys(dev).forEach((k)=>{
              parts[k] = dev[k];
            })
            if (dev.name) {
              parts['name'] = dev.name;
            }
            if (dev.platform) {
              parts['platform'] = dev.platform;
            }
            if (dev.osVersion) {
              parts['osVersion'] = (dev.osVersion);
            }
            if (dev.manufacturer) {
              parts['manufacturer'] = (dev.manufacturer)
            }
          }
          resolve(parts);
        }).catch((e) => {
          console.error("Cannot retrieve device info", e)
          reject(e)
        })
      })
      //}
      /*
      return new Promise((resolve, reject) => {
        const deviceDetector = new DeviceDetector();
        const result = deviceDetector.parse(navigator.userAgent);
        let parts = [];
        if (result) {
          if (result.os && result.os.name) {
            parts.push(result.os.name)
          }
          if (result.os && result.os.version) {
            parts.push(result.os.version)
          }
          if (result.device && result.device.type) {
            parts.push(result.device.type)
          }
          if (result.device && result.device.brand) {
            parts.push(result.device.brand)
          }
          if (result.device && result.device.model) {
            parts.push(result.device.model)
          }
          resolve(parts.join(" "));
        } else {
          resolve(navigator.userAgent);
        }
      });
      */
    }
  }
  inject('deviceInfo', deviceInfo)
};
