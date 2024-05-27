import {SplashScreen} from '@capacitor/splash-screen';
import {Camera} from '@capacitor/camera';
import {Keyboard} from '@capacitor/keyboard';
import {Voicemed} from 'voicemed-appsdk';
import {KeepAwake} from '@capacitor-community/keep-awake';
import {App} from '@capacitor/app';
import '../css/style.css'
import logo from '../assets/imgs/logo_voicemed.png'

window.customElements.define(
    'capacitor-home',
    class extends HTMLElement {
        constructor() {
            super();

            const _environment = 'staging';
            this.environment = _environment;


            SplashScreen.hide();
            console.log(logo, 'test me', Voicemed.echo({'value': 'Dummy method'}).then((r) => {
                console.log('got somethng', r)
            }));

            if (navigator && navigator.virtualKeyboard) {
                navigator.virtualKeyboard.addEventListener('geometrychange', (event) => {
                    const {x, y, width, height} = event.target.boundingRect;
                    console.log('Virtual keyboard geometry changed:', x, y, width, height);
                });
            }


            const root = this.attachShadow({mode: 'open'});
            root.innerHTML = `
    <style>
      :host {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        display: block;
        width: 100%;
        height: 100%;
      }
      
      
    .mainApp img.introLogo {
      transition: opacity linear 300ms, height linear 300ms;
      overflow: hidden;
    }
    .mainApp.with-keyboard img.introLogo {
      opacity: 0;
      max-height: 0px;
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
        width:calc(100% - 34px);
        border:1px solid #CCCCCC;
        color:#333;
        font-size: 16px;
        height: 51px;
        border-radius: 5px;
        padding-left:16px;
        padding-right:16px;
        
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
      
      
      
.lds-dual-ring,
.lds-dual-ring:after {
  box-sizing: border-box;
}
.lds-dual-ring {
  display: inline-block;
  width: 30px;
  height: 30px;
}
.lds-dual-ring:after {
  content: " ";
  display: block;
  width: 24px;
  height: 24px;
  margin: 8px;
  border-radius: 50%;
  border: 3.4px solid currentColor;
  border-color: currentColor transparent currentColor transparent;
  animation: lds-dual-ring 1.2s linear infinite;
}
@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

    .hidden {
        display:none;
    }

      
    </style>
    <div>
      <main class="mainApp">
        <img src="{logo}" class="introLogo">
        <p class="introMessage">
          <b>Health</b> check<br/>
          in your <b>pocket</b>
        </p>
        <div class="footerActions">
            <p>Please, insert the code</p>
            <input type="text" id="apiCode">
            <button class="button" id="take-start">
            <span class="text">Start</span>
            <div class="lds-dual-ring hidden"></div>
            </button>
        </div>
      </main>
    </div>
    `.replace('{logo}', logo);

            Keyboard.addListener('keyboardWillShow', info => {
                root.querySelector('.mainApp').classList.add('with-keyboard');
                console.log('keyboard will show with height:', info.keyboardHeight);
            });

            Keyboard.addListener('keyboardWillHide', () => {
                console.log('keyboard will hide');
                root.querySelector('.mainApp').classList.remove('with-keyboard');
            });
        }


        async keepAwakeFeature(){
            await KeepAwake.keepAwake();
        }
        async allowSleep() {
            await KeepAwake.allowSleep();
        };

        async isSupported() {
            const result = await KeepAwake.isSupported();
            return result.isSupported;
        };


        requestPermissions() {
            return Voicemed.checkMicPerm().then((r) => {
                console.log("Permission request finished", r);

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
            App.addListener('appStateChange', ({isActive}) => {
                if (self.isSupported()) {
                    if (isActive) {
                        self.keepAwakeFeature()
                    } else {
                        self.allowSleep()
                    }
                }
                console.log('App loaded (State?')
            });
            App.getState().then((r) => {
                console.log('request app state', r);
                if (r.isActive) {
                    if (self.isSupported()) {
                        self.keepAwakeFeature()
                    }
                }
            });


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
                self.shadowRoot.querySelector('#take-start .text').classList.add('hidden');
                self.shadowRoot.querySelector('#take-start .lds-dual-ring').classList.remove('hidden');

                console.log(_apiKey, self.shadowRoot.querySelector('#apiCode'))
                if (_apiKey === null || (_apiKey + "").length < 4) {
                    alert('Api code not valid');
                    self.shadowRoot.querySelector('#take-start .text').classList.remove('hidden');
                    self.shadowRoot.querySelector('#take-start .lds-dual-ring').classList.add('hidden');
                    return;
                }
                Voicemed.setApiKey({"apikey": _apiKey}).then((e) => {
                    console.log('new apiKey set');
                }).then((r) => {
                    return self.requestPermissions()
                }).then((r) => {
                    return self.requestUser()
                }).then((r) => {
                    return self.requestChallenges()
                }).then((r) => {
                    console.log('got challenges?', r)
                    if (r && r.challenges) {
                        const _firstChallenge = r.challenges[0];
                        return Voicemed.startChallenge({
                            program_id: _firstChallenge._id
                        }).then((result) => {
                            console.log('startChallenge got result:', result);

                        }).finally(() => {
                            self.shadowRoot.querySelector('#take-start .text').classList.remove('hidden');
                            self.shadowRoot.querySelector('#take-start .lds-dual-ring').classList.add('hidden');
                        });
                    } else {
                        self.shadowRoot.querySelector('#take-start .text').classList.remove('hidden');
                        self.shadowRoot.querySelector('#take-start .lds-dual-ring').classList.add('hidden');
                        alert('Cannot retrieve Challenges');
                    }
                }).catch(() => {
                    self.shadowRoot.querySelector('#take-start .text').classList.remove('hidden');
                    self.shadowRoot.querySelector('#take-start .lds-dual-ring').classList.add('hidden');
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
