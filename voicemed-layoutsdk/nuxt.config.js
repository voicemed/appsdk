import i18n from './config/i18n'
import packageJSON from './package.json';

console.log('reading package', packageJSON);
const versionNumber = packageJSON.version || "1.0.12";
const titleTemplates = {
  'production': '%s - Airlyn',
  'staging': '%s - Airlyn',
  'voicemed_production': '%s - Voicemed',
  'voicemed_staging': '%s - Voicemed',
  'development': "%s - Airlyn",
  'library': '%s - Voicemed',
  'library-dev': '%s - Voicemed'
};
const appNames = {
  'production': "airlyn-mvpapp",
  'staging': "airlyn-mvpapp",
  'voicemed_production': "voicemed-mvpapp",
  'voicemed_staging': "voicemed-mvpapp",
  'development': "airlyn-mvpapp",
  'library': 'voicemed-mvplib',
  'library-dev': 'voicemed-mvplibdev'
};
const baseApiv1Mapping = {
  'production': "https://api-2.voicemed.io/v1/",
  'staging': "https://sandbox-api-2.voicemed.io/v1/",
  'voicemed_production': "https://api-2.voicemed.io/v1/",
  'voicemed_staging': "https://sandbox-api-2.voicemed.io/v1/",
  'development': "https://sandbox-api-2.voicemed.io/v1/",
  'library': "https://api-2.voicemed.io/v1/",
  'library-dev': "https://sandbox-api-2.voicemed.io/v1/"
};
const baseApiv2Mapping = {
  'production': "https://api-2.voicemed.io/v2/",
  'staging': "https://sandbox-api-2.voicemed.io/v2/",
  'voicemed_production': "https://api-2.voicemed.io/v2/",
  'voicemed_staging': "https://sandbox-api-2.voicemed.io/v2/",
  'development': "https://sandbox-api-2.voicemed.io/v2/",
  'library': "https://api-2.voicemed.io/v2/",
  'library-dev': "https://sandbox-api-2.voicemed.io/v2/"
};

const clarityMapping = {
  'production': "jyj282de5x",
  'staging': "jyj282de5x",
  'voicemed_production': "km539v2n44",
  'voicemed_staging': "km539v2n44",
  'development': "jyj282de5x",
  'library': "",
  'library-dev': ""
};

const firebaseApp = {
  apiKey: "AIzaSyBAYlSAaSOG6QvtXxEvf7K-FQ0kLmAzEok",
  authDomain: "ml-datasets-438ab.firebaseapp.com",
  databaseURL: "https://ml-datasets-438ab.firebaseio.com",
  projectId: "ml-datasets-438ab",
  storageBucket: "ml-datasets-438ab.appspot.com",
  messagingSenderId: "362804690208",
  appId: "1:362804690208:web:56a971ea7cb3091051ab45",
  measurementId: "G-GXE1F3L53W"
}
const firebaseAppStaging = {
  apiKey: "AIzaSyDlWBpl4mgBKE_-e4ch9X0lra5tgQ1j5ss",
  authDomain: "app-airlyn-staging.firebaseapp.com",
  projectId: "app-airlyn-staging",
  storageBucket: "app-airlyn-staging.appspot.com",
  messagingSenderId: "373140597479",
  appId: "1:373140597479:web:0183bf7f80a3c092491042",
  measurementId: "G-KE20VJ62Q6"
};

const firebaseVoicemedApp = {
  apiKey: "AIzaSyBAYlSAaSOG6QvtXxEvf7K-FQ0kLmAzEok",
  authDomain: "ml-datasets-438ab.firebaseapp.com",
  databaseURL: "https://ml-datasets-438ab.firebaseio.com",
  projectId: "ml-datasets-438ab",
  storageBucket: "ml-datasets-438ab.appspot.com",
  messagingSenderId: "362804690208",
  appId: "1:362804690208:web:56a971ea7cb3091051ab45",
  measurementId: "G-GXE1F3L53W"
}
const firebaseVoicemedAppStaging = {
  apiKey: "AIzaSyDlWBpl4mgBKE_-e4ch9X0lra5tgQ1j5ss",
  authDomain: "app-airlyn-staging.firebaseapp.com",
  projectId: "app-airlyn-staging",
  storageBucket: "app-airlyn-staging.appspot.com",
  messagingSenderId: "373140597479",
  appId: "1:373140597479:web:0183bf7f80a3c092491042",
  measurementId: "G-KE20VJ62Q6"
};
const firebaseVoicemedLibrary = {};


