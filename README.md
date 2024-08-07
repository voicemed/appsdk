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
- @capacitor-community/keep-awake (not mandatory but suggested)
- @capacitor/dialog (not mandatory but suggested)

#### Browser plugin

Although the browser plugin is not mandatory, it is recommended for managing any links present in the challenge texts and exercises. This way, the links will be handled by the device's native browser and can be correctly displayed.

#### Device plugin

The device plugin is recommended to enhance device recognition and thus optimize the experience. Additionally, some information related to the brand and version will be sent to the Voicemed engine to improve the product and the overall experience in the future.

### Steps single exercise
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

### Steps whole challenge
1. Ensure your logged user is logged in into Voicemed:
    - If you don't have an authentication code:
        - Voicemed.authenticateUser({"expernalID":<your unique id>"usermeta":{<userMeta>}});
        - Retrieve the authentication code and store it for the future.

2. List Available challenges:
   ```Voicemed.listChallenges();```
3. Start challenge:
   ```Voicemed.startChallenge({challenge:challengeObject});```

4. Close Exercise/Challenge runner panel:
   ```Voicemed.closeExercise();```

If you want to listen for exercise execution result declare the following listener
- Listen for single Exercise Finish and results:
  ```
  Voicemed.addListener('finishedExercise', (info) => {
    console.log('got exercise end', info);
    //Your code, info.reason, info.result
  });
  ``` 
- Listen for whole Challenge Finish:
  ```
  Voicemed.addListener('finishedChallenge', (info) => {
    console.log('got challenge end', info);
    //Your code, info.reason, info.result
  });
  ``` 

#### Steps User Activities
1. Ensure your logged user is logged in into Voicemed:
    - If you don't have an authentication code:
        - Voicemed.authenticateUser({"expernalID":<your unique id>"usermeta":{<userMeta>}});
        - Retrieve the authentication code and store it for the future.

2. Invoke Voicemed.userActivities(token,date_from,date_to,type,subtype):
    - Token : you need a valid authentication token to complete the request
    - dateFrom : the date range start in format Y-m-d eg. 2024-07-12
    - dateTo : the date range end in format Y-m-d eg. 2024-07-12
    - type : a valid exercise type between: 'recording' | 'audio' | 'video' | 'hold' | 'post' | 'questionnaire' | 'quiz'
    - subtype : valid only for type 'recording', possible values : 'shushing' | 'humming' | 'dob'

#### Steps User Last SevenScores
1. Ensure your logged user is logged in into Voicemed:
    - If you don't have an authentication code:
        - Voicemed.authenticateUser({"expernalID":<your unique id>"usermeta":{<userMeta>}});
        - Retrieve the authentication code and store it for the future.

2. Invoke Voicemed.userLastScores(token,subtype):
    - Token : you need a valid authentication token to complete the request
    - subtype : a valid subtype between : 'shushing' | 'humming' | 'dob'


#### Tips
- if you want to close (force close) the exercise runner call the ```Voicemed.closeExercise();``` function.
- The exercise will be automatically closed when the user taps: 
  - Close 
  - Done
- *Before starting and exercise* request All write|read|record_audio permission with your layout and explainations.
  - If needed you can use the Voicemed.checkMicPerm().then((r)=> { ... }).catch((e)=> { ... });

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

