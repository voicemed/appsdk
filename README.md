# voicemed-appsdk

Voicemed sdk features

## Install

```bash
npm install voicemed-appsdk
npx cap sync
```
### Layout Dist
in voicemed-sdk there is the built layout files to be added to your webproject.


### Post Install

Add the voicemed-layoutsdk as resource to your mobile projects.
Example: 
- npm run syncAndroidLayoutToDest --dest=./example/android/app/src/main
- npm run synciOSLayoutToDest --dest=./example/ios/App/App

> remember that built layout files have to be copied each time you will change your public/dist folder.

## Library usage

- Import VoiceMed sdk in your scripts: import { Voicemed} from 'voicemed-appsdk';

### Capacitor Plugins needed by this library

- @capacitor/device
- @capacitor/browser
- @capacitor/keyboard
- @capacitor/dialog (not mandatory but suggested)

### Steps
1. Ensure your logged user is logged in into Voicemed:
    - If you don't have an authentication code:
        - Voicemed.authenticateUser({"expernalID":<your unique id>"usermeta":{<userMeta>}});
        - Retrieve the authentication code and store it for the future.
    
2. List Available exercises:
  ```Voicemed.listExercises();```
3. Start Exercise:
  ```Voicemed.startExercise({exercise:exerciseObject});```

4. Close Exercise runner panel:
  ```Voicemed.closeExercise();```

If you want to listen for exercise execution result declare the following listener
- Listen for Exercise Finish and results: 
  ```
  Voicemed.addListener('finishedExercise', (info) => {
    console.log('got exercise end', info);
    //Your code, info.reason, info.result
  });
  ``` 

#### Tips
- if you want to close (force close) the exercise runner call the ```Voicemed.closeExercise();``` function.
- The exercise will be automatically closed when the user taps: 
  - Close 
  - Done
- *Before starting and exercise* request All write|read|record_audio permission with your layout and explainations.

## Exercise results:

Exercise Reason possible values: 
- "not supported"		> cam or mic not available
- "denied"			> cam or mic permissions not granted
- "user-cancelled"	> user cancelled exercise execution (quit)
- "exercise-notrecognized"	>	exercise kind not supported
- "exercise-load-fail"	>	cannot load exercise from voicemed server or not found
- "exercise-audio-fail"	>	cannot load audio track from voicemed server
- "exercise-video-fail"	>	cannot load audio track from voicemed server
- "exercise-finish-fail"	>	cannot store exercise results on voicemed server
- "exercise-completed"	>	normal completed status (result will be filled with exercise results)

## Android & iOS Tips:

### iOS

Remember to add in your plist ns<>Usage Description like these:
```
    <key>LSSupportsOpeningDocumentsInPlace</key>
	<true/>
	<key>NSMicrophoneUsageDescription</key>
	<string>AirLyn requires access to your microphone to record your breath exercises</string>
	<key>NSPhotoLibraryAddUsageDescription</key>
	<string>AirLyn requires access your photolibrary to allow Avatar change feature</string>
	<key>NSPhotoLibraryUsageDescription</key>
	<string>AirLyn requires access to your photo to attach pictures during the breath exercises</string>
	<key>UIFileSharingEnabled</key>
	<true/>
```

### Android 
Remember to add in your manifest the proper permissions: 
```
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.ACCESS_DOWNLOAD_MANAGER" />
<uses-permission android:name="android.permission.RECORD_AUDIO" />
<uses-permission android:name="com.google.android.gms.permission.AD_ID" />

```

