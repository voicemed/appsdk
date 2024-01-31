import {WebPlugin} from '@capacitor/core';

import {VoicemedAuthenticateUser, VoiceMedExercise, VoicemedPlugin} from './definitions';
import * as console from "console";

export class VoicemedWeb extends WebPlugin implements VoicemedPlugin {
    startExercise(options: VoiceMedExercise): Promise<{ value: string; }> {
        window.console.log('res', options);
        return Promise.resolve({
            value: "ok"
        });
    }

    authenticateUser(options: VoicemedAuthenticateUser): Promise<{ token: string; }> {
        window.console.log('User', options);
        return Promise.resolve({token: ""});
    }

    authenticateByToken(options: { token: string; }): Promise<{ token: string; }> {
        window.console.log('token', options.token);
        return Promise.resolve({token: ""});
    }

    listExercises(): Promise<{ exercises: VoiceMedExercise[]; }> {
        return Promise.resolve({
            exercises: []
        });

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
        return Promise.resolve({value: ""});
    }

    preferenceConfigure(options: { group: string }): Promise<{ value: string }> {
        console.log('ECHO', options);
        return Promise.resolve({value: ""});
    }

    preferenceGet(options: { key: string }): Promise<{ value: string }> {
        console.log('ECHO', options);
        return Promise.resolve({value: ""});
    }

    preferenceKeys(): Promise<{ value: string }> {
        return Promise.resolve({value: ""});
    }

    preferenceMigrate(): Promise<{ value: string }> {
        return Promise.resolve({value: ""});
    }

    preferenceRemove(options: { key: string }): Promise<{ value: string }> {
        console.log('ECHO', options);
        return Promise.resolve({value: ""});
    }

    preferenceSet(options: { key: string; value: string }): Promise<{ value: string }> {
        console.log('ECHO', options);
        return Promise.resolve({value: ""});
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
        console.log('ECHO', options);
        return Promise.resolve({value: ""});
    }

    stopRecording(): Promise<{ value: string }> {
        return Promise.resolve({value: ""});
    }
}
