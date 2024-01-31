const errorExerciseImage = require('~/assets/images/errorlogo.png');

export default (context, inject) => {

  const completeVariables = [
    "breathingScore",
    "breathingServiceSoundCode",
    "breathingServiceSoundMsg",
    "breathingServiceStatusCode",
    "breathingServiceStatusMsg",
    "breathingServiceWarningCode",
    "breathingServiceWarningMsg",
    "cyclesScore",
    "flowScore",
    "timeScore"
  ]
  const _sampleProgram = {
    "_id": "62e23c5d284d4819bc361509",
    "title": "Fuji",
    "order": 2,
    "exercises": [
      "62e3bae3c69d1c94fa07527e",
      "62d9575e7efd8ce98c4749a1",
      "62e3bae3c69d1c94fa07527e"
    ],
    "createdAt": "2022-07-22T15:46:58.602Z",
    "updatedAt": "2022-08-01T13:25:35.119Z",
    "__v": 0,
    "about": "<p>This is an about section with an <strong>image</strong>.</p><figure class=\"image\"><img src=\"https://storage.gra.cloud.ovh.net/v1/AUTH_85e67ae52bb64033a9e08434aa44899a/voicemed2-assets-bucket-dev/assets/image-1659015616921-Group-305.jpg\"></figure><p>Other text here.</p>",
    "thumbnail": "https://storage.gra.cloud.ovh.net/v1/AUTH_85e67ae52bb64033a9e08434aa44899a/voicemed2-assets-bucket-dev/assets/thumbnail-1659015596388-mountains-painting.jpg"
  };
  const _sampleExercise = {
    "_id": "62e3bae3c69d1c94fa07527e",
    "title": "Another Breathing",
    "thumbnail": null,
    "type": "recording",
    "subtype": null,
    "order": 0,
    "about": "<p>Write something here.</p>",
    "cycles": 1,
    "totalDuration": 20,
    "recordingPhases": [
      {
        "mainText": "In",
        "secondaryText": "",
        "duration": 10,
        "animationType": "growing",
        "image": null
      },
      {
        "mainText": "Out",
        "secondaryText": "",
        "duration": 10,
        "animationType": "degrowing",
        "image": null
      }
    ],
    "audio": null,
    "createdAt": "2022-07-29T10:48:03.589Z",
    "updatedAt": "2022-07-29T10:48:03.589Z",
    "__v": 0
  };
  const resManager = {
    showMDCELogos: false,
    kindRECORDING: 'recording',
    kindAUDIO: 'audio',
    kindVIDEO: 'video',
    kindPOST: 'post',
    kindHOLD: 'hold',
    kindSURVEY: 'questionnaire',
    kindQUIZ:'quiz',
    temporalTagsMultiplier: {
      "day": 1,
      "week": 7,
      "month": 30
    },
    app: null,
    longTaskTimeout: 90 * 1000, /*Lock long task to 90 seconds */
    device_code: '',
    demo: false, /*enable this to create dummy contents*/
    parseJsonDate: function (date) {
      if (date && date.indexOf('T') > -1) {
        const d = Date.parse(date);
        if (!isNaN(d)) {
          return d;
        }
      }
      return date;
    },
    setDeviceCode: function (r) {
      resManager.device_code = r;
    },
    getDeviceCode: function () {
      return resManager.device_code;
    },
    formatDate: function (date) {
      if (!isNaN(date)) {
        const d = new Date(date);
        return d.toLocaleDateString() + " " + d.toLocaleTimeString();
      }
      return date;
    },
    formatDateMonthDay: function (datetime) {
      var d = new Date(datetime),
        month = '' + d.getMonth(),
        day = '' + d.getDate();
      month = $nuxt.$t('months.short-' +month);
      return [day, month].join(' ');
    },
    formatDateYmd: function (datetime) {
      var d = new Date(datetime),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();
      if (month.length < 2)
        month = '0' + month;
      if (day.length < 2)
        day = '0' + day;
      return [year, month, day].join('-');
    },
    formatDateHi: function (datetime) {
      var d = new Date(datetime),
        hours = '' + (d.getHours()),
        minutes = '' + d.getMinutes();
      if (hours.length < 2)
        hours = '0' + hours;
      if (minutes.length < 2)
        minutes = '0' + minutes;
      return [hours, minutes].join(':');
    },
    parseExercise: function (item, tags) {
      let exercise = {
        "tags": tags,
        "createdAt": item.createdAt,
        "updatedAt": item.updatedAt,
        "order": item.order,
        "title": item.title || "",
        "about": item.about || "",
        "intro": item.intro || "",
        "questionnaire": item.questionnaire || [],
        "quiz": item.quiz || [],
        "postDescription": item.postDescription || "",
        "medicalRisks": item.medicalRisks || "",
        "internalIdCode": item.internalIdCode || "",
        "tutorialVideo": item.tutorialVideo || false,
        "tutorialVideoThumbnail": item.tutorialVideoThumbnail || false,
        "type": item.type,
        "subtype": item.subtype || null,
        "id": item._id,
        "thumb": item.thumbnail,
        "duration": item.totalDuration,
        "durationMs": item.totalDuration * 1000,
        "exercises": [],
        "completed": false,
        "steps": [],
        "cycles": item.cycles || 1,
        "audio": item.audio || null,
        "video": item.video || null,
        "videoThumbnail": item.videoThumbnail || false,
        "__v": item.__v || 0
      };
      if (exercise.createdAt) {
        exercise.createdAtDate = resManager.parseJsonDate(exercise.createdAt);
      }
      if (exercise.updatedAt) {
        exercise.updatedAtDate = resManager.parseJsonDate(exercise.updatedAt);
      }

      if (item.recordingPhases) {
        //Ripeti le recordin phases per ciascun ciclo previsto dall'app stessa.
        exercise.steps = item.recordingPhases.map((i) => {
          let iExe = i
          if (
            typeof exercise.type !== 'undefined' && exercise.type !== 'recording' &&
            typeof i.hold !== 'undefined' && i.hold !== null) {
            iExe.hold = i.hold;
          }
          return iExe
        })
        for (var i = 0; i < exercise.cycles; i++) {
          item.recordingPhases.map((exercisesListItem, indExL) => {
            let iExe = {
              "animationType": exercisesListItem.animationType,
              "duration": exercisesListItem.duration,
              "durationMs": exercisesListItem.duration * 1000,
              "maxSetDuration":  Math.min(exercisesListItem.maxSetDuration,180),
              "title": exercisesListItem.mainText || "",
              "description": exercisesListItem.secondaryText || "",
              "thumb": exercisesListItem.image,
              "iteration": (i + 1),
              "pause": false,
              "hold": false
            }
            if (
              typeof exercise.type !== 'undefined' && exercise.type !== 'recording' &&
              typeof exercisesListItem.hold !== 'undefined' && exercisesListItem.hold !== null) {
              iExe.hold = exercisesListItem.hold;
            }

            if (iExe.animationType === 'growing') {
              iExe.animation = resManager.app.$animationHelper.growing;
            } else if (iExe.animationType === 'breathe') {
              iExe.animation = resManager.app.$animationHelper.breathing;
            } else if (iExe.animationType === 'degrowth') {
              iExe.animation = resManager.app.$animationHelper.degrowing;
            } else if (iExe.animationType === 'degrowing') {
              iExe.animation = resManager.app.$animationHelper.degrowing;
            } else if (iExe.animationType === 'breathing') {
              iExe.animation = resManager.app.$animationHelper.breathing;
            } else if (iExe.animationType === 'hold') {
              iExe.animation = resManager.app.$animationHelper.hold;
            } else if (iExe.animationType === 'pulse') {
              iExe.animation = resManager.app.$animationHelper.pulse;
            }
            if (iExe.hold||exercise.subtype==='voice') {
              iExe.duration = -1;
              iExe.durationMs = -1000;
            }
            exercise.exercises.push(iExe);
            if (iExe.hold) {
              let pExe = {
                "animationType": 'hold',
                "duration": exercisesListItem.duration,
                "durationMs": exercisesListItem.duration * 1000,
                "title": 'pause',
                "description": null,
                animation: resManager.app.$animationHelper.hold,
                "thumb": null,
                "iteration": (i + 1),
                "pause": true,
                "hold": false
              }
              if (indExL === item.recordingPhases.length - 1 && i < exercise.cycles - 1) {
                exercise.exercises.push(pExe);
              } else if (indExL < (item.recordingPhases.length - 1)) {
                exercise.exercises.push(pExe);
              }
            }
          });
        }
      }
      return exercise;
    },
    parseCreator: function (item) {
      let creator = {
        avatarUrl: item.avatarUrl || "",
        createdAt: item.createdAt || "",
        description: item.description || "",
        name: item.name || "",
        updatedAt: item.updatedAt || "",
        _id: item._id || "",
        id: item._id || "",

      }
      return creator
    },
    parseWarnings: function (items) {
      let _warns = [];
      if (Array.isArray(items)) {
        items.forEach((warn) => {
          const _warn = {
            name: warn.name || "",
            warningMsg: warn.warningMsg || "",
            warningDesc: warn.warningDesc || "",
            _id: warn._id || "",
            id: warn._id || "",
          }
          _warns.push(_warn)
        })
      }
      return _warns
    },
    parseProgram: function (item) {
      let program = {
        "id": item._id,
        "title": item.title,
        "isOpen": item.isOpen,
        "order": item.order,
        "exercises": [],
        "exercises_ids": [],
        "createdAt": item.createdAt,
        "updatedAt": item.updatedAt,
        "tags": item.tags,
        "__v": item.__v || 0,
        "about": item.about || "",
        "thumb": item.thumbnail,
        "creator": item.creator || {},
        "warnings": item.warnings || [],
        "showCeIcon": item.showCeIcon || false,
        "showMdIcon": item.showMdIcon || false,
        'lastactivity_at': 0,
        "nextProgram": false
      }
      if (program.createdAt) {
        program.createdAtDate = resManager.parseJsonDate(program.createdAt);
      }
      if (program.updatedAt) {
        program.updatedAtDate = resManager.parseJsonDate(program.updatedAt);
      }
      if (program.creator) {
        program.creator = resManager.parseCreator(program.creator);
      }
      if (program.warnings) {
        program.warnings = resManager.parseWarnings(program.warnings);
      }
      if (item.exercises) {
        item.exercises.map((exeItem, exIndex) => {
          if (typeof exeItem === 'string') {
            if (program.exercises_ids.indexOf(exeItem) < 0) {
              program.exercises_ids.push(exeItem + "_" + exIndex);
            }
          } else if (typeof exeItem === 'object' && typeof exeItem.exercise === 'string') {
            if (program.exercises_ids.indexOf(exeItem.exercise) < 0) {
              program.exercises_ids.push(exeItem.exercise + "_" + exIndex);
              program.exercises.push({
                "order": exIndex,
                "id": exeItem.exercise,
                "program_index": exIndex,
                "program_id": item._id,
                "tags": exeItem.tags
              })
            }
          } else if (typeof exeItem === 'object') {
            const tmpE =
              (typeof exeItem.tags !== 'undefined' && typeof exeItem.exercise !== 'undefined')
                ? resManager.parseExercise(exeItem.exercise, exeItem.tags)
                : resManager.parseExercise(exeItem, [])
            tmpE.program_index = exIndex;
            tmpE.program_id = item._id;
            tmpE.order = exIndex;


            if (program.exercises_ids.filter((v) => v === tmpE.id + "_" + exIndex).length === 0) {
              program.exercises_ids.push(tmpE.id)
              program.exercises.push(tmpE);
            }
          }
        });
      }

      if(item.nextProgram) {
        if(Array.isArray(item.nextProgram) && item.nextProgram.length>0) {
            program.nextProgram = {
              "_id":item.nextProgram[0]._id || false,
              "id":item.nextProgram[0]._id || false,
              "title":item.nextProgram[0].title || ""
            };
        }
      }
      return program;
    },
    retrieveExercises: function () {
      const headers = {
        Authorization: resManager.app.$auth.strategy.token.get()
      }
      return new Promise((resolve, reject) => {
        resManager.app.$axiosService.$get($nuxt.$apiConstants.userBreathingExercises, headers).then((r) => {
          let exercises = [];
          if (r && Array.isArray(r)) {
            r.map((item) => {
              if (typeof item.tags !== 'undefined' && typeof item.exercise !== 'undefined') {
                const tmpE = resManager.parseExercise(item.exercise, item.tags);
                exercises.push(tmpE);
              } else {
                const tmpE = resManager.parseExercise(item, []);
                exercises.push(tmpE);
              }

            });
          }
          if (resManager.demo) {
            for (var i = 0; i < 10; i++) {
              let tmpE = resManager.parseExercise(_sampleExercise, []);
              tmpE.id = tmpE.id + Math.floor(Math.random() * 11);
              exercises.push(tmpE);
            }
          }
          resolve(exercises);
        }).catch((e) => {
          let exercises = [];
          console.error('retrieve exercises error', e);
          resManager.app.$captureException(e);
          if (resManager.demo) {
            for (var i = 0; i < 10; i++) {
              let tmpE = resManager.parseExercise(_sampleExercise, []);
              tmpE.id = tmpE.id + Math.floor(Math.random() * 11);
              exercises.push(tmpE);
            }
          }
          resolve(exercises);
        });
      });
    },
    suggestPrograms: function (tags) {
      const headers = {
        Authorization: resManager.app.$auth.strategy.token.get(),
        'Content-Type': 'application/json'
      }
      const params = {
        "tagIds": (tags)
      };
      return new Promise((resolve, reject) => {
        resManager.app.$axiosService.$post($nuxt.$apiConstants.userSuggestPrograms, params, headers).then((r) => {
          let programs = [];
          if (r && Array.isArray(r)) {
            r.map((item) => {
              const tmpE = resManager.parseProgram(item);
              programs.push(tmpE);
            });
          }

          if (resManager.demo) {
            for (var i = 0; i < 10; i++) {
              let tmpE = resManager.parseProgram(_sampleProgram);
              tmpE.id = tmpE.id + Math.floor(Math.random() * 11);
              programs.push(tmpE);
            }
          }
          resolve(programs);

        }).catch((e) => {
          let programs = [];
          console.error('retrieve programs error', e);
          resManager.app.$captureException(e);
          if (resManager.demo) {
            for (var i = 0; i < 10; i++) {
              let tmpE = resManager.parseProgram(_sampleProgram);
              tmpE.id = tmpE.id + Math.floor(Math.random() * 11);
              programs.push(tmpE);
            }
          }
          resolve(programs);
        });
      });
    },
    retrievePrograms: function () {
      const headers = {
        Authorization: resManager.app.$auth.strategy.token.get()
      }
      return new Promise((resolve, reject) => {
        resManager.app.$axiosService.$get($nuxt.$apiConstants.userBreathingPrograms, headers).then((r) => {
          let programs = [];
          if (r && Array.isArray(r)) {
            r.map((item) => {
              const tmpE = resManager.parseProgram(item);
              programs.push(tmpE);
            });
          }

          if (resManager.demo) {
            for (var i = 0; i < 10; i++) {
              let tmpE = resManager.parseProgram(_sampleProgram);
              tmpE.id = tmpE.id + Math.floor(Math.random() * 11);
              programs.push(tmpE);
            }
          }
          resolve(programs);

        }).catch((e) => {
          let programs = [];
          console.error('retrieve programs error', e);
          resManager.app.$captureException(e);
          if (resManager.demo) {
            for (var i = 0; i < 10; i++) {
              let tmpE = resManager.parseProgram(_sampleProgram);
              tmpE.id = tmpE.id + Math.floor(Math.random() * 11);
              programs.push(tmpE);
            }
          }
          resolve(programs);
        });
      });
    },
    fillProgramById: function (id, enableCache) {
      return resManager.fillProgram({"id": id, "exercises": [], "exercises_ids": []}, enableCache)
    },
    fillProgram: function (item, enableCache) {
      let useCache = typeof enableCache === 'undefined' ? true : enableCache;
      const _id = item.id || item._id;
      const headers = {
        Authorization: resManager.app.$auth.strategy.token.get()
      }
      const apiService = useCache ? resManager.app.$axiosService : resManager.app.$axios
      return new Promise((resolve, reject) => {
        apiService.$get($nuxt.$apiConstants.userBreathingProgram + "/" + _id, headers).then((r) => {
          if (r) {
            const program = resManager.parseProgram(r);
            Object.keys(program).map((pk) => {
              if (pk !== 'exercises' && pk !== 'exercises_ids') {
                item[pk] = program[pk];
              }
            });
            //Dal programma vecchio (item) recupera tutti i tags:
            /*
            item.exercises.map((exItem, exIndex) => {
              const _findIndex = program.exercises.findIndex((findItem) => findItem.id === exItem.id && findItem.program_index === exIndex);
              if (_findIndex > -1) {
                console.log('found index currentProgram')
                program.exercises[_findIndex].tags = exItem.tags;
              }
            });
            */
            item.exercises.splice(0, item.exercises.length);
            if (program.exercises) {
              program.exercises.map((exe, exeIndex) => {
                item.exercises.push(exe)
                if (item.exercises_ids.indexOf(exe.id + "_" + exeIndex) < 0) {
                  item.exercises_ids.push(exe.id + "_" + exeIndex);
                }
              })
            }
          }
          console.log('filled Program, check status', item)
          return resManager.programStatus(item, enableCache);
        }).then((item) => {
          resolve(item)
        }).catch((e) => {
          console.error('retrieve program[' + _id + '] error', e);
          resManager.app.$captureException(e);
          if (resManager.demo) {
            item.exercises_ids.map((i, idx) => {
              item.exercises.push({
                'id': i,
                'title': 'exe ' + i,
                'duration': 0,
                'thumb': errorExerciseImage,
                'completed': false
              });
            });
          }
          reject(e);
        });
      });
    },
    startExercise: function (item) {
      const _id = item.id || item._id;
      const suffix = "start"
      let completeUrl = $nuxt.$apiConstants.userBreathingExercises + "/" + _id + "/" + suffix;
      if (typeof item.program_id !== 'undefined') {
        completeUrl = $nuxt.$apiConstants.userBreathingPrograms + "/" + item.program_id + '/' + item.program_index + '/' + _id + "/" + suffix;
      }
      const headers = {
        Authorization: resManager.app.$auth.strategy.token.get()
      }
      resManager.app.$axios.$get(completeUrl, headers).then((r) => {
        console.log('start exercise sent!', r);
      }).finally(() => {

      });
    },
    completeExercise: function (item, uploadprogress, audio, additionalData = {}) {
      const _id = item.id || item._id;
      let method = item.type === resManager.kindRECORDING ? 'POST' : 'PUT';
      let suffix = item.type === resManager.kindRECORDING ? 'recordings' : 'complete';
      let completeUrl = $nuxt.$apiConstants.userBreathingExercises + "/" + _id + "/" + suffix;
      if (typeof item.program_id !== 'undefined') {
        method = "POST";
        suffix = "complete";
        completeUrl = $nuxt.$apiConstants.userBreathingPrograms + "/" + item.program_id + '/' + item.program_index + '/' + _id + "/" + suffix;
      }
      const params = new FormData();
      if (item.type === resManager.kindRECORDING && typeof audio !== 'undefined' && audio !== null) {
        params.append('audio', audio, audio.name);
      }
      const dC = resManager.getDeviceCode();
      if (dC.length > 0) {
        params.append('device_code', dC)
      }
      if(item.type) {
        params.append("type",item.type);
      }
        if(item.subtype) {
            params.append("subtype",item.subtype);
            params.append("sound_type",item.subtype);
        }

      if (typeof additionalData !== 'undefined' && additionalData !== null) {
        Object.keys(additionalData).map((v) => {
          params.append(v, JSON.stringify(additionalData[v]))
        })
        if (typeof additionalData['device_info'] !== 'undefined') {
          params.append('device_info', JSON.stringify(additionalData['device_info']));
        }
      }
      item.exerciseInfo = additionalData;
      const config = {
        method: method,
        url: completeUrl,
        data: params,
        timeout: resManager.longTaskTimeout,
        Authorization: resManager.app.$auth.strategy.token.get(),
        onUploadProgress: (progress) => {
          if (typeof uploadprogress === 'function') {
            uploadprogress(progress);
          }
        }
      }
      return new Promise((resolve, reject) => {
        resManager.app.$axios.$request(config).then((r) => {
          if (r) {
            if (r.message) {
              item.status = r.message;
            }
            completeVariables.map((ckey) => {
              if (typeof r[ckey] !== 'undefined') {
                item[ckey] = r[ckey];
              }
            })

            if (r.exercisesDone && parseInt(r.exercisesDone) > 0) {
              item.completed = true;
              item.completed_at = (new Date()).getTime();
            }
            if (r.breathingScore) {
              item.breathingScore = r.breathingScore;
            }
            if (r.medal) {
              item.medalScore = r.medal;
              item.medal = r.medal;
            }
            if (r.breathingTime) {
              item.breathingTime = r.breathingTime;
            }
            if (r.heldTime) {
              item.heldTime = r.heldTime;
            }

            if (item.type === resManager.kindRECORDING) {
              if (r.message) {
                //Compatibilità vecchio metodo
                if (r.message && r.message !== 'File uploaded successfully') {
                  item.completed = false;
                }
              }
              if (r.breathingServiceStatusCode) {
                if (r.breathingServiceStatusCode !== 200) {
                  item.completed = false;
                } else {
                  item.completed = true;
                  item.completed_at = (new Date()).getTime();
                }
              }
            }
            if (item.completed) {
              $nuxt.$root.$emit('completedExercise', item)
            }
          }
          resolve({
            exercise: item,
            response: r,
            exerciseInfo: additionalData
          });
        }).catch((e) => {
          console.error("Errore invio api [breathing_exercises]:", e);
          resManager.app.$captureException(e);
          reject(e)
        })
      });
    },
    programHasCustomTutorialByProgram: function (program) {
      //63f5dfa028d498144e665274
      if (program && program.id && program.id === '63f5dfa028d498144e665274') {
        return true;
      }
      if (program && program._id && program._id === '63f5dfa028d498144e665274') {
        return true;
      }
      return false;
    },
    programHasCustomTutorialByProgramId: function (program_id) {
      //63f5dfa028d498144e665274
      if (program_id === '63f5dfa028d498144e665274') {
        return true;
      }
      return false;
    },
    programCompleteCurrent: function (program_id) {
      const headers = {
        Authorization: resManager.app.$auth.strategy.token.get()
      }
      const jsonParams = {}
      return resManager.app.$axios.$put($nuxt.$apiConstants.userCompleteProgram + program_id, jsonParams, headers).then((r) => {
        console.log('current program completed..');
        return r
      }).catch((e) => {
        console.warn('Failed leave program?', e)
      });
    },
    programLeaveCurrent: function (program_id) {
      const headers = {
        Authorization: resManager.app.$auth.strategy.token.get()
      }
      const jsonParams = {}
      return resManager.app.$axios.$put($nuxt.$apiConstants.userLeaveProgram + program_id, jsonParams, headers).then((r) => {
        console.log('current program left..');
        resManager.app.$axiosService.$clearCache(program_id)
        return r
      }).catch((e) => {
        console.warn('Failed leave program?', e)
      }).finally(() => {
        resManager.clearProgramStatus()
      })
    },
    programJoinCurrent: function (program_id) {
      const headers = {
        Authorization: resManager.app.$auth.strategy.token.get()
      }
      const jsonParams = {}
      return resManager.app.$axios.$put($nuxt.$apiConstants.userJoinProgram + program_id, jsonParams, headers).then((r) => {
        console.log('current program Joined..');
        resManager.app.$axiosService.$clearCache(program_id)
        return r
      }).catch((e) => {
        console.warn('Failed leave program?', e)

      }).finally(() => {
        resManager.clearProgramStatus()
      })
    },
    programCurrentJoined: function () {
      const headers = {
        Authorization: resManager.app.$auth.strategy.token.get()
      }
      const jsonParams = {}
      return resManager.app.$axiosService.$get($nuxt.$apiConstants.userJoinedPrograms, jsonParams, headers).then((r) => {
        if(r && Array.isArray(r)) {
          return r.filter((item)=>{
            const iDisplay =typeof(item['display'])!=='undefined' ? item['display'] : "true";
            if(iDisplay==='true' || iDisplay==true) {
              return true;
            }
            return false;
          });
        }
        return r
      }).catch((e) => {
        console.warn('Failed leave program?', e)
      }).finally(() => {
        resManager.clearProgramStatus()
      })
    },
    programSetCurrent: function (item) {
      /** DEPRECATED **/
      const _id = item.id || item._id;
      const headers = {
        Authorization: resManager.app.$auth.strategy.token.get()
      }
      const jsonParams = {
        "currentProgramId": _id
      }
      //If put clear cache for programs:

      return resManager.app.$axios.$put($nuxt.$apiConstants.userProgramCurrent, jsonParams, headers).catch((e) => {
        resManager.app.$analytics.logEvent("error", {
          "title": 'cannot join program'
        });
      })
    },
    programGetCurrent: function () {
      /** DEPRECATED **/
      const headers = {
        Authorization: resManager.app.$auth.strategy.token.get()
      }
      return resManager.app.$axiosService.$get($nuxt.$apiConstants.userProgramCurrent, headers).then((r) => {
        if (r && r.currentProgramId) {
          console.log('got a program...try to fill it')
          return resManager.fillProgram({"id": r.currentProgramId, "exercises": [], "exercises_ids": []})
        }
        return null
      }).catch((e) => {
        resManager.app.$analytics.logEvent("error", {
          "title": 'cannot retrieve current program'
        });
      })
    },
    programReset: function (item) {

    },
    clearProgramCurrentJoinedCache: function () {
      const headers = {
        Authorization: resManager.app.$auth.strategy.token.get()
      }
      resManager.app.$axiosService.$deleteCache($nuxt.$apiConstants.userJoinedPrograms, headers);
    },
    clearProgramStatus: function (program_id) {
      const headers = {
        Authorization: resManager.app.$auth.strategy.token.get()
      }
      resManager.app.$axiosService.$deleteCache($nuxt.$apiConstants.userBreathingProgram + "/" + program_id, headers);
      resManager.app.$axiosService.$deleteCache($nuxt.$apiConstants.userBreathingPrograms + "/" + program_id + "/status", headers);
    },
    programStatus: function (item, enableCache) {
      let useCache = typeof enableCache === 'undefined' ? true : enableCache;
      const _id = item.id || item._id;
      const headers = {
        Authorization: resManager.app.$auth.strategy.token.get()
      }
      const apiService = useCache ? resManager.app.$axiosService : resManager.app.$axios
      return new Promise((resolve, reject) => {
        apiService.$get($nuxt.$apiConstants.userBreathingPrograms + "/" + _id + "/status", headers).then((r) => {
          if (r) {
            if (r.exercises) {
              console.log('got status for exercises', r.exercises, item.exercises)
              let lastActivity = 0;
              r.exercises.map((exe, eidx) => {
                let idx = eidx
                if (item.exercises[idx].id == exe._id) {
                  if (idx > -1) {
                    item.exercises[idx]['completed'] = exe.completed;
                    if (exe.performanceData) {
                      completeVariables.forEach((cVar) => {
                        if (typeof exe.performanceData[cVar] !== 'undefined') {
                          item.exercises[idx][cVar] = exe.performanceData[cVar];
                        }
                      });
                      if (exe.performanceData.createdAt) {
                        console.log('fill perdormance Data ', exe.performanceData.createdAt);
                        item.exercises[idx]['completed_at'] = resManager.parseJsonDate(exe.performanceData.createdAt);
                        lastActivity = Math.max(lastActivity, item.exercises[idx]['completed_at']);
                      }
                    }
                    if (exe.breathingScore) {
                      item.exercises[idx]['breathingScore'] = exe.breathingScore;
                    }
                    if (r.breathingTime) {
                      item.exercises[idx]['breathingTime'] = exe.breathingTime;
                    }
                    if (r.heldTime) {
                      item.exercises[idx]['heldTime'] = exe.heldTime;
                    }
                  }
                }
              });
              r.lastactivity_at = lastActivity;
            }
          }
          resolve(item)
        }).catch((e) => {
          console.error('retrieve program[' + _id + '].status error', e);
          resManager.app.$captureException(e);
          resolve(item);
        })
      });
    },
    retrievePerformedAudio: function (item) {
      const _id = item.id || item._id;
      item.isloading = true;
      const headers = {
        Authorization: resManager.app.$auth.strategy.token.get(),
        responseType: 'blob'
      }
      return new Promise((resolve, reject) => {
        console.log("request", _id)
        resManager.app.$axiosService.$get($nuxt.$apiConstants.userPerformedExercises + "/" + _id + "/recording", headers).then((r) => {
          if (r) {
            console.log('got blob data', r);
            if ($nuxt.$capacitor.getPlatform() === 'ios') {
              const reader = new FileReader();
              reader.readAsDataURL(r);
              reader.onloadend = () => {
                resolve(reader.result)
              }
            } else {
              const url = window.URL.createObjectURL(new Blob([r]));
              resolve(url);
            }
            return;
          }
          resolve(false);
        }).catch((e) => {
          console.error("Errore retrieve", e);
          resolve(false);
        })
      })
    },
    getTagInterval: function (tag) {
      let value = 0;
      if (typeof tag['unitValue'] !== 'undefined') {
        value = tag.unitValue;
      }
      if (value > 0) {
        value = value - 1
      }
      return value;
    },
    getTemporalTags: function (program) {
      if (!program) {
        return [];
      }
      if (!program.exercises) {
        return [];
      }
      let tags = {};
      program.exercises.map((item) => {
        item.tags.map((tag) => {
          if (typeof tag['kind'] !== 'undefined' && tag.kind === 'temporal') {
            tags[tag._id] = tag;
          }
        })
      });
      return Object.values(tags).sort(resManager.compareTemporalTag);
    },
    hasTemporalTags: function (program) {
      const dTags = resManager.getTemporalTags(program)
      if (dTags.length > 0) {
        return true;
      }
      return false;
    },
    computeTagInterval: function (tag) {
      let kind = "day";
      let value = 1;
      if (typeof tag['unitKind'] !== 'undefined') {
        kind = tag.unitKind;
      }
      if (typeof tag['unitValue'] !== 'undefined') {
        value = tag.unitValue;
      }
      const multiplier = resManager.temporalTagsMultiplier[kind];
      if (value > 0) {
        value = value - 1
      }
      return (86400 * multiplier * value) * 1000
    },
    compareTemporalTag: function (tagA, tagB) {
      const _valueA =
        ((typeof tagA.unitKind !== 'undefined' && typeof resManager.temporalTagsMultiplier[tagA.unitKind] !== 'undefined') ? resManager.temporalTagsMultiplier[tagA.unitKind] : 1000) *
        (typeof tagA.unitKind !== 'undefined') ? tagA.unitValue : 1000
      ;
      const _valueB =
        ((typeof tagB.unitKind !== 'undefined' && typeof resManager.temporalTagsMultiplier[tagB.unitKind] !== 'undefined') ? resManager.temporalTagsMultiplier[tagB.unitKind] : 1000) *
        (typeof tagB.unitKind !== 'undefined') ? tagB.unitValue : 1000
      ;
      if (_valueA > _valueB) {
        return 1;
      } else if (_valueA < _valueB) {
        return -1;
      }
      return 0
    },
    compareJoinedPrograms: function (programA, programB) {
      //Se il programma è completato... si vede prima il programma da completare
      if (programA.program && programB.program) {
        if (programA.program.completed && programB.program.completed === false) {
          return 1
        } else if (programB.program.completed && programA.program.completed === false) {
          return -1;
        }

        if (typeof programA.program.lastactivity_at !== 'undefined' && typeof programB.program.lastactivity_at !== 'undefined') {
          if (programA.program.lastactivity_at > programB.program.lastactivity_at) {
            return -1
          } else if (programB.program.lastactivity_at > programA.program.lastactivity_at) {
            return 1
          }
        }


        if (programA.program.overallperc && programB.program.overallperc && programA.program.overallperc > programB.program.overallperc) {
          return 1
        } else if (programA.program.overallperc && programB.program.overallperc && programA.program.overallperc < programB.program.overallperc) {
          return -1;
        }
      }
      if (programA.completed && programB.completed === false) {
        return 1
      } else if (programB.completed && programA.completed === false) {
        return -1;
      }

      //Altrimenti vai in ordine di join date
      if (programA.joined_at > programB.joined_at) {
        return -1
      } else if (programB.joined_at > programA.joined_at) {
        return 1
      }
      return 0;
    },
    resetTimeToStartOfDay: function (time) {
      let _dt = new Date(time);
      _dt.setHours(0,0,0,0)
      return _dt.getTime();
    },
  }
  resManager.app = context;
  inject('exerciseManager', resManager)
};
