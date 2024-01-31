import {userAgentParser} from "device-detector-js/dist/utils/user-agent";

export default (app, inject) => {
  const signupManager = {
    context: null,
    //Signup POST /auth/signup
    signupUser(userinstance) {
      const params = new FormData();
      params.append('email', userinstance.username.toLowerCase());
      params.append('password', userinstance.password);
      //Meta info:
      let meta = {};
      Object.keys(userinstance).map((kp) => {
        if (['username', 'password', 'name'].indexOf(kp) === -1) {
          meta[kp] = userinstance[kp]
        }
      });
      const jsonParams = {
        email: userinstance.username.toLowerCase(),
        password: userinstance.password,
        name: userinstance.name,
        meta: meta
      }
      const headers = {
        'Content-Type': 'application/json'
      }
      return signupManager.context.$axios.$post($nuxt.$apiConstants.userSignup, jsonParams, headers).then((r) => {
        console.log('[auth]got result', r);
        if (r && r.access_token) {
          userinstance.isverified = false;
          signupManager.context.$auth.setUserToken(r.access_token, r.access_token);
        }
        return r;
      });
    },
    updateAvatar(photo, mime, uploadprogress) {
      const params = new FormData();
      let ext = "jpg";
      if (mime && mime.toLowerCase().indexOf("jpeg") > -1) {
        ext = "jpg"
      } else if (mime && mime.toLowerCase().indexOf("jpg") > -1) {
        ext = "jpg"
      } else if (mime && mime.toLowerCase().indexOf("png") > -1) {
        ext = "png"
      }
      params.append('avatar', photo, "avatar." + ext);
      const config = {
        method: 'POST',
        url: $nuxt.$apiConstants.userUpdateAvatar,
        data: params,
        timeout: 360 * 1000,
        Authorization: signupManager.context.$auth.strategy.token.get(),
        onUploadProgress: (progress) => {
          if (typeof uploadprogress === 'function') {
            uploadprogress(progress);
          }
        }
      }
      return signupManager.context.$axios.$request(config).then((r) => {
        console.log('[userAvatar]got result', r);
        return r;
      });
    },
    updateProfile(userinstance) {
//Meta info:
      let meta = {};
      let jsonParams = {}
      Object.keys(userinstance).map((kp) => {
        if (kp !== 'password') {
          if (['username', 'password', 'name','tags'].indexOf(kp) === -1) {
            if (userinstance[kp] !== null && userinstance[kp] !== undefined) {
              meta[kp] = userinstance[kp]
            }
          } else {
            if (userinstance[kp] !== null && userinstance[kp] !== undefined) {
              jsonParams[kp] = userinstance[kp]
            }
          }
        }
      });
      jsonParams['meta'] = meta
      const headers = {
        Authorization: signupManager.context.$auth.strategy.token.get(),
        'Content-Type': 'application/json'
      }
      return signupManager.context.$axios.$patch($nuxt.$apiConstants.userUpdateProfile, jsonParams, headers).then((r) => {
        console.log('[userProfile]got result', r);
        return r;
      });
    },
    updatePassword(userinstance) {
      let meta = {};
      let jsonParams = {}
      Object.keys(userinstance).map((kp) => {

        if (['currentPassword', 'newPassword'].indexOf(kp) !== -1) {
          if (userinstance[kp] !== null && userinstance[kp] !== undefined) {
            jsonParams[kp] = userinstance[kp]
          }
        }

      });

      const headers = {
        Authorization: signupManager.context.$auth.strategy.token.get(),
        'Content-Type': 'application/json'
      }
      return signupManager.context.$axios.put($nuxt.$apiConstants.userUpdatePassword, jsonParams, headers).then((r) => {
        console.log('[userProfile]got result', r);
        return r;
      });
    },
    //Submit verification code (signup process) POST /auth/verify
    verifyCode(code) {
      const jsonParams = {
        verificationCode: code
      }
      const headers = {
        Authorization: signupManager.context.$auth.strategy.token.get(),
        'Content-Type': 'application/json'
      }
      return signupManager.context.$axios.$post($nuxt.$apiConstants.authVerify, jsonParams, headers);
    },
    //Get new verification code (signup process) POST /auth/new_verification_code
    requestNewVerificationCode(code) {
      const params = new FormData();
      params.append('verificationCode', code);
      const headers = {
        Authorization: signupManager.context.$auth.strategy.token.get()
      }
      return signupManager.context.$axios.$post($nuxt.$apiConstants.authRequestVerificationCode, params, headers);
    },

    requestResetPasswordCode(email) {

      const jsonParams = {
        "email": email
      }

      const headers = {
        Authorization: signupManager.context.$auth.strategy.token.get()
      }
      return signupManager.context.$axios.$post($nuxt.$apiConstants.authPasswordResetCode, jsonParams, headers);
    },
    verifyResetPasswordCode(code, email) {
      const jsonParams = {
        "passwordResetCode": code,
        "email": email
      }

      const headers = {
        Authorization: signupManager.context.$auth.strategy.token.get()
      }
      return signupManager.context.$axios.$post($nuxt.$apiConstants.authPasswordVerifyResetCode, jsonParams, headers);
    },
    confirmResetPassword(email, code, password) {
      const jsonParams = {
        "passwordResetToken": code,
        "email": email,
        "password": password
      }

      const headers = {
        Authorization: signupManager.context.$auth.strategy.token.get()
      }
      return signupManager.context.$axios.$post($nuxt.$apiConstants.authPasswordReset, jsonParams, headers);
    },
    validatePassword(password) {
      const pattern = /^(?=.*\d)(?=.*[A-Z])(?!.*[^a-zA-Z0-9|!"£$%&\/()=?^*+#@\-_.<>§ì°,;:'\\])(.{8,64})$/
      return pattern.test(password)
    },
    checkEmail(email) {
      const headers = {
        'Content-Type': 'application/json'
      }
      const httpBuild = new URLSearchParams();
      httpBuild.append("email", email)
      return signupManager.context.$axios.$get($nuxt.$apiConstants.userCheckEmail + "?" + httpBuild.toString()).then((r) => {
        if (r && r.userExists) {
          return r.userExists
        }
        return false;
      });
    },

    signinByGoogle(token,userpayload) {
      const headers = {
        'Content-Type': 'application/json'
      }
      let meta = {};
      let name = "";
      if(userpayload) {
        Object.keys(userpayload).map((kp) => {
          if (['username', 'password', 'name'].indexOf(kp) === -1) {
            meta[kp] = userpayload[kp]
          }
          if(kp ==='name') {
            name = userpayload[kp]
          }
        });
      }
      const jsonParams = {
        "token": token,
        'name':name.length>0?name:null,
        'meta':meta
      }

      console.log('send payload for google signing', jsonParams)
      return signupManager.context.$axios.$post($nuxt.$apiConstants.userGoogleSignin, jsonParams, headers);
    },
    signInByApple(payload,userpayload) {

      const headers = {
        'Content-Type': 'application/json'
      }
      let meta = {};
      if(userpayload) {
        Object.keys(userpayload).map((kp) => {
          if (['username', 'password', 'name'].indexOf(kp) === -1) {
            meta[kp] = userpayload[kp]
          }
          if(kp ==='name') {
            name = userpayload[kp]
          }
        });
      }
      const jsonParams = {
        user: payload.user || "",
        email: payload.email || "",
        givenName: payload.givenName || userpayload.name,
        familyName: payload.familyName || "",
        identityToken: payload.identityToken || "",
        authorizationCode: payload.authorizationCode || "",
        meta:meta
      }
      console.log('send payload for apple signing', jsonParams)
      return signupManager.context.$axios.$post($nuxt.$apiConstants.userAppleSignin, jsonParams, headers);
    },
    signinByMeta(token,userpayload) {
      const headers = {
        'Content-Type': 'application/json'
      }
      let meta = {};
      let name = "";
      let userId = "";
      if(typeof token !=='string') {
        if(typeof token['accessToken'] !=='undefined') {
          token = token['accessToken'];
        }
        let finalToken = "";
        Object.keys(token).map((kp) => {
            meta[kp] = token[kp]
          if(kp =='token') {
            finalToken = token[kp]
          }
          if(kp =='userId') {
            userId = token[kp]
          }
        })
        if(finalToken.length>0) {
          token = finalToken
        }
      }
      if(userpayload) {
        Object.keys(userpayload).map((kp) => {
          if (['username', 'password', 'name'].indexOf(kp) === -1) {
            meta[kp] = userpayload[kp]
          }
          if(kp ==='name') {
            name = userpayload[kp]
          }
        });
      }

      const jsonParams = {
        "token": token,
        'userId':userId.length>0?userId:null,
        'meta':meta
      }

      console.log('send payload for meta signing', jsonParams)
      return signupManager.context.$axios.$post($nuxt.$apiConstants.userMetaSignin, jsonParams, headers);
    },

  }
  signupManager.context = app;

  console.log('ready for signup manager', signupManager.context);

  inject('signupManager', signupManager)
}