const baseApiUrl = typeof (baseApiv1Mapping[process.env.BUILD_ENV]) !== 'undefined' ? baseApiv1Mapping[process.env.BUILD_ENV] : baseApiv1Mapping['development'];
const baseApiV2Url = typeof (baseApiv2Mapping[process.env.BUILD_ENV]) !== 'undefined' ? baseApiv2Mapping[process.env.BUILD_ENV] : baseApiv2Mapping['development'];
const titleTemplate = typeof (titleTemplates[process.env.BUILD_ENV]) !== 'undefined' ? titleTemplates[process.env.BUILD_ENV] : titleTemplates['development'];
const appName = typeof (appNames[process.env.BUILD_ENV]) !== 'undefined' ? appNames[process.env.BUILD_ENV] : appNames['development'];
const clarityProjectID = typeof (clarityMapping[process.env.BUILD_ENV]) !== 'undefined' ? clarityMapping[process.env.BUILD_ENV] : clarityMapping['development'];

const masterUrls = {
  '/proxyapi/': baseApiUrl,
  '/proxystorage': (process.env.BUILD_ENV === 'production' || process.env.BUILD_ENV === 'voicemed_production') ?
    process.env.PROD_STORAGE :
    ((process.env.BUILD_ENV === 'staging' || process.env.BUILD_ENV === 'voicemed_staging') ?
      process.env.STAGING_STORAGE :
      process.env.DEV_STORAGE),
  '/v2api/': baseApiV2Url,
}
console.log('READY TO BUILD', process.env.BUILD_ENV);

const pluginsMobile = [
  {src: '~/plugins/i18n.js', mode: 'client'},
  {src: '~/plugins/apiConstant.js', mode: 'client'},
  {src: '~/plugins/capacitor.js', mode: 'client'},
  '~/plugins/axios',
  '~/plugins/sentryhelper',
  {src: '~/plugins/vue-use.js', mode: 'client'},
  {src: '~/plugins/device-info.js', mode: 'client'},
  {src: '~/plugins/inject-rww.js', ssr: false},
  {src: '~/plugins/ml-animations.js', ssr: false},
  {src: '~/plugins/exerciseManager.js', ssr: false},
  {src: '~/plugins/after-each.js', mode: 'client'},
  {src: '~/plugins/mic-helper.js', mode: 'client'},
  {src: '~/plugins/auth.js', mode: 'client'},
  {src: '~/plugins/axios-cache.js', mode: 'client'},
  {src: '~/plugins/linechart.js', mode: 'client'}
];
const pluginsWebTest = [
  {src: '~/plugins/i18n.js', mode: 'client'},
  {src: '~/plugins/apiConstant.js', mode: 'client'},
  {src: '~/plugins/capacitor.js', mode: 'client'},
  '~/plugins/axios_local',
  '~/plugins/sentryhelper',
  {src: '~/plugins/device-info.js', mode: 'client'},
  {src: '~/plugins/vue-use.js', mode: 'client'},
  {src: '~/plugins/inject-rww.js', ssr: false},
  {src: '~/plugins/ml-animations.js', ssr: false},
  {src: '~/plugins/exerciseManager.js', ssr: false},
  {src: '~/plugins/after-each.js', mode: 'client'},
  {src: '~/plugins/mic-helper.js', mode: 'client'},
  {src: '~/plugins/auth.js', mode: 'client'},
  {src: '~/plugins/axios-cache.js', mode: 'client'},
  {src: '~/plugins/linechart.js', mode: 'client'}
];
const modulesMobile = [
  // https://go.nuxtjs.dev/axios
  '@nuxtjs/axios',
  '@nuxtjs/auth-next',
  '@nuxtjs/i18n',
  ['nuxt-vuex-localstorage', {
    mode: 'debug',
    localStorage: ['user', 'exercises', 'joinedprograms', 'tutorialstore'],
    sessionStorage: ['mediadevices', 'tutorialrun']
  }]
];
const modulesWebTest = [

  '@nuxtjs/axios',
  '@nuxtjs/auth-next',
  '@nuxtjs/i18n',
  ['nuxt-vuex-localstorage', {
    localStorage: ['user', 'exercises', 'joinedprograms'],
    sessionStorage: ['mediadevices']
  }]
];

