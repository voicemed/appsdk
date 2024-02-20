import {SplashScreen} from '@capacitor/splash-screen';
import {Camera} from '@capacitor/camera';
import {Voicemed} from 'voicemed-appsdk';

window.customElements.define(
    'capacitor-welcome',
    class extends HTMLElement {
        constructor() {
            super();
            SplashScreen.hide();

            //Register completed exercise listener
            Voicemed.addListener('finishedExercise', (info) => {
                console.log('got exercise end', info);
            });

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
      h1, h2, h3, h4, h5 {
        text-transform: uppercase;
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
    </style>
    <div>
      <capacitor-welcome-titlebar>
        <h1>VoiceMed App Tester</h1>
      </capacitor-welcome-titlebar>
      <main>
        <p>
          Voicemed Tester
        </p>
        <h2>Request permissions</h2>
        <p>
          0. Request Proper permissions
        </p>
        <p>
          <button class="button" id="take-permissions">Request</button>
        </p>
        <h2>Getting Started</h2>
        <p>
          1. Authenticate to VoiceMed environment
        </p>
        <p>
          <button class="button" id="take-user">Authenticate random User</button>
        </p>
        <h2>List Exercises</h2>
        <p>
          2. List Challenges and exercises available for this user
        </p>
        <p>
          <button class="button" id="take-list">List</button>
        </p>
        <div id="exerciseList" style="max-height: 30vh; overflow-y: scroll;">&nbsp;</div>
      </main>
    </div>
    `;
        }

        connectedCallback() {
            const self = this;

            self.shadowRoot.querySelector('#take-permissions').addEventListener('click', async function (e) {
                try {
                    Voicemed.checkMicPerm().then((r) => {
                        console.log("Permission request finished", r);
                        alert('Permission request was completed');
                    }).catch((e) => {
                        console.error('Cannot request permissionis', e);
                        alert('Cannot request permissions');
                    });

                } catch (e) {
                    console.warn('Permission error (general)', e);
                }
            });
            self.shadowRoot.querySelector('#take-user').addEventListener('click', async function (e) {
                try {
                    const user = await Voicemed.authenticateUser({externalID: "yh-test321-sdk"});
                    console.log('got user data:', user);
                    if (user && user.access_token) {
                        window.currentToken = user.access_token;
                        alert('User authenticated!');
                    } else {
                        alert('cannot login');
                    }
                } catch (e) {
                    console.warn('User cancelled', e);
                    alert('login error');
                }
            });
            self.shadowRoot.querySelector('#take-list').addEventListener('click', async function (e) {
                try {
                    let token = {}
                    if (typeof window["currentToken"] !== 'undefined') {
                        token.token = window["currentToken"];
                    }
                    Voicemed.listExercises(token).then((r) => {
                        alert('exercises retrieved');
                        console.log('got challenges and exercises:', r.challenges);
                        const _lista = self.shadowRoot.querySelector('#exerciseList');
                        _lista.innerHTML = "";
                        r.challenges.forEach((challenge) => {
                            const d = document.createElement('DIV');
                            d.innerHTML = "Challenge: " + challenge.title;
                            _lista.appendChild(d);
                            const _u = document.createElement('UL')
                            challenge.exercises.forEach((exerciseCnt, index) => {
                                const exercise = exerciseCnt.exercise
                                const _li = document.createElement('LI');
                                _li.innerHTML = exercise.title + " (" + exercise.type + ")";
                                _u.appendChild(_li);
                                _li.addEventListener('click', (e) => {
                                    Voicemed.startExercise({
                                        id: exercise._id,
                                        program_id: challenge._id,
                                        program_index: index
                                    }).then((result) => {
                                        console.log('got result:', result);
                                    }).catch((error) => {
                                        console.error('Exercise runner error', error)
                                    })

                                })
                            });
                            _lista.appendChild(_u);
                        });
                    }).catch((e) => {
                        console.error('cannot get exercises', e);
                        alert('cannot retrieve exercises')
                    })

                } catch (e) {
                    console.warn('Error', e);
                }
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
