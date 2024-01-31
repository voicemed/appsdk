import {Capacitor, registerPlugin} from '@capacitor/core';
import {Sha256} from '@aws-crypto/sha256-browser';
const AirLynPlugin = registerPlugin('AirLyn');


export default (context, inject) => {
    const getPlatorm = function () {
        if (Capacitor) {
            return Capacitor.getPlatform();
        }
        return null
    }
    const keepAwake = async () => {
        await KeepAwake.keepAwake();
    };
    const allowSleep = async () => {
        await KeepAwake.allowSleep();
    };
    const isSupported = async () => {
        const result = await KeepAwake.isSupported();
        return result.isSupported;
    };


    const writePublicBlob = async (data, fileName) => {
        const reader = new FileReader();
        let success = false;
        reader.onloadend = async function () {
            const base64data = reader.result;
            const directory = $nuxt.$capacitor.getPlatform() === 'ios' ? Directory.External : Directory.Documents;
            try {
                const result = await Filesystem.writeFile({
                    path: fileName,
                    data: base64data,
                    directory: directory,
                    recursive: true
                });
                success = true;
                console.log('opening result', result, success)
            } catch (e) {
                console.error('Unable to write file', e);
                success = false;
            }
        }
        reader.readAsDataURL(data);
        return success;
    };
    const writePublicAndShareFile = async (data, fileName) => {
        const reader = new FileReader();
        reader.readAsDataURL(data);
        let success = false;
        reader.onloadend = async function () {
            const base64data = reader.result;
            const directory = $nuxt.$capacitor.getPlatform() === 'ios' ? Directory.External : Directory.Documents;
            try {
                const result = await Filesystem.writeFile({
                    path: fileName,
                    data: base64data,
                    directory: directory,
                    recursive: true
                });
                let res = Share.share({
                    title: $nuxt.$t('sharefiledialog.title'),
                    text: $nuxt.$t('sharefiledialog.message', {"recording": fileName}),
                    url: result.uri,
                    dialogTitle: $nuxt.$t('sharefiledialog.dialogtitle')
                });
                console.log('opening result', res)
            } catch (e) {
                console.error('Unable to write file', e);
                success = false;
            }
        }
        return success
    };
    const writePublicAndOpenFile = async (data, fileName) => {
        const reader = new FileReader();
        reader.readAsDataURL(data);
        let success = false;
        reader.onloadend = async function () {
            const base64data = reader.result;
            const directory = $nuxt.$capacitor.getPlatform() === 'ios' ? Directory.External : Directory.Documents;
            try {
                const result = await Filesystem.writeFile({
                    path: fileName,
                    data: base64data,
                    directory: directory,
                    recursive: true
                });
                let res = await FileOpener.open({
                    filePath: result.uri,
                    type: data.type,
                    openWithDefault: true
                });
                console.log('opening result', res)
            } catch (e) {
                console.error('Unable to write file', e);
                success = false;
            }
        }
        return success
    };
    const writeAndOpenFile = async (data, fileName) => {
        const reader = new FileReader();
        reader.readAsDataURL(data);
        let success = false;
        reader.onloadend = async function () {
            const base64data = reader.result;
            const directory = $nuxt.$capacitor.getPlatform() === 'ios' ? Directory.External : Directory.Documents;
            try {
                const result = await Filesystem.writeFile({
                    path: fileName,
                    data: base64data,
                    directory: directory,
                    recursive: true
                });
                let res = await FileOpener.open({
                    filePath: result.uri,
                    type: data.type,
                    openWithDefault: true
                });
                console.log('opening result', res)
            } catch (e) {
                console.error('Unable to write file', e);
                success = false;
            }
        }
        return success
    };


    const b64toBlob = (b64Data, contentType = '', sliceSize = 512) => {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        const blob = new Blob(byteArrays, {type: contentType});
        return blob;
    }
    const backManager = {
        callback: function () {
        },
        fireEvent: function () {
            console.log('someone click Back', arguments)
            if (typeof $nuxt.$backEmitter.callback === 'function') {
                $nuxt.$backEmitter.callback();
            }
        }
    }

    const socialLoginManager = {
        fbInited: false,
        googleInited: false,
        appleInited: true,
        initGoogleSignin: function () {
            if (socialLoginManager.googleInited === false) {
                return GoogleAuth.initialize(GoogleSigninOptions).then(() => {
                    socialLoginManager.googleInited = true;
                });
            }
            return Promise.resolve()
        },
        initFacebookSignin: function () {
            if (socialLoginManager.fbInited === false) {
                return FacebookLogin.initialize(FbSigninOptions).then((res) => {
                    console.log('fbLogin inited', res);
                    socialLoginManager.fbInited = true;
                })
            }
            return Promise.resolve();
        },
        logoutFromGoogle: function () {
            return socialLoginManager.initGoogleSignin().then(() => {
                return GoogleAuth.signOut().then((r) => {
                    console.log('logged out from google:', r)
                }).catch((e) => {
                    console.log('cannot log out from google', e)
                })
            });
        },
        requestSignin: function (provider) {
            //alert('Richiesto social signin con '+ provider)
            if (provider === 'google') {
                if (socialLoginManager.googleInited === false) {
                    //alert('Errore google non è inizializzato, esco')
                    return Promise.reject("init google first")
                }
                return GoogleAuth.signIn()
                    .then((r) => {
                        //alert('Google Response: ' + JSON.stringify(r));
                        if (r && r.authentication && r.authentication.idToken) {
                            return r.authentication.idToken
                        } else {
                            //alert('Errore no idToken',JSON.stringify(r))
                            return false;
                        }
                    }).catch((error) => {
                        //alert('Google Response ERROR: ' + error);
                        console.error("cannot login with google", error)
                    })
            }
            if (provider === 'meta') {
                if (socialLoginManager.fbInited === false) {
                    return Promise.reject("init meta first")
                }
                return FacebookLogin.login({permissions: FACEBOOK_PERMISSIONS})
                    .then((r) => {
                        console.log('received something from facebook', r);
                        console.log(JSON.stringify(r))
                        return r
                    })
                    .catch((error) => {
                        console.error("Cannot login with meta:", error);
                    })
            }
            if (provider === 'apple') {
                //scope:
                const nonce = 'nonce';
                const hash = new Sha256();
                hash.update(nonce);
                return hash.digest().then((digest) => {
                    const hashArray = Array.from(new Uint8Array(digest));
                    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
                    const _myOptions = AppleSigninOptions;
                    _myOptions.nonce = hashHex;
                    return SignInWithApple.authorize(_myOptions)
                        .then((r) => {
                            if (r && r.response) {
                                return r.response
                            }
                            return r;
                        })
                        .catch((error) => {
                            console.error("cannot login with apple", error)
                        });
                })
            }
        }
    }

    const analytics = {
        inited: false,
        init: function () {
            console.log('Init World', $nuxt.$config.env);
            if ($nuxt.$config.env.environment !== 'production') {
                return;
            }
            if (Capacitor && Capacitor.isNativePlatform) {
                console.log('capacitor is ready, init firebase!');
                if (Capacitor.getPlatform() !== 'ios') {
                    FirebaseAnalytics.initializeFirebase($nuxt.$config.env.firebase).catch((e) => {
                        console.error('Cannot initialize Firebase', e);
                    });
                }
                FirebaseAnalytics.setCollectionEnabled({
                    enabled: true
                }).catch((e) => {
                    console.error('Cannot setCollectionEnabled Firebase', e);
                })
                FirebaseAnalytics.setSessionTimeoutDuration({
                    duration: 18000
                }).catch((e) => {
                    console.error('Cannot setSessionTimeoutDuration Firebase', e);
                })
                analytics.inited = true;
            }

        },
        setUserId: function (uid, isguest) {
            if (analytics.inited === false) {
                return
            }
            FirebaseAnalytics.setUserId({
                userId: uid
            });
            FirebaseAnalytics.setUserProperty({
                name: "isguest",
                value: isguest
            });
            FirebaseAnalytics.setCollectionEnabled({
                enabled: true
            });
        },
        setDeviceProperty: function (device) {
            if (analytics.inited === false) {
                return
            }
            FirebaseAnalytics.setUserProperty({
                name: "device",
                value: device
            });
        },
        retrieveInstanceID: function () {
            if (analytics.inited === false) {
                return null
            }
            return FirebaseAnalytics.getAppInstanceId();
        },
        reset: function () {
            if (analytics.inited === false) {
                return
            }
            FirebaseAnalytics.reset();
        },
        setScreenName: function (name, override) {
            return analytics.logScreen(name, override);
        },
        logScreen: function (name, override) {
            if (analytics.inited === false) {
                return
            }
            FirebaseAnalytics.setScreenName({
                screenName: name,
                nameOverride: override || name
            });
        },
        logFbEvent: function (name, params) {
            if ($nuxt.$airlyn) {
                $nuxt.$airlyn.fbTrackEvent({"event": name, "parameters": params});
            }
        },
        logEvent: function (name, params) {
            analytics.logFbEvent(name, params)
            if (analytics.inited === false) {
                return
            }
            FirebaseAnalytics.logEvent({
                name: name,
                params: params
            });

        }


    }

    const clarityHelper = {
        LogLevel: function (LogLevel) {
            LogLevel["Verbose"] = "Verbose";
            LogLevel["Debug"] = "Debug";
            LogLevel["Info"] = "Info";
            LogLevel["Warning"] = "Warning";
            LogLevel["Error"] = "Error";
            LogLevel["None"] = "None";
            return LogLevel;
        }({}),
        init(projectID, environment) {
            if ($nuxt.$capacitor && $nuxt.$capacitor.isNativePlatform()) {
                if ($nuxt.$capacitor.getPlatform() === 'ios') {
                    return Promise.resolve();
                }

                if (typeof projectID !== "string") {
                    throw Error("Invalid Clarity initialization arguments. Please check the docs for assitance.");
                }

                let config = {
                    projectID: projectID,
                    isIonic: true,
                    userId: null,
                    logLevel: clarityHelper.LogLevel.None,
                    allowMeteredNetworkUsage: false,
                    allowedDomains: ["*"],
                    disableOnLowEndDevices: false
                };
                //[projectId, userId, logLevel, allowMeteredNetworkUsage, allowedDomains, disableOnLowEndDevices, isIonic]
                return AirLynPlugin.clarityInizialize(config);

            }
            return Promise.resolve();
        },
        getCurrentSessionUrl: function () {
            if ($nuxt.$capacitor && $nuxt.$capacitor.isNativePlatform()) {
                if ($nuxt.$capacitor.getPlatform() === 'ios') {
                    return Promise.resolve();
                }
                return AirLynPlugin.clarityGetCurrentSessionUrl();
            }
            return Promise.resolve();
        },
        getCurrentSessionId: function () {
            if ($nuxt.$capacitor && $nuxt.$capacitor.isNativePlatform()) {
                if ($nuxt.$capacitor.getPlatform() === 'ios') {
                    return Promise.resolve();
                }
                return AirLynPlugin.clarityGetCurrentSessionId();
            }
            return Promise.resolve();
        },
        setCustomTag: function (key, value) {
            if ($nuxt.$capacitor && $nuxt.$capacitor.isNativePlatform()) {
                if ($nuxt.$capacitor.getPlatform() === 'ios') {
                    return Promise.resolve();
                }
                return AirLynPlugin.claritySetCustomTag({key: key, value: value});
            }
            return Promise.resolve();

        },
        setCustomSessionId: function (customSessionId) {
            if ($nuxt.$capacitor && $nuxt.$capacitor.isNativePlatform()) {
                if ($nuxt.$capacitor.getPlatform() === 'ios') {
                    return Promise.resolve();
                }
                return AirLynPlugin.claritySetCustomSessionId({sessionid: customSessionId});
            }
            return Promise.resolve();
        },
        setCustomUserId: function (customUserId) {
            if ($nuxt.$capacitor && $nuxt.$capacitor.isNativePlatform()) {
                if ($nuxt.$capacitor.getPlatform() === 'ios') {
                    return Promise.resolve();
                }
                return AirLynPlugin.claritySetCustomUserId({userid: customUserId});
            }
            return Promise.resolve();
        }
    }

    inject('browser', Browser)
    inject('capacitor', Capacitor)
    inject('capacitorDevice', Device)
    //inject('capacitorEmailComposer', EmailComposer)
    inject('app', App)
    inject('writeAndOpenFile', writeAndOpenFile)
    inject('writePublicAndOpenFile', writePublicAndOpenFile)
    inject('writePublicAndShareFile', writePublicAndShareFile)
    inject('writePublicBlob', writePublicBlob)
    inject('keyboard', Keyboard)
    inject('capacitorDialog', Dialog)
    inject('splashscreen', SplashScreen);
    inject('getplatform', getPlatorm)
    inject('airlyn', AirLynPlugin)
    inject('clarity', clarityHelper)
    inject('base64ToBlob', b64toBlob)
    inject('backEmitter', backManager)
    inject('analytics', analytics)
    inject('sociallogin', socialLoginManager)
    App.addListener('appStateChange', ({isActive}) => {
        if (isSupported()) {
            if (isActive) {
                keepAwake()
                //$nuxt.$airlyn.maxVolume().then((r) => {
                //  console.warn("Set Max Volume for device", r);
                //});
            } else {
                allowSleep()
                //$nuxt.$airlyn.revertVolume().then((r) => {
                //  console.warn("revert Volume for device", r);
                //});
                /* logout on back
                try {
                  if(context.store.state.user.isguest) {
                    context.$auth.logout().then((r) => {
                      console.log('need logout is guest...', r);
                      context.store.state.user.isguest = false;
                      context.store.state.user.currentuser = {}
                    }).catch((r) => {
                      console.error('cannot logout', r);
                    })
                  }
                } catch ($ex) {

                }
                 */
            }
        }
    });
    App.getState().then((r) => {
        if (r.isActive) {
            if (isSupported()) {
                keepAwake()
            }
        }
    });
    App.addListener('backButton', backManager.fireEvent);
}