const proxyConfig = () => {
  if (process.env.BUILD_ENV === 'production' || process.env.BUILD_ENV === 'voicemed_production' || process.env.BUILD_ENV === 'library') {
    return {
      '/proxyapi/': {
        target: baseApiUrl,
        pathRewrite: {'^/proxyapi/': ''}
      },
      '/v2api/': {
        target: baseApiV2Url,
        pathRewrite: {'^/v2api/': ''}
      },
      '/proxystorage/': {
        target: process.env.PROD_STORAGE,
        pathRewrite: {'^/proxystorage/': ''}
      }

    }
  } else if (process.env.BUILD_ENV === 'staging' || process.env.BUILD_ENV === 'voicemed_staging' || process.env.BUILD_ENV === 'library-dev') {
    return {
      '/proxyapi/': {
        target: baseApiUrl,
        pathRewrite: {'^/proxyapi/': ''}
      },
      '/v2api/': {
        target: baseApiV2Url,
        pathRewrite: {'^/v2api/': ''}
      },
      '/proxystorage/': {
        target: process.env.STAGING_STORAGE,
        pathRewrite: {'^/proxystorage/': ''}
      }
    }
  } else {
    return {
      '/proxyapi/': {
        target: baseApiUrl,
        pathRewrite: {'^/proxyapi/': ''}
      },
      '/v2api/': {
        target: baseApiV2Url,
        pathRewrite: {'^/v2api/': ''}
      },
      '/proxystorage/': {
        target: process.env.DEV_STORAGE,
        pathRewrite: {'^/proxystorage/': ''}
      }
    }
  }
}

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  render: {
    csp: {
      hashAlgorithm: 'sha256',
      policies: {
        'default-src': [
          "'self'",
          'https',
          '*.voicemed.io',
          '*.googleapis.com',
          'blob:'
        ],
        'font-src': [
          "'self'",
          'fonts.gstatic.com'
        ],
        'frame-src': [
          'accounts.google.com',
          '*.typeform.com'
        ],
        'script-src': [
          "'self'",
          'apis.google.com',
          "'unsafe-eval'",
          '*.googletagmanager.com'
        ],
        'img-src': [
          "'self'",
          'data:',
          'blob:',
          '*.voicemed.io'
        ],
        'style-src': [
          "'self'",
          "'unsafe-inline'",
          'fonts.googleapis.com'
        ],
        'media-src': [
          'https',
          '*.voicemed.io',
          'blob:'
        ]
      },
      unsafeInlineCompatibility: true
    }
  },
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: titleTemplate,
    title: appName,
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      {charset: 'utf-8'},
      /*{name: 'viewport', content: 'width=device-width, initial-scale=1'},*/
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, target-densityDpi=device-dpi, viewport-fit=cover'
      },
      {hid: 'description', name: 'description', content: 'Airlyn App'},
      {name: 'color-scheme', content: 'light'},
      {name: 'format-detection', content: 'telephone=no'}

    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: process.env.BUILD_ENV.indexOf("voicemed_") > -1 ? '/favicon_voicemed.ico' : '/favicon.ico'
      }
    ],
    script: [
      {src: "/swiped-events.min.js"}
    ]
  },
  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
    '@assets/font-nunito.css',
    process.env.BUILD_ENV.indexOf("voicemed_") > -1 ? '@assets/styles_voicemed.scss' : '@assets/styles.scss'
  ],
  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: (process.env.BUILD_ENV === "production" || process.env.BUILD_ENV === "staging" || process.env.BUILD_ENV === "voicemed_production" || process.env.BUILD_ENV === "voicemed_staging") ? pluginsMobile : pluginsWebTest,
  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,
  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/typescript
    '@nuxtjs/device',
    '@nuxt/typescript-build',
    'nuxt-animejs',
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/svg',
    '@nuxtjs/vuetify'
  ],
  // Modules: https://go.nuxtjs.dev/config-modules
  modules: (process.env.BUILD_ENV === "production" || process.env.BUILD_ENV === "staging" || process.env.BUILD_ENV === "voicemed_production" || process.env.BUILD_ENV === "voicemed_staging") ? modulesMobile : modulesWebTest,
  i18n: {
    vueI18nLoader: true,
    locales: [
      {
        code: 'en',
        iso: 'en-US',
        name: 'English'
      },
      {
        code: 'it',
        iso: 'it-IT',
        name: 'Italiano'
      }
    ],
    vueI18n: i18n,
    seo: false,
    strategy: 'prefix_and_default',
    defaultLocale: 'en',
    parsePages: false,
    detectBrowserLanguage: {
      useCookie: false,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',  // recommended
    },
    alwaysRedirect: true
  },
  loading: '@/components/LoadingBar.vue',
  auth: {
    plugins: ['~/plugins/authmanager.js'],
    cookie: false,
    strategies: {
      local: {
        token: {
          property: 'token',
          global: true,
          required: true,
          type: 'Bearer',
          maxAge: 60 * 60 * 24 * 30
        },
        user: {
          property: false
          // autoFetch: true
        },
        endpoints: {
          login: {url: '/proxyapi/auth/login', method: 'post'},
          logout: {url: '/proxyapi/logout', method: 'post'},
          user: {url: '/proxyapi/user', method: 'get'}
        }
      }
    },
    redirect: {
      login: '/welcome',
      logout: '/welcome',
      callback: '/',
      home: '/'
    }
  },

  router: {
    middleware: ['vmauth'],
    extendRoutes(routes, resolve) {
      routes.push(
          {
            name: 'ml-runexercise-index',
            path: '/ml-index',
            component: resolve(__dirname, 'pages/index.vue'),
            chunkName: 'pages/ml_exerciseexecutor_index'
          },
          {
          name: 'ml-runexercise',
          path: '/ml/exercises/:id/:fromprogram?/:withindex?/:backto?',
          component: resolve(__dirname, 'pages/ml/exerciseexecutor/_id.vue'),
          chunkName: 'pages/ml_exerciseexecutor'
        },
        {
          name: 'ml-runexercise-audio',
          path: '/ml/exercises/:id/audio/:fromprogram?/:withindex?/:backto?',
          component: resolve(__dirname, 'pages/ml/exerciseexecutor/audio.vue'),
          chunkName: 'pages/ml_mediaexercises'
        },
        {
          name: 'ml-runexercise-survey',
          path: '/ml/exercises/:id/survey/:fromprogram?/:withindex?/:backto?',
          component: resolve(__dirname, 'pages/ml/exerciseexecutor/survey.vue'),
          chunkName: 'pages/ml_surveyexercises'
        },
        {
          name: 'ml-runexercise-quiz',
          path: '/ml/exercises/:id/quiz/:fromprogram?/:withindex?/:backto?',
          component: resolve(__dirname, 'pages/ml/exerciseexecutor/quiz.vue'),
          chunkName: 'pages/ml_quizexercises'
        },
        {
          name: 'ml-runexercise-video',
          path: '/ml/exercises/:id/video/:fromprogram?/:withindex?/:backto?',
          component: resolve(__dirname, 'pages/ml/exerciseexecutor/video.vue'),
          chunkName: 'pages/ml_mediaexercises'
        },
        {
          name: 'ml-runexercise-post',
          path: '/ml/exercises/:id/post/:fromprogram?/:withindex?/:backto?',
          component: resolve(__dirname, 'pages/ml/exerciseexecutor/post.vue'),
          chunkName: 'pages/ml_htmlexercises'
        },
        {
          name: 'ml-runexercise-setup',
          path: '/ml/exercises/:id/setup/:fromprogram?/:withindex?/:backto?',
          component: resolve(__dirname, 'pages/ml/exerciseexecutor/setup_v2.vue'),
          chunkName: 'pages/ml_setup'
        },
        {
          name: 'ml-runexercise-noise',
          path: '/ml/exercises/:id/noise-check/:fromprogram?/:withindex?/:backto?',
          component: resolve(__dirname, 'pages/ml/exerciseexecutor/noise.vue'),
          chunkName: 'pages/ml_noise'
        },
        {
          name: 'ml-runexercise-runner',
          path: '/ml/exercises/:id/runner/:fromprogram?/:withindex?/:backto?',
          component: resolve(__dirname, 'pages/ml/exerciseexecutor/runner.vue'),
          chunkName: 'pages/ml_exerciseexecutor'
        },
        {
          name: 'ml-runexercise-runnersilent',
          path: '/ml/exercises/:id/runnersilent/:fromprogram?/:withindex?/:backto?',
          component: resolve(__dirname, 'pages/ml/exerciseexecutor/runnersilent.vue'),
          chunkName: 'pages/ml_exerciseexecutor'
        }
      )
    }
  },
  proxy: proxyConfig(),

  axios: {
    proxy: (process.env.BUILD_ENV === "production" || process.env.BUILD_ENV === "staging" || process.env.BUILD_ENV === "voicemed_production" || process.env.BUILD_ENV === "voicemed_staging") ? false : true,
    globalUrls: masterUrls,
    timeout: 10000,
    debug: process.env.BUILD_ENV ? false : true
  },
  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: [process.env.BUILD_ENV.indexOf("voicemed_") > -1 ? '~/assets/variables_voicemed.scss' : '~/assets/variables.scss'],
    defaultAssets: false,
    optionsPath: process.env.BUILD_ENV.indexOf("voicemed_") > -1 ? './vuetify.voicemed.options.js' : './vuetify.options.js',
  },
  publicRuntimeConfig: {
    env: {
      urls: masterUrls,
      environment: process.env.BUILD_ENV,
      clarityID: clarityProjectID,
      version: ((process.env.BUILD_ENV === 'production' || process.env.BUILD_ENV === 'voicemed_production') ? 'Live@' : (process.env.BUILD_ENV === 'staging' || process.env.BUILD_ENV === 'voicemed_staging') ? 'Staging@' : 'Beta@') + versionNumber,
      sentry: false,
      /*sentry: (process.env.BUILD_ENV === "production" || process.env.BUILD_ENV === "staging" || process.env.BUILD_ENV === "voicemed_production" || process.env.BUILD_ENV === "voicemed_staging") ? true : false,*/
      firebase: process.env.BUILD_ENV === 'production' ? firebaseApp : process.env.BUILD_ENV === 'staging' ? firebaseAppStaging : process.env.BUILD_ENV === 'voicemed_production' ? firebaseVoiceApp : process.env.BUILD_ENV === 'voicemed_staging' ? firebaseVoicemedAppStaging : firebaseVoicemedAppStaging,
    }
  },
  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    /*analyze : true,*/
    transpile: ['chart.js', 'vue-chartjs', 'sanitize-html'],
    terser: {
      terserOptions: {
        compress: {
          drop_console: (process.env.BUILD_ENV === 'production' || process.env.BUILD_ENV === 'voicemed_production' || process.env.BUILD_ENV === 'library')
        }
      }
    },
    extend(config, ctx) {
      config.devtool = 'source-map';
      if (ctx.isClient) {
        config.module.rules.push(
          {
            test: /\.worker\.ts$/,
            loader: "worker-loader",
            exclude: /(node_modules)/,
          }, {
            test: /\.worker\.js$/,
            loader: 'worker-loader',
            exclude: /(node_modules)/,
          })
      }
    },
    filenames: {
      app: '[name].[hash].js'
    },
    babel: {
      compact: true
    },
    publicRuntimeConfig: {
      clientVersion: JSON.stringify(require('./package.json').version)
    }
  }
}
