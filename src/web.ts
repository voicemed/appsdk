import {WebPlugin, WebPluginConfig} from '@capacitor/core';

import {
    VoicemedAuthenticateUser, VoiceMedChallenges, VoiceMedFinishChallenge,
    VoiceMedFinishExercise,
    VoicemedPlugin,
    VoiceMedRequest, VoiceMedRequestChallenge,
    VoiceMedRequestExercise
} from './definitions';

export class VoicemedWeb extends WebPlugin implements VoicemedPlugin {
    _stagingUrl = "https://sandbox-api-2.voicemed.io/";
    _prodUrl = "https://api-2.voicemed.io/";
    API_authenticationSuffix = "v2/auth/login";
    API_listProgramsSuffix = "v2/user/programs";
    appKey = "";
    environment = "";
    appUrl = "";
    currentUrl = "";
    fakePreferenceStorage: {} = {};

    constructor(config?: WebPluginConfig) {
        super(config);
        window.console.log('config', config);
        // @ts-ignore
        if (config && typeof config["VoicemedPlugin"] !== 'undefined') {
            // @ts-ignore
            if (typeof config["VoicemedPlugin"]['appKey'] !== 'undefined') {
                // @ts-ignore
                this.appKey = config["VoicemedPlugin"]['appKey']
            } else {
                //Test Key:
                this.appKey = "ac7dde4e-01e4-44ca-ba29-dedda5ee52eb"
            }
            // @ts-ignore
            if (typeof config["VoicemedPlugin"]['environment'] !== 'undefined') {
                // @ts-ignore
                this.environment = config["VoicemedPlugin"]['environment']
            } else {
                //Test Env:
                this.environment = "staging"
            }
        }
        if (typeof this.appKey === 'undefined') {
            this.appKey = "";
        }
        if (this.appKey.length <= 0) {
            this.appKey = "ac7dde4e-01e4-44ca-ba29-dedda5ee52eb"
        }
        if (this.environment == 'production') {
            this.appUrl = this._prodUrl;
        } else {
            this.appUrl = this._stagingUrl;
        }
        window.console.log('Voicemed inited');
    }
    getEnvironment(options: { value: string }): Promise<{ environment: string }> {
        window.console.log('res', options);
        return Promise.resolve({
            environment: this.environment
        });
    }

    setEnvironment(options: { environment: string }): Promise<{ value: string }> {
        window.console.log('res', options);
        if(options.environment !='staging' && options.environment !='production' ) {
            return Promise.reject("Available environment are staging and production");
        }
        this.environment = options.environment;
        if (this.environment == 'production') {
            this.appUrl = this._prodUrl;
        } else {
            this.appUrl = this._stagingUrl;
        }
        return Promise.resolve({
            value: "ok"
        });
    }
    setApiKey(options: { apikey: string }): Promise<{ value: string }> {
        window.console.log('res', options);
        this.appKey = options.apikey;
        return Promise.resolve({
            value: "ok"
        });
    }

    startExercise(options: VoiceMedRequestExercise): Promise<{ value: string; }> {
        window.console.log('res', options);
        return Promise.resolve({
            value: "ok"
        });
    }

    startChallenge(options: VoiceMedRequestChallenge): Promise<{ value: string; }> {
        window.console.log('res', options);
        //Request challenge status
        return Promise.resolve({
            value: "ok"
        });
    }

    finishExercise(options: VoiceMedFinishExercise): Promise<{ value: string }> {
        window.console.log('res', options);
        return Promise.resolve({
            value: "ok"
        });
    }

    finishChallenge(options: VoiceMedFinishChallenge): Promise<{ value: string }> {
        window.console.log('res', options);
        return Promise.resolve({
            value: "ok"
        });
    }

    closeExercise(): Promise<{ value: string }> {

        return Promise.resolve({
            value: "closed"
        });
    }

    closeChallenge(): Promise<{ value: string }> {
        return Promise.resolve({
            value: "closed"
        });
    }

    authenticateUser(options: VoicemedAuthenticateUser): Promise<{ token: string; }> {
        let extID = options.externalID;
        let _meta = options.usermeta;
        let _email = options.email;
        if (typeof extID === 'undefined') {
            return Promise.reject("ExternalID must be filled");
        }
        if (extID.toString().length <= 0) {
            return Promise.reject("ExternalID must be filled");
        }
        if (typeof _meta == 'undefined') {
            _meta = {};
        }
        const finalURL = this.appUrl + this.API_authenticationSuffix;
        let fData = new FormData();
        let jData: any = {}
        fData.append("externalId", extID);
        jData.externalId = extID;
        if (_email != null && typeof _email === 'string' ) {
            fData.append("email", _email);
            jData.email = _email
        }
        if (_meta != null && typeof _meta === 'object' && Object.keys(_meta).length > 0) {
            fData.append("meta", JSON.stringify(_meta));
            jData.meta = _meta
        }
        if (_email != null && typeof _email === 'string' ) {
            fData.append("email", _email);
            jData.email = _email
        }
        const headers = {
            "api-key": this.appKey,
            "Content-Type": "application/json"
        };
        return fetch(finalURL, {
            "method": 'POST',
            "headers": headers,
            "body": JSON.stringify(jData)
        }).then((r) => r.json()).then((r) => {
            if (typeof r['access_token'] !== 'undefined') {
                this.preferenceSet({key: 'token', value: r['access_token']});
                let _eventData = {};
                // @ts-ignore
                _eventData['currentToken'] = r['access_token'];
                // @ts-ignore
                _eventData['id'] = extID;
                if (_meta != null && typeof _meta === 'object' && Object.keys(_meta).length > 0) {
                    // @ts-ignore
                    _eventData['meta'] = _meta;
                }
                this.preferenceSet({key: 'userdata', value: JSON.stringify(_eventData)});
                this.notifyListeners("airlynUpdateUserData", _eventData);
            }
            return r;
        });
    }

