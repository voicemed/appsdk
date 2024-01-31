import { SplashScreen } from '@capacitor/splash-screen';
import { Camera } from '@capacitor/camera';
import { Voicemed} from 'voicemed-appsdk';

window.customElements.define(
  'capacitor-welcome',
  class extends HTMLElement {
    constructor() {
      super();

      SplashScreen.hide();
      window.test = Voicemed;
      console.log('test me', Voicemed.echo({'value':'Ciao be'}).then((r)=>{console.log('got somethng',r)}));

      const root = this.attachShadow({ mode: 'open' });

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
    </style>
    <div>
      <capacitor-welcome-titlebar>
        <h1>VoiceMed App Tester</h1>
      </capacitor-welcome-titlebar>
      <main>
        <p>
          Voicemed Tester
        </p>
        <h2>Getting Started</h2>
        <p>
          Authenticate
        </p>
        <p>
          <button class="button" id="take-user">Authenticate random User</button>
        </p>
        <h2>List Exercises</h2>
        <p>
          List
        </p>
        <p>
          <button class="button" id="take-list">List</button>
        </p>
        <h2>StartExercise</h2>
        <p>
          start
        </p>
        <p>
          <button class="button" id="start-exe">Start</button>
        </p>
        <p>
          <img id="image" style="max-width: 100%">
        </p>
      </main>
    </div>
    `;
    }

    connectedCallback() {
      const self = this;

      self.shadowRoot.querySelector('#take-user').addEventListener('click', async function (e) {
        try {
          const user = await Voicemed.authenticateUser({externalID:321,email:"testsdkuser@voicemed.io"});
          console.log('got user data:', user);
        } catch (e) {
          console.warn('User cancelled', e);
        }
      });
        self.shadowRoot.querySelector('#take-list').addEventListener('click', async function (e) {
            try {
                const exercises = await Voicemed.listExercises()
                console.log('got exercises:', exercises);
            } catch (e) {
                console.warn('Error', e);
            }
        });
        self.shadowRoot.querySelector('#start-exe').addEventListener('click', async function (e) {
            try {
                const result = await Voicemed.startExercise({id:321,program_id:123,program_index:1})
                console.log('got result:', result);
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
      const root = this.attachShadow({ mode: 'open' });
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
