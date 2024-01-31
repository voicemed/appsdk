import enAirlyn from '../locales/en.json'
import itAirlyn from '../locales/it.json'
import enVoicemed from '../locales/voicemed_en.json'
import itVoicemed from '../locales/voicemed_it.json'

const it = process.env.BUILD_ENV.indexOf("voicemed_") > -1 ? itVoicemed : itAirlyn;
const en = process.env.BUILD_ENV.indexOf("voicemed_") > -1 ? enVoicemed : enAirlyn;
export default {
    locale: 'en',
    fallbackLocale: {
        'it-IT': ['it'],
        'it-CH': ['it'],
        'en-GB': ['en'],
        'en-US': ['en'],
        'default': ['en', 'it']
    },
    messages: {en, it}
}
