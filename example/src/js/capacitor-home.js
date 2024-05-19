import {SplashScreen} from '@capacitor/splash-screen';
import {Camera} from '@capacitor/camera';
import {Voicemed} from 'voicemed-appsdk';

window.customElements.define(
    'capacitor-home',
    class extends HTMLElement {
        constructor() {
            super();

            const _environment = 'staging';
            this.environment = _environment;

            SplashScreen.hide();
            console.log('test me', Voicemed.echo({'value': 'Dummy method'}).then((r) => {
                console.log('got somethng', r)
            }));

            const root = this.attachShadow({mode: 'open'});
            root.innerHTML = `
    <style>
      :host {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        display: block;
        width: 100%;
        height: 100%;
      }
      .introLogo {
        max-width: 30vw;
        margin:51px auto 0px auto;
      }
      .introMessage {
        text-align: center;
        font-size:30px;
        color:#333333;
        margin-bottom: 51px;
      }
      main {
        text-align: center;
        position: relative;
        height: calc(100vh - 30px);
      }
      .footerActions {
        position: absolute;
        bottom:56px;
        left:40px;
        right:40px;
      }
      .footerActions p {
        font-weight: bold;
        font-size: 16px;
        color:#333;
      }
      .footerActions input {
        width:calc(100% - 6px);
        border:1px solid #CCCCCC;
        color:#333;
        font-size: 16px;
        height: 51px;
        border-radius: 5px;
        
      }
      .footerActions button {
        margin-top:10px;
        width:100%;
        color:#FFF;
        font-size: 20px;
        font-weight: bold;
        height: 51px;
        background-color: #FF1353;
        border-radius: 5px;
      }
      
      h1, h2, h3, h4, h5 {
        text-transform: uppercase;
      }
      .activateChallenge {
        display: inline-block;
        padding:4px 8px;
        border:1px solid #3d3d3d;
        color:#3d3d3d;
        border-radius: 4px;
        box-shadow: 2px 2px 0px #000000;        
      }
      .button {
        display: inline-block;
        padding: 10px;
        background-color: #73B5F6;
        color: #fff;
        font-size: 0.9em;
        border: 0;
        border-radius: 3px;
        text-decoration: none;
        cursor: pointer;
      }
      main {
        padding: 15px;
      }
      main hr { height: 1px; background-color: #eee; border: 0; }
      main h1 {
        font-size: 1.4em;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
      main h2 {
        font-size: 1.1em;
      }
      main h3 {
        font-size: 0.9em;
      }
      main p {
        color: #333;
      }
      main pre {
        white-space: pre-line;
      }
      #exerciseList li {
        padding: 12px 0px;
        font-size: 18px;
      }
      .environment_change .button {
        background-color: #a3a3a3;
        color: #333;
        transition: color linear 300ms, background-color linear 300ms;
      }
      .environment_change .button:first-child {
        border-top-right-radius: 0px;
        border-bottom-right-radius: 0px;
      }
      .environment_change .button:last-child {
        border-top-left-radius: 0px;
        border-bottom-left-radius: 0px;
      }
      .environment_change .button.active {
        background-color: #73B5F6;
        color: #fff;
      }
    </style>
    <div>
      <main>
        <img src="assets/imgs/logo_voicemed.png" class="introLogo">
        <p class="introMessage">
          <b>Health</b> check<br/>
          in your <b>pocket</b>
        </p>
        <div class="footerActions">
            <p>Please, insert the code</p>
            <input type="text" id="apiCode">
            <button class="button" id="take-start">Start</button>
        </div>
      </main>
    </div>
    `;
        }

        requestPermissions() {
            return Voicemed.checkMicPerm().then((r) => {
                console.log("Permission request finished", r);
                alert('Permission request was completed');
            }).catch((e) => {
                console.error('Cannot request permissionis', e);
                alert('Cannot request permissions');
            });
        }

        requestUser() {
            try {
                let randomUser = Math.floor(Math.random() * (2000 - 100 + 1) + 100);
                const _randomUserString = "yh-test" + randomUser + "-sdk";
                return Voicemed.authenticateUser({
                    externalID: _randomUserString,
                    email: randomUser + '@sample.com'
                }).then((user) => {
                    console.log('got user data:', user);
                    if (user && user.access_token) {
                        window.currentToken = user.access_token;
                        alert('User authenticated!');
                    } else {
                        alert('cannot login');
                    }
                }).catch((e) => {

                });
            } catch (e) {
                console.warn('User cancelled', e);
                alert('login error');
                return Promise.reject('nouser')
            }
        }

        requestChallenges() {
            try {
                let token = {}
                if (typeof window["currentToken"] !== 'undefined') {
                    token.token = window["currentToken"];
                }
                return Voicemed.listExercises(token).then((r) => {
                    return r
                }).catch((e) => {
                    console.error('cannot get exercises', e);
                    alert('cannot retrieve exercises')
                })
            } catch (e) {
                console.warn('Error', e);
                return Promise.reject('no list')
            }
        }

        connectedCallback() {
            const self = this;

            Voicemed.setEnvironment({"environment": self.environment}).then((e) => {
                console.log('new environment set')
            }).catch(() => {

            });
            //Register completed exercise listener
            Voicemed.addListener('finishedExercise', (info) => {
                console.log('got exercise end', info);
            });
            self.shadowRoot.querySelector('#take-start').addEventListener('click', async function (e) {
                const _apiKey = self.shadowRoot.querySelector('#apiCode').value;
                console.log(_apiKey, self.shadowRoot.querySelector('#apiCode'))
                if (_apiKey === null || (_apiKey + "").length < 4) {
                    alert('Api code not valid');
                    return;
                }
                Voicemed.setApiKey({"apikey": _apiKey}).then((e) => {
                    console.log('new apiKey set');
                }).then((r)=>{
                    return self.requestPermissions()
                }).then((r)=>{
                    return self.requestUser()
                }).then((r)=>{
                    return self.requestChallenges()
                }).then((r)=>{
                    console.log('got challenges?', r)
                    if(r && r.challenges) {
                        const _firstChallenge = r.challenges[0];
                        return Voicemed.startChallenge({
                            program_id: _firstChallenge._id
                        }).then((result) => {
                            console.log('got result:', result);
                        });
                    } else {
                        alert('Cannot retrieve Challenges');
                    }
                }).catch(() => {
                    alert('Unable activate api key or no challenges found');
                });
            });
        }
    }
);

window.customElements.define(
    'capacitor-welcome-titlebar',
    class extends HTMLElement {
        constructor() {
            super();
            const root = this.attachShadow({mode: 'open'});
            root.innerHTML = `
    <style>
      :host {
        position: relative;
        display: block;
        padding: 15px 15px 15px 15px;
        text-align: center;
        background-color: #73B5F6;
      }
      ::slotted(h1) {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        font-size: 0.9em;
        font-weight: 600;
        color: #fff;
      }
    </style>
    <slot></slot>
    `;
        }
    }
);
