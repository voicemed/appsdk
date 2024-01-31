import colors from 'vuetify/es5/util/colors'

export default {
  icons: {
    iconfont: 'mdi', // default - only for display purposes,
    values: {
      home: {
        component: require('~/assets/icons/home_ico.svg?inline')
      },
      entries: {
        component: require('~/assets/icons/entries_ico.svg?inline')
      },
      settings: {
        component: require('~/assets/icons/settings_ico.svg?inline')
      },
      lock: {
        component: require('~/assets/icons/lock_ico.svg?inline')
      },
      unlock: {
        component: require('~/assets/icons/unlock_ico.svg?inline')
      },
      unlockguest: {
        component: require('~/assets/icons/unlock_guest_ico.svg?inline')
      },
      program: {
        component: require('~/assets/icons/program_ico.svg?inline')
      },
      custom_warning: {
        component: require('~/assets/icons/alert.svg?inline')
      },
      star: {
        component: require('~/assets/icons/star_ico.svg?inline')
      },
      idea: {
        component: require('~/assets/icons/idea_ico.svg?inline')
      },
      bell: {
        component: require('~/assets/icons/bell_ico.svg?inline')
      },
      heart: {
        component: require('~/assets/icons/heart_ico.svg?inline')
      },
      skip: {
        component: require('~/assets/icons/ico_skip.svg?inline')
      },
      doctor: {
        component: require('~/assets/icons/doctor_ico.svg?inline')
      },
      check: {
        component: require('~/assets/icons/check_ico.svg?inline')
      },
      rewind_10: {
        component: require('~/assets/icons/back_10_ico.svg?inline')
      },
      forward_10: {
        component: require('~/assets/icons/forward_10_ico.svg?inline')
      },
      facebook: {
        component: require('~/assets/icons/facebook_circle.svg?inline')
      },
      instagram: {
        component: require('~/assets/icons/instragram_circle.svg?inline')
      },
      celogo: {
        component: require('~/assets/icons/ce_logo.svg?inline')
      },
      mdlogo: {
        component: require('~/assets/icons/md_logo.svg?inline')
      },
      headquarter: {
        component: require('~/assets/icons/headquarter.svg?inline')
      },
      challenge: {
        component: require('~/assets/icons/ico_challenge.svg?inline')
      },
      homeoutline: {
        component: require('~/assets/icons/home-outline.svg?inline')
      },
      discovery: {
        component: require('~/assets/icons/discovery_icon.svg?inline')
      },
      discoveryReal: {
        component: require('~/assets/icons/discovery_icon.svg?inline')
      },
      today: {
        component: require('~/assets/icons/today_ico.svg?inline')
      },
      me: {
        component: require('~/assets/icons/me_ico.svg?inline')
      },
      clock: {
        component: require('~/assets/icons/clock-outline.svg?inline')
      },

      back: {
        component: require('~/assets/icons/back_ico.svg?inline')
      },
      chevronleft: {
        component: require('~/assets/icons/chevron-left.svg?inline')
      },
      chevronright: {
        component: require('~/assets/icons/chevron-right.svg?inline')
      },
      camera: {
        component: require('~/assets/icons/camera_ico.svg?inline')
      },
      completed_exercises: {
        component: require('~/assets/icons/completed_exercises.svg?inline')
      },
      completed_challenges: {
        component: require('~/assets/icons/completed_challenges.svg?inline')
      },
      total_breaths: {
        component: require('~/assets/icons/total_breaths.svg?inline')
      },
      top_day_streak: {
        component: require('~/assets/icons/top_day_streak.svg?inline')
      },
      max_hold: {
        component: require('~/assets/icons/max_hold.svg?inline')
      },
      minutes_breathing: {
        component: require('~/assets/icons/clock-outline.svg?inline')
      },
      gold_medal: {
        component: require('~/assets/icons/gold_medal.svg?inline')
      },
      silver_medal: {
        component: require('~/assets/icons/silver_medal.svg?inline')
      },
      bronze_medal: {
        component: require('~/assets/icons/bronze_medal.svg?inline')
      }

    }
  },
  theme: {
    dark: false,
    themes: {
      dark: {
        primary: '#848CE6',
        accent: colors.grey.darken3,
        secondary: '#515570',
        info: colors.teal.lighten1,
        warning: '#FF6207',
        error: colors.deepOrange.accent4,
        success: colors.green.accent3
      },
      light: {
        primary: '#848CE6',
        accent: colors.grey.darken3,
        secondary: '#515570',
        info: colors.teal.lighten1,
        warning: '#FF6207',
        error: colors.deepOrange.accent4,
        success: colors.green.accent3
      }
    }
  }
}
