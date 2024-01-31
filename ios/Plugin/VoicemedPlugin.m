#import <Foundation/Foundation.h>
#import <Capacitor/Capacitor.h>

// Define the plugin using the CAP_PLUGIN Macro, and
// each method the plugin supports using the CAP_PLUGIN_METHOD macro.
CAP_PLUGIN(VoicemedPlugin, "Voicemed",
            CAP_PLUGIN_METHOD(requestWholePermissions, CAPPluginReturnPromise);
            CAP_PLUGIN_METHOD(checkWholePermissions, CAPPluginReturnPromise);
            CAP_PLUGIN_METHOD(checkMicPerm, CAPPluginReturnPromise);
            CAP_PLUGIN_METHOD(canDeviceVoiceRecord, CAPPluginReturnPromise);
            CAP_PLUGIN_METHOD(requestAudioRecordingPermission, CAPPluginReturnPromise);
            CAP_PLUGIN_METHOD(hasAudioRecordingPermission, CAPPluginReturnPromise);
            CAP_PLUGIN_METHOD(startRecording, CAPPluginReturnPromise);
            CAP_PLUGIN_METHOD(stopRecording, CAPPluginReturnPromise);
            CAP_PLUGIN_METHOD(pauseRecording, CAPPluginReturnPromise);
            CAP_PLUGIN_METHOD(resumeRecording, CAPPluginReturnPromise);
            CAP_PLUGIN_METHOD(getCurrentStatus, CAPPluginReturnPromise);
            CAP_PLUGIN_METHOD(openPermissionPanel, CAPPluginReturnPromise);
            CAP_PLUGIN_METHOD(maxVolume, CAPPluginReturnPromise);
            CAP_PLUGIN_METHOD(revertVolume, CAPPluginReturnPromise);
            CAP_PLUGIN_METHOD(preferenceConfigure, CAPPluginReturnPromise);
            CAP_PLUGIN_METHOD(preferenceGet, CAPPluginReturnPromise);
            CAP_PLUGIN_METHOD(preferenceSet, CAPPluginReturnPromise);
            CAP_PLUGIN_METHOD(preferenceRemove, CAPPluginReturnPromise);
            CAP_PLUGIN_METHOD(preferenceKeys, CAPPluginReturnPromise);
            CAP_PLUGIN_METHOD(preferenceClear, CAPPluginReturnPromise);
            CAP_PLUGIN_METHOD(preferenceMigrate, CAPPluginReturnPromise);

            CAP_PLUGIN_METHOD(authenticateUser, CAPPluginReturnPromise);
            CAP_PLUGIN_METHOD(authenticateByToken, CAPPluginReturnPromise);
            CAP_PLUGIN_METHOD(listExercises, CAPPluginReturnPromise);
            CAP_PLUGIN_METHOD(startExercise, CAPPluginReturnPromise);
           
            CAP_PLUGIN_METHOD(echo, CAPPluginReturnPromise);
)
