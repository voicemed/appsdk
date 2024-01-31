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
        - Voicemed.authenticateUser({"expernalID":<your unique id>,"email":<optional unique email>,"
          usermeta":{<userMeta>}});
        - Retrieve the authentication code and store it for the future.
    - If you have an authentication code:
        - Voicemed.authenticateByToken({"token":<your authcode>});
- List Available exercises:
  - Voicemed.listExercises();
- Start Exercise:
  - Voicemed.startExercise({exercise:exerciseObject});
