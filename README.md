# voicemed-appsdk

Voicemed sdk features

## Install

```bash
npm install voicemed-appsdk
npx cap sync
```
### Layout Dist
in voicemed-sdk there is the builded vendor layout files to be added to your webproject.


### Post Install

Add the voicemed-layoutsdk as resource to your mobile projects.
Example: 
- npm run syncAndroidLayoutToDest --dest=./example/android/app/src/main
- npm run synciOSLayoutToDest --dest=./example/ios/App/App

## Library usage

- Import VoiceMed sdk in your scripts: import { Voicemed} from 'voicemed-appsdk';

- Ensure your logged user is logged in into Voicemed:
    - If you don't have an authentication code:
        - Voicemed.authenticateUser({"expernalID":<your unique id>"usermeta":{<userMeta>}});
        - Retrieve the authentication code and store it for the future.
    
- List Available exercises:
  ```Voicemed.listExercises();```
- Start Exercise:
  ```Voicemed.startExercise({exercise:exerciseObject});```
- Listen for Exercise Finish and results: 
  ```
  Voicemed.addListener('finishedExercise', (info) => {
    console.log('got exercise end', info);
  });
  ``` 
- Close Exercise runner panel:
  ```Voicemed.closeExercise();```


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