    authenticateByToken(options: VoiceMedRequest): Promise<{ token: string; }> {
        window.console.log('Not implemented', options.token);
        return Promise.resolve({token: ""});
    }

    listExercises(options: VoiceMedRequest): Promise<{ challenges: VoiceMedChallenges[]; }> {
        // let full = options.full;
        let token = options.token;
        if (typeof token === 'undefined') {
            // @ts-ignore
            token = typeof this.fakePreferenceStorage['token'] !== 'undefined' ? this.fakePreferenceStorage['token'] : null;
        }
        if (token == null || (token + "").length <= 0) {
            return Promise.reject("Token must be valid, please ensure you have completed the authenticateUser method");
        }
        const finalURL = this.appUrl + this.API_listProgramsSuffix;
        const headers = {
            "api-key": this.appKey,
            "Authorization": "Bearer " + token
        }
        return fetch(finalURL, {headers: headers})
            .then((r) => r.json())
            .then((challenges) => {
                let _list: any[] = []
                return challenges.reduce((carry: any, challenge: any) => {
                    return carry.then((r: any) => {
                        if (r) {
                            _list.push(r)
                        }
                        let id = typeof challenge['_id'] !== 'undefined' ? challenge._id : "";
                        if (id.length > 0) {
                            return this._getChallenge(id, token);
                        } else {
                            return Promise.resolve(challenge)
                        }
                    });
                }, Promise.resolve(false)).then((fin: any) => {
                    if (fin) {
                        _list.push(fin)
                    }
                    return {"challenges": _list}
                });
            });
    }

    _getChallenge(challengeID: string, token: string) {
        const finalURL = this.appUrl + this.API_listProgramsSuffix + "/" + challengeID;
        return fetch(finalURL, {headers: {"api-key": this.appKey, "Authorization": "Bearer " + token}})
            .then((r) => r.json())
    }


    echo(options: { value: string }): Promise<{ value: string }> {
        window.console.log('ECHO', options);
        return Promise.resolve(options);
    }


    canDeviceVoiceRecord(): Promise<{ value: string }> {
        return Promise.resolve({value: ""});
    }

    checkCameraPerm(): Promise<{ value: string }> {
        return Promise.resolve({value: ""});
    }

    checkMicPerm(): Promise<{ value: string }> {
        return Promise.resolve({value: ""});
    }

    checkWholePermissions(): Promise<{ value: string }> {
        return Promise.resolve({value: ""});
    }

    getCurrentStatus(): Promise<{ value: string }> {
        return Promise.resolve({value: ""});
    }

    hasAudioRecordingPermission(): Promise<{ value: string }> {
        return Promise.resolve({value: ""});
    }

    maxVolume(): Promise<{ value: string }> {
        return Promise.resolve({value: ""});
    }

    openPermissionPanel(): Promise<{ value: string }> {
        return Promise.resolve({value: ""});
    }

    pauseRecording(): Promise<{ value: string }> {
        return Promise.resolve({value: ""});
    }

    preferenceClear(): Promise<{ value: string }> {
        this.fakePreferenceStorage = {}
        return Promise.resolve({value: ""});
    }

    preferenceConfigure(options: { group: string }): Promise<{ value: string }> {
        window.console.log('ECHO', options);
        return Promise.resolve({value: ""});
    }

    preferenceGet(options: { key: string }): Promise<{ value: string }> {

        // @ts-ignore
        return Promise.resolve({value: this.fakePreferenceStorage[options.key]});
    }

    preferenceKeys(): Promise<{ value: any }> {
        return Promise.resolve({value: Object.keys(this.fakePreferenceStorage)});
    }

    preferenceMigrate(): Promise<{ value: string }> {
        return Promise.resolve({value: ""});
    }

    preferenceRemove(options: { key: string }): Promise<{ value: string }> {
        window.console.log('ECHO', options);
        // @ts-ignore
        this.fakePreferenceStorage[options.key] = null;
        // @ts-ignore
        delete this.fakePreferenceStorage[options.key];
        return Promise.resolve({value: ""});
    }

    preferenceSet(options: { key: string; value: string }): Promise<{ value: any }> {
        window.console.log('ECHO', options);
        // @ts-ignore
        this.fakePreferenceStorage[options.key] = options.value;
        return Promise.resolve({value: this.fakePreferenceStorage});
    }

    requestAudioRecordingPermission(): Promise<{ value: string }> {
        return Promise.resolve({value: ""});
    }

    requestWholePermissions(): Promise<{ value: string }> {
        return Promise.resolve({value: ""});
    }

    resumeRecording(): Promise<{ value: string }> {
        return Promise.resolve({value: ""});
    }

    revertVolume(): Promise<{ value: string }> {
        return Promise.resolve({value: ""});
    }

    startRecording(options: { useAGC: boolean }): Promise<{ value: string }> {
        window.console.log('ECHO', options);
        return Promise.resolve({value: ""});
    }

    stopRecording(): Promise<{ value: string }> {
        return Promise.resolve({value: ""});
    }



}
