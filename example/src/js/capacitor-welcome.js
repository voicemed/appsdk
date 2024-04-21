import {SplashScreen} from '@capacitor/splash-screen';
import {Camera} from '@capacitor/camera';
import {Voicemed} from 'voicemed-appsdk';

window.customElements.define(
    'capacitor-welcome',
    class extends HTMLElement {
        constructor() {
            super();
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
      <capacitor-welcome-titlebar>
        <h1>VoiceMed App Tester</h1>
      </capacitor-welcome-titlebar>
      <main>
        <p>
          Voicemed Tester
        </p>
        <h2>Choose environment</h2>
        <p class="environment_change">
          <button class="button" id="take-production">Production</button><button class="button" id="take-debug">Debug</button>
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
        <div id="log" style="max-height: 20vh; overflow-y: scroll; border-top:1px solid #666;padding-top:5px; padding-bottom: 20px;"><b>Voicemed plugin logs:</b><br/></div>
      </main>
    </div>
    `;
        }

        connectedCallback() {
            const self = this;

            self.shadowRoot.querySelector('#log').innerHTML =
                self.shadowRoot.querySelector('#log').innerHTML + "<br/><span style='color:orange;'>Register finishedExercise event listener</span>";
            //Register completed exercise listener
            Voicemed.addListener('finishedExercise', (info) => {
                console.log('got exercise end', info);
                self.shadowRoot.querySelector('#log').innerHTML =
                    self.shadowRoot.querySelector('#log').innerHTML + "<br/><span style='color:darkgreen;'>Got finishedExercise event: " + JSON.stringify(info) + "</span>";
            });
            self.shadowRoot.querySelector('#take-permissions').addEventListener('click', async function (e) {
                try {
                    self.shadowRoot.querySelector('#log').innerHTML =
                        self.shadowRoot.querySelector('#log').innerHTML + "<br/><span style='color:orange;'>Request permissions check</span>";
                    Voicemed.checkMicPerm().then((r) => {
                        console.log("Permission request finished", r);
                        alert('Permission request was completed');
                        self.shadowRoot.querySelector('#log').innerHTML =
                            self.shadowRoot.querySelector('#log').innerHTML + "<br/>" + JSON.stringify(r);
                    }).catch((e) => {
                        console.error('Cannot request permissionis', e);
                        alert('Cannot request permissions');
                        self.shadowRoot.querySelector('#log').innerHTML =
                            self.shadowRoot.querySelector('#log').innerHTML + "<br/><span style='color:red;'>" + JSON.stringify(e) + "</span>";
                    });

                } catch (e) {
                    console.warn('Permission error (general)', e);
                    self.shadowRoot.querySelector('#log').innerHTML =
                        self.shadowRoot.querySelector('#log').innerHTML + "<br/><span style='color:red;'>" + JSON.stringify(e) + "</span>";
                }
            });
            self.shadowRoot.querySelector('#take-user').addEventListener('click', async function (e) {
                try {
                    let randomUser = Math.floor(Math.random() * (2000 - 100 + 1) + 100);
                    const _randomUserString = "yh-test" + randomUser + "-sdk";
                    self.shadowRoot.querySelector('#log').innerHTML =
                        self.shadowRoot.querySelector('#log').innerHTML + "<br/><span style='color:orange;'>Request user auth for random : <b>" + _randomUserString + "</b></span>";
                    Voicemed.authenticateUser({
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
                        self.shadowRoot.querySelector('#log').innerHTML =
                            self.shadowRoot.querySelector('#log').innerHTML + "<br/><span style=''>Got auth response: " + JSON.stringify(user) + "</span>";
                    }).catch((e) => {
                        self.shadowRoot.querySelector('#log').innerHTML =
                            self.shadowRoot.querySelector('#log').innerHTML + "<br/><span style='color:red;'>Got auth error: " + JSON.stringify(e) + "</span>";
                    });
                } catch (e) {
                    console.warn('User cancelled', e);
                    alert('login error');
                    self.shadowRoot.querySelector('#log').innerHTML =
                        self.shadowRoot.querySelector('#log').innerHTML + "<br/><span style='color:red;'>" + JSON.stringify(e) + "</span>";
                }
            });
            self.shadowRoot.querySelector('#take-list').addEventListener('click', async function (e) {
                try {
                    self.shadowRoot.querySelector('#log').innerHTML =
                        self.shadowRoot.querySelector('#log').innerHTML + "<br/><span style='color:orange;'>Request exercises list by logged user</span>";

                    let token = {}
                    if (typeof window["currentToken"] !== 'undefined') {
                        token.token = window["currentToken"];
                    }
                    Voicemed.listExercises(token).then((r) => {
                        alert('exercises retrieved');
                        console.log('got challenges and exercises:', r.challenges);
                        self.shadowRoot.querySelector('#log').innerHTML =
                            self.shadowRoot.querySelector('#log').innerHTML + "<br/><span style=''>" + JSON.stringify(r) + "</span>";
                        const _lista = self.shadowRoot.querySelector('#exerciseList');
                        _lista.innerHTML = "";
                        r.challenges.forEach((challenge) => {
                            const d = document.createElement('DIV');
                            const sAct = document.createElement('SPAN');
                            sAct.classList.add('activateChallenge');
                            sAct.innerHTML = "Start Challenge";

                            d.innerHTML = "Challenge: " + challenge.title + "";
                            d.appendChild(sAct);
                            _lista.appendChild(d);

                            sAct.addEventListener('click', (e) => {
                                self.shadowRoot.querySelector('#log').innerHTML =
                                    self.shadowRoot.querySelector('#log').innerHTML + "<br/><span style='color:orange;'>Request Start Challenge</span>";
                                Voicemed.startChallenge({
                                    program_id: challenge._id
                                }).then((result) => {
                                    console.log('got result:', result);
                                    self.shadowRoot.querySelector('#log').innerHTML =
                                        self.shadowRoot.querySelector('#log').innerHTML + "<br/><span style='color:darkgreen;'>Challenge runner finish: " + JSON.stringify(result) + "</span>";
                                }).catch((error) => {
                                    console.error('Challenge runner error', error)
                                    self.shadowRoot.querySelector('#log').innerHTML =
                                        self.shadowRoot.querySelector('#log').innerHTML + "<br/><span style='color:red;'>Challenge runner error: " + JSON.stringify(error) + "</span>";
                                })
                            });
                            const _u = document.createElement('UL')
                            challenge.exercises.forEach((exerciseCnt, index) => {
                                const exercise = exerciseCnt.exercise
                                const _li = document.createElement('LI');
                                _li.innerHTML = exercise.title + " (" + exercise.type + ")";
                                _u.appendChild(_li);
                                _li.addEventListener('click', (e) => {
                                    self.shadowRoot.querySelector('#log').innerHTML =
                                        self.shadowRoot.querySelector('#log').innerHTML + "<br/><span style='color:orange;'>Request Start Exercise</span>";

                                    Voicemed.startExercise({
                                        id: exercise._id,
                                        program_id: challenge._id,
                                        program_index: index
                                    }).then((result) => {
                                        console.log('got result:', result);
                                        self.shadowRoot.querySelector('#log').innerHTML =
                                            self.shadowRoot.querySelector('#log').innerHTML + "<br/><span style='color:darkgreen;'>Exercise runner finish: " + JSON.stringify(result) + "</span>";
                                    }).catch((error) => {
                                        console.error('Exercise runner error', error)
                                        self.shadowRoot.querySelector('#log').innerHTML =
                                            self.shadowRoot.querySelector('#log').innerHTML + "<br/><span style='color:red;'>Exercise runner error: " + JSON.stringify(error) + "</span>";
                                    })

                                })
                            });
                            _lista.appendChild(_u);
                        });

                    }).catch((e) => {
                        console.error('cannot get exercises', e);
                        alert('cannot retrieve exercises')
                        self.shadowRoot.querySelector('#log').innerHTML =
                            self.shadowRoot.querySelector('#log').innerHTML + "<br/><span style='color:red;'>Cannot retrieve exercises: " + JSON.stringify(e) + "</span>";
                    })

                } catch (e) {
                    console.warn('Error', e);
                    self.shadowRoot.querySelector('#log').innerHTML =
                        self.shadowRoot.querySelector('#log').innerHTML + "<br/><span style='color:red;'>" + JSON.stringify(e) + "</span>";
                }
            });

            Voicemed.getEnvironment().then((env)=>{
                let newEnv = env.environment;
                console.log('got env response',env)
                if(newEnv ==="staging") {
                    self.shadowRoot.querySelector('#take-production').classList.remove('active');
                    self.shadowRoot.querySelector('#take-debug').classList.add('active');
                } else {
                    self.shadowRoot.querySelector('#take-production').classList.add('active');
                    self.shadowRoot.querySelector('#take-debug').classList.remove('active');
                }
            });
            self.shadowRoot.querySelector('#take-production').addEventListener('click',async function(e) {
               Voicemed.setEnvironment({"environment":'production'}).then((e)=>{
                   self.shadowRoot.querySelector('#take-production').classList.add('active');
                   self.shadowRoot.querySelector('#take-debug').classList.remove('active');
               }).catch(()=>{

               });
            });
            self.shadowRoot.querySelector('#take-debug').addEventListener('click',async function(e) {
                Voicemed.setEnvironment({"environment":'staging'}).then((e)=>{
                    self.shadowRoot.querySelector('#take-production').classList.remove('active');
                    self.shadowRoot.querySelector('#take-debug').classList.add('active');
                }).catch(()=>{

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
