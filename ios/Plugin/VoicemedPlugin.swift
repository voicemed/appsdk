import Foundation
import AVFoundation
import Capacitor


struct AudioLevels {
    let level: Float
    let peakLevel: Float
}

// The protocol for the object that provides peak and average power levels to adopt.
protocol AudioLevelProvider {
    var levels: AudioLevels { get }
}

@objc(VoicemedPlugin)
public class VoicemedPlugin: CAPPlugin {

    public let identifier = "VoicemedPlugin"
    public let jsName = "Voicemed"
    private var voicemedplugin: VoicemedPlugin?

    private let API_authenticationSuffix = "v2/auth/login";
    private let API_listProgramsSuffix = "v2/user/programs";
    private let API_completeExerciseSuffix = "v2/user/breathing_exercises";
    //let completeUrl = $nuxt.$apiConstants.userBreathingExercises + "/" + _id + "/" + suffix;
    /*
        let method = item.type === resManager.kindRECORDING ? 'POST' : 'PUT';
        let suffix = item.type === resManager.kindRECORDING ? 'recordings' : 'complete';
        let completeUrl = $nuxt.$apiConstants.userBreathingExercises + "/" + _id + "/" + suffix;
        if (typeof item.program_id !== 'undefined') {
         method = "POST";
         suffix = "complete";
         completeUrl = $nuxt.$apiConstants.userBreathingPrograms + "/" + item.program_id + '/' + item.program_index + '/' + _id + "/" + suffix;
        }
     */
    private var appKey = ""
    private var appUrl = ""
    private var environment = ""
    private var preferences = Preferences(with: PreferencesConfiguration())
    private var currentUrl = "";
    private var currentExerciseView:WKWebView? = nil

    override public func load() {
        if let view = bridge?.viewController?.view {
            let config = voicemedConfig()
            appKey = config.appKey ?? ""
            environment = config.environment ?? "staging"
            if (appKey.isEmpty) {
                print("Error appKey is mandatory \(appKey)")
            } else {
                print("Voicemed inited for appKey: \(appKey)")
            }
            if (environment.compare("staging") != .orderedSame && environment.compare("production") != .orderedSame) {
                print("Error environment is not valid")
            }else {
                print("Voicemed environment: \(environment)")
            }
            if (environment.compare("staging") == .orderedSame) {
                appUrl = "https://sandbox-api-2.voicemed.io/";
            } else if (environment.compare("production") == .orderedSame) {
                appUrl = "https://api-2.voicemed.io/";
            }
        }
    }
    private func voicemedConfig() -> VoicemedPluginConfig {
        var config = VoicemedPluginConfig()

        print(getConfig().getConfigJSON().debugDescription)

        if let appKey = getConfig().getString("appKey") {
            print(appKey)
            config.appKey = appKey
        }
        if let environment = getConfig().getString("environment") {
            switch environment.lowercased() {
            case "production":
                config.environment = "production"
            default:
                config.environment = "staging"
            }
        }
        return config
    }


    @objc func echo(_ call: CAPPluginCall) {
        call.resolve(ResponseGenerator.successResponse())
    }
    @objc func authenticateByToken(_ call: CAPPluginCall) {
        call.resolve(ResponseGenerator.successResponse())
    }

    @objc func authenticateUser(_ call: CAPPluginCall) {
        let _extID = call.getString("externalID", "")

        if _extID.isEmpty {
            call.reject("ExternalID must be filled")
        }
        var _usermeta = [String:Any]()

        if let usermeta = call.getObject("usermeta") {
            if let age = usermeta["age"] as? Int {
                _usermeta.updateValue(age, forKey: "age")
            }
            if let height = usermeta["height"] as? Int {
                _usermeta.updateValue(height, forKey: "height")
            }
            if let weight = usermeta["weight"] as? Int {
                _usermeta.updateValue(weight, forKey: "weight")
            }
            if let sex = usermeta["sex"] as? String {
                _usermeta.updateValue(sex, forKey: "sex")
            }
        }

        //Il primo metodo serve solo per verificare che l'oggetto sia un json valido
        if let _metajson = try? JSONSerialization.data(withJSONObject: _usermeta) {
            var bodyParts = URLComponents()
            let jsonData = VoicemedPlugin.stringify(json: _usermeta)
            var queryItems: [URLQueryItem] = bodyParts.queryItems ??  []
            queryItems.append(URLQueryItem(name: "externalId", value: _extID ))
            if ( jsonData.compare("{}") != .orderedSame) {
                queryItems.append(URLQueryItem(name: "meta", value: jsonData))
            }
            bodyParts.queryItems = queryItems
            let postDataString =  bodyParts.query
            let postData = postDataString?.data(using: .utf8)
            print("Pronto \(String(describing: postDataString))")
            //Add the new restApi path:
            let _url = "\(appUrl)\(API_authenticationSuffix)"
            let url = URL(string: _url)!
            var request = URLRequest(url: url)
            request.addValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")
            request.addValue(appKey, forHTTPHeaderField: "api-key")
            request.httpMethod = "POST"
            request.httpBody = postData
            let task = URLSession.shared.dataTask(with: request) { data, response, error in
                guard let data = data, error == nil else {
                    print(error?.localizedDescription ?? "No data")
                    call.reject(error?.localizedDescription ?? "No data")
                    return
                }
                let responseJSON = try? JSONSerialization.jsonObject(with: data, options: [])
                if let responseJSON = responseJSON as? [String: Any] {
                    if let token = responseJSON["access_token"] {
                        self.preferences.set(token as! String, for: "token")
                    }
                    call.resolve(responseJSON)
                }
            }
            task.resume()
            return
        } else {
            call.reject("Something whent wrong")
        }
    }

    @objc func listExercises(_ call: CAPPluginCall) {
        var _token = call.getString("token", preferences.get(by: "token") ?? "")
        var _full = call.getBool("full", true)
        if _token.isEmpty {
            //Se non è passato via json, usa quello conservato
            _token = self.preferences.get(by: "token") ?? ""
        }
        if _token.isEmpty {
            call.reject("Token must be valid, please ensure you have completed the authenticateUser method")
            return
        }
        //Add the new restApi path:
        let url = URL(string: "\(appUrl)\(API_listProgramsSuffix)")!
        var request = URLRequest(url: url)
        //Authenticate request:
        request.addValue(appKey, forHTTPHeaderField: "api-key")
        request.addValue("Bearer \(_token)", forHTTPHeaderField: "Authorization")
        //Method
        request.httpMethod = "GET"
        
        
        let task = URLSession.shared.dataTask(with: request) { data, response, error in
            guard let data = data, error == nil else {
                print(error?.localizedDescription ?? "No data")
                call.reject(error?.localizedDescription ?? "No data")
                return
            }
            var responseJSON = try? JSONSerialization.jsonObject(with: data, options: [])
            if let _responseJSON = responseJSON as? NSArray {
                var challenges:NSMutableArray = []
                if(_full) {
                    Task {
                        for case let challenge as [String:Any] in _responseJSON {
                            let _newChallenge = await try self.retrieveChallenge(token: _token, challenge: challenge) as [String:Any]
                            if(_newChallenge != nil) {
                                challenges.add(_newChallenge)
                            } else {
                                challenges.add(challenge)
                            }
                        }
                        responseJSON = [
                            "challenges":challenges
                        ]
                        if let responseJSON = responseJSON as? [String: Any] {
                            call.resolve(responseJSON)
                        } else {
                            print("Non sappiamo oggettto")
                            call.reject("Errore")
                        }
                    }
                } else {
                    for case let challenge as [String:Any] in _responseJSON {
                        challenges.add(challenge)
                    }
                    if let responseJSON = responseJSON as? [String: Any] {
                        call.resolve(responseJSON)
                    } else {
                        print("Non sappiamo oggettto")
                        call.reject("Errore")
                    }
                }


            }
        }
        task.resume()
    }
    func retrieveChallenge( token : String, challenge : [String:Any]) async throws -> [String:Any] {
        //Add the new restApi path:
        let stringID = challenge["_id"] ?? ""
        let url = URL(string: "\(appUrl)\(API_listProgramsSuffix)/\(stringID)")!
        var request = URLRequest(url: url)
        //Authenticate request:
        request.addValue(appKey, forHTTPHeaderField: "api-key")
        request.addValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        request.httpMethod = "GET"
        let (data, _) = try await URLSession.shared.data(for: request)
        let responseJSON = try? JSONSerialization.jsonObject(with: data, options: [])
        return responseJSON as! [String:Any]
    }
    @objc func startExercise(_ call: CAPPluginCall) {
        var _token = call.getString("token", preferences.get(by: "token") ?? "")
        let _id = call.getString("id", "")
        let _program_id = call.getString("program_id", "")
        let _program_index = call.getInt("program_index", 0)
        if _token.isEmpty {
            _token = self.preferences.get(by: "token") ?? ""
        }
        if _token.isEmpty {
            call.reject("Token must be valid, please ensure you have completed the authenticateUser method")
            return
        }
        if _token.isEmpty {
            call.reject("Token must be valid, please ensure you have completed the authenticateUser method")
            return
        }
        if _id.isEmpty {
            call.reject("Exercise ID must be valid")
            return
        }
        if _program_id.isEmpty {
            call.reject("Program ID must be valid")
            return
        }
        if _program_index<0 {
            call.reject("Program Index must be valid")
            return
        }
        
        var locales = Locale.preferredLanguages.first ?? "en"
        if locales.lowercased().contains("it") {
            locales = "it"
        } else {
            locales = "en"
        }

        let json :[String:Any] = ["exercise_id":_id,"program_id":_program_id,"program_index":_program_index]
            if let webview = bridge?.webView, let _baseUrl = bridge?.config.localURL {
                DispatchQueue.main.async {
                    webview.evaluateJavaScript("document.location", completionHandler: { (object, error) in
                        if error == nil {
                                print(object)
                            self.currentUrl = object as? String ?? ""
                            }
                    })
                    let final = "\(_baseUrl)/voicemed-sdk/index.html?id=\(_id)&pid=\(_program_id)&px=\(_program_index)&locale=\(locales)"
                    let jsonData = VoicemedPlugin.stringify(json: json)
                    webview.evaluateJavaScript("window.currentExercise=\(jsonData);window.currentVMToken='\(_token)';window.currentVMKey='\(self.appKey)';window.currentVMUrl='\(self.appUrl)'")
                    let createFullScreenIframe = """
                    if(document.getElementById("vmiframe_handler")) {
                        document.getElementById("vmiframe_handler").remove();
                    }
                        window.capacitorHandler = Capacitor;
                        window.voiceMedHandler  = Capacitor.Plugins.Voicemed;
                        window.deviceHandler  = Capacitor.Plugins.Device;
                        window.browserHandler  = Capacitor.Plugins.Browser;
                        window.iFrameVM = document.createElement("IFRAME");
                        iFrameVM.id = "vmiframe_handler";
                        iFrameVM.classList.add('vmiframe_handler');
                        iFrameVM.style.position='absolute';
                        iFrameVM.style.left='0px';
                        iFrameVM.style.top='0px';
                        iFrameVM.style.width='100vw';
                        iFrameVM.style.height='100vh';
                        iFrameVM.style.zIndex=99999;
                        iFrameVM.src = "\(final)";
                        document.querySelector('body').appendChild(iFrameVM);
                    """
                    webview.evaluateJavaScript(createFullScreenIframe, completionHandler: { (object, error) in
                        if error == nil {
                                print(object)
                            }
                    })
                    call.resolve(ResponseGenerator.successResponse())
                 }
                return
            }
            call.reject("Cannot find main View controller");


    }
    @objc func startChallenge(_ call: CAPPluginCall) {
            var _token = call.getString("token", preferences.get(by: "token") ?? "")
            let _program_id = call.getString("program_id", "")
            if _token.isEmpty {
                _token = self.preferences.get(by: "token") ?? ""
            }
            if _token.isEmpty {
                call.reject("Token must be valid, please ensure you have completed the authenticateUser method")
                return
            }
            if _token.isEmpty {
                call.reject("Token must be valid, please ensure you have completed the authenticateUser method")
                return
            }
            if _program_id.isEmpty {
                call.reject("Program ID must be valid")
                return
            }
        
            var locales = Locale.preferredLanguages.first ?? "en"
            if locales.lowercased().contains("it") {
                locales = "it"
            } else {
                locales = "en"
            }

            let json :[String:Any] = ["program_id":_program_id, "command":"challenge"]
                if let webview = bridge?.webView, let _baseUrl = bridge?.config.localURL {
                    DispatchQueue.main.async {
                        webview.evaluateJavaScript("document.location", completionHandler: { (object, error) in
                            if error == nil {
                                    print(object)
                                self.currentUrl = object as? String ?? ""
                                }
                        })
                        let final = "\(_baseUrl)/voicemed-sdk/index.html?pid=\(_program_id)&pmode=challenge&locale=\(locales)"
                        let jsonData = VoicemedPlugin.stringify(json: json)
                        webview.evaluateJavaScript("window.currentChallenge=\(jsonData);window.currentVMToken='\(_token)';window.currentVMKey='\(self.appKey)';window.currentVMUrl='\(self.appUrl)'")
                        let createFullScreenIframe = """
                        if(document.getElementById("vmiframe_handler")) {
                            document.getElementById("vmiframe_handler").remove();
                        }
                            window.capacitorHandler = Capacitor;
                            window.voiceMedHandler  = Capacitor.Plugins.Voicemed;
                            window.deviceHandler  = Capacitor.Plugins.Device;
                            window.browserHandler  = Capacitor.Plugins.Browser;
                            window.iFrameVM = document.createElement("IFRAME");
                            iFrameVM.id = "vmiframe_handler";
                            iFrameVM.classList.add('vmiframe_handler');
                            iFrameVM.style.position='absolute';
                            iFrameVM.style.left='0px';
                            iFrameVM.style.top='0px';
                            iFrameVM.style.width='100vw';
                            iFrameVM.style.height='100vh';
                            iFrameVM.style.zIndex=99999;
                            iFrameVM.src = "\(final)";
                            document.querySelector('body').appendChild(iFrameVM);
                        """
                        webview.evaluateJavaScript(createFullScreenIframe, completionHandler: { (object, error) in
                            if error == nil {
                                    print(object)
                                }
                        })
                        call.resolve(ResponseGenerator.successResponse())
                     }
                    return
                }
                call.reject("Cannot find main View controller");


        }
    @objc func closeExercise(_ call: CAPPluginCall) {
        if let webview = bridge?.webView, let _baseUrl = bridge?.config.localURL {
            DispatchQueue.main.async {
                let closeFullScreenIframe = """
                if(document.getElementById("vmiframe_handler")) {
                    document.getElementById("vmiframe_handler").remove();
                }
                """
                webview.evaluateJavaScript(closeFullScreenIframe, completionHandler: { (object, error) in
                    if error == nil {
                            print(object)
                        }
                })
                call.resolve(ResponseGenerator.successResponse())
            }

        }

    }

    @objc func finishExercise(_ call: CAPPluginCall) {
        //Fire event!
        self.notifyListeners("finishedExercise", data: call.dictionaryRepresentation as! [String : Any])
    }
    @objc func finishChallenge(_ call: CAPPluginCall) {
        //Fire event!
        self.notifyListeners("finishedChallenge", data: call.dictionaryRepresentation as! [String : Any])
    }

    private var customMediaRecorder: CustomMediaRecorder? = nil

    @objc func canDeviceVoiceRecord(_ call: CAPPluginCall) {
        call.resolve(ResponseGenerator.successResponse())
    }

    @objc func maxVolume(_ call: CAPPluginCall) {
          call.resolve([
              "result":false,
              "reason":"not supported"
          ])
    }
    @objc func revertVolume(_ call: CAPPluginCall) {
          call.resolve([
              "result":false,
              "reason":"not supported"
          ])
    }
    @objc func openAppStore(_ call: CAPPluginCall) {
        DispatchQueue.global().async {
            do {
                let date = Date.init().timeIntervalSince1970
                guard
                    let info = Bundle.main.infoDictionary,
                    let bundleId = info["CFBundleIdentifier"] as? String,
                    var lookupUrl = URL(string: "https://itunes.apple.com/lookup?bundleId=\(bundleId)&date=\(date)")
                else {
                    call.reject("Invalid bundle info provided")
                    return
                }
                if let country = call.getString("country") {
                    lookupUrl = URL(string: "https://itunes.apple.com/lookup?bundleId=\(bundleId)&country=\(country)&date=\(date)")!
                }
                let data = try Data(contentsOf: lookupUrl)
                guard
                    let json = try JSONSerialization.jsonObject(with: data, options: [.allowFragments]) as? [String: Any],
                    let result = (json["results"] as? [Any])?.first as? [String: Any],
                    let trackId = result["trackId"] as? Int,
                    let storeUrl = URL(string: "itms-apps://itunes.apple.com/app/id\(trackId)")
                else {
                    call.reject("Required app information could not be fetched")
                    return
                }
                DispatchQueue.main.async {
                    UIApplication.shared.open(storeUrl) { (_) in
                        call.resolve()
                    }
                }
            } catch let error {
                call.reject(error.localizedDescription)
            }
        }
    }

    @objc func openPermissionPanel(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            UIApplication.shared.open(URL(string: UIApplication.openSettingsURLString)!, options: [:]) { result in
                self.checkMicPerm(call)
            }
        }

    }


@objc func checkMicPerm(_ call: CAPPluginCall) {
    AVAudioSession.sharedInstance().requestRecordPermission { granted in
        if granted {
            call.resolve(ResponseGenerator.resultResponse())
        } else {
            call.resolve([
                "result":false,
                "reason":"denied",
                "state":"denied",
                "prompt":false
            ])
        }
    }
}
@objc func checkWholePermissions(_ call: CAPPluginCall) {
   let audio = AVAudioSession.sharedInstance().recordPermission == AVAudioSession.RecordPermission.granted ? "granted" : "prompt"
    let storage = "granted"
    let responseData = PermissionStatusNoCam(
        microphone: audio,
        storage: storage
    )
    call.resolve(responseData.toDictionary())
}
@objc func requestWholePermissions(_ call: CAPPluginCall) {
    let permissions = [/*"camera",*/"microphone"]
        let group = DispatchGroup()
    if permissions.contains("microphone") {
        group.enter()
        AVAudioSession.sharedInstance().requestRecordPermission { _ in
            group.leave()
        }
    }
    group.notify(queue: DispatchQueue.main) {
        let audio = AVAudioSession.sharedInstance().recordPermission == AVAudioSession.RecordPermission.granted
        let storage = true
        let responseData = PermissionDataNoCam(
            /*camera: camera,*/
            microphone: audio,
            storage: storage
        )

        call.resolve(responseData.toDictionary())

    }
}
@objc public override func requestPermissions(_ call: CAPPluginCall) {
    let permissions = [/*"camera",*/"microphone"]
    let group = DispatchGroup()
    if permissions.contains("microphone") {
        group.enter()
        AVAudioSession.sharedInstance().requestRecordPermission { granted in
            group.leave()
        }
    }
    group.notify(queue: DispatchQueue.main) {
        let audio = AVAudioSession.sharedInstance().recordPermission == AVAudioSession.RecordPermission.granted
        /*let camera = AVCaptureDevice.authorizationStatus(for: .video) == .authorized*/
        let storage = true
        let responseData = PermissionDataNoCam(
            /*camera: camera,*/
            microphone: audio,
            storage: storage
        )

        call.resolve(ResponseGenerator.dataResponse(responseData.toDictionary()))
    }
}

@objc func requestAudioRecordingPermission(_ call: CAPPluginCall) {
    AVAudioSession.sharedInstance().requestRecordPermission { granted in
        if granted {
            call.resolve(ResponseGenerator.successResponse())
        } else {
            call.resolve(ResponseGenerator.failResponse())
        }
    }
}

@objc func hasAudioRecordingPermission(_ call: CAPPluginCall) {
    call.resolve(ResponseGenerator.fromBoolean(doesUserGaveAudioRecordingPermission()))
}


@objc func startRecording(_ call: CAPPluginCall) {

    let useAgc = call.getBool("useAGC", false)

    if(!doesUserGaveAudioRecordingPermission()) {
        call.reject(Messages.MISSING_PERMISSION)
        return
    }

    if(customMediaRecorder != nil) {
        call.reject(Messages.ALREADY_RECORDING)
        return
    }

    customMediaRecorder = CustomMediaRecorder()

    if(customMediaRecorder == nil) {
        call.reject(Messages.CANNOT_RECORD_ON_THIS_PHONE)
        return
    }
    customMediaRecorder?.setAgc(agc: useAgc)


    customMediaRecorder?.attachObserver(eventName: "Airlyn", action: self.gotPeakMeters)
    customMediaRecorder?.attachMicObserver(eventName: "Airlyn", action: self.gotMicInfo)

    let successfullyStartedRecording = customMediaRecorder!.startRecording()
    if successfullyStartedRecording == false {
        call.reject(Messages.CANNOT_RECORD_ON_THIS_PHONE)
    } else {
        call.resolve(ResponseGenerator.successResponse())
    }
}
func gotMicInfo(information:Any?) {
    let info:NSDictionary = information as! NSDictionary
    self.notifyListeners("airlynUpdateMic", data: ["micName":info,"micSensitivity":0.0])
}
func gotPeakMeters(information:Any?) {
    if information is AudioLevels {
        let pLevel:AudioLevels = information as! AudioLevels
        self.notifyListeners("airlynUpdateMeters", data: ["peakPower":pLevel.peakLevel,"averagePower":pLevel.level])
    } else if information is PowerMeter.PowerLevels {
        let pLevel:PowerMeter.PowerLevels = information as! PowerMeter.PowerLevels
        self.notifyListeners("airlynUpdateMeters", data: ["peakPower":pLevel.peak,"averagePower":pLevel.average])
    } else {
        self.notifyListeners("airlynUpdateMeters", data: ["peakPower":information,"averagePower":information])
    }
}

@objc func stopRecording(_ call: CAPPluginCall) {
    customMediaRecorder?.detatchObservers()
    let _retrieveCAF = call.getBool("returnCAF", false)

    if(customMediaRecorder == nil) {
        call.reject(Messages.RECORDING_HAS_NOT_STARTED)
        return
    }
    customMediaRecorder?.stopRecording()
    let audioFileUrl = customMediaRecorder?.getOutputFile()
    if(audioFileUrl == nil) {
        customMediaRecorder = nil
        call.reject(Messages.FAILED_TO_FETCH_RECORDING)
        return
    }
    var recordData = RecordData(
        _recordDataBase64: readFileAsBase64(audioFileUrl),
        _mimeType: "audio/wav",
        _msDuration: getMsDurationOfAudioFile(audioFileUrl)
    )
    if(_retrieveCAF) {
        let tmpAudioFile = customMediaRecorder?.getTmpOutputFile()
        if(tmpAudioFile != nil) {
            let cafData = RecordData(
                _recordDataBase64: readFileAsBase64(tmpAudioFile),
                _mimeType: "audio/x-caf",
                _msDuration: getMsDurationOfAudioFile(tmpAudioFile)
            )
            recordData.setCAFFile(data: cafData)
            recordData.returnCafFile(ret: true)
        }
    }
    customMediaRecorder = nil
    if recordData.recordDataBase64 == nil || recordData.msDuration < 0 {
        call.reject(Messages.FAILED_TO_FETCH_RECORDING)
    } else {
        call.resolve(ResponseGenerator.dataResponse(recordData.toDictionary()))
    }
}

@objc func pauseRecording(_ call: CAPPluginCall) {
    if(customMediaRecorder == nil) {
        call.reject(Messages.RECORDING_HAS_NOT_STARTED)
    } else {
        call.resolve(ResponseGenerator.fromBoolean(customMediaRecorder?.pauseRecording() ?? false))
    }
}

@objc func resumeRecording(_ call: CAPPluginCall) {
    if(customMediaRecorder == nil) {
        call.reject(Messages.RECORDING_HAS_NOT_STARTED)
    } else {
        call.resolve(ResponseGenerator.fromBoolean(customMediaRecorder?.resumeRecording() ?? false))
    }
}

@objc func getCurrentStatus(_ call: CAPPluginCall) {
    if(customMediaRecorder == nil) {
        call.resolve(ResponseGenerator.statusResponse(CurrentRecordingStatus.NONE))
    } else {
        call.resolve(ResponseGenerator.statusResponse(customMediaRecorder?.getCurrentStatus() ?? CurrentRecordingStatus.NONE))
    }
}

func doesUserGaveAudioRecordingPermission() -> Bool {
    return AVAudioSession.sharedInstance().recordPermission == AVAudioSession.RecordPermission.granted
}

func readFileAsBase64(_ filePath: URL?) -> String? {
    if(filePath == nil) {
        return nil
    }

    do {
        let fileData = try Data.init(contentsOf: filePath!)
        let fileStream = fileData.base64EncodedString(options: NSData.Base64EncodingOptions.init(rawValue: 0))
        return fileStream
    } catch {}

    return nil
}

func getMsDurationOfAudioFile(_ filePath: URL?) -> Int {
    if filePath == nil {
        return -1
    }
    return Int(CMTimeGetSeconds(AVURLAsset(url: filePath!).duration) * 1000)
}


/**Preferences **/
@objc func preferenceConfigure(_ call: CAPPluginCall) {
        let group = call.getString("group")
        let configuration: PreferencesConfiguration

        if let group = group {
            if group == "NativeStorage" {
                configuration = PreferencesConfiguration(for: .cordovaNativeStorage)
            } else {
                configuration = PreferencesConfiguration(for: .named(group))
            }
        } else {
            configuration = PreferencesConfiguration()
        }

        preferences = Preferences(with: configuration)
        call.resolve()
    }

    @objc func preferenceGet(_ call: CAPPluginCall) {
        guard let key = call.getString("key") else {
            call.reject("Must provide a key")
            return
        }

        let value = preferences.get(by: key)

        call.resolve([
            "value": value as Any
        ])
    }

    @objc func preferenceSet(_ call: CAPPluginCall) {
        guard let key = call.getString("key") else {
            call.reject("Must provide a key")
            return
        }
        let value = call.getString("value", "")

        preferences.set(value, for: key)
        call.resolve()
    }

    @objc func preferenceRemove(_ call: CAPPluginCall) {
        guard let key = call.getString("key") else {
            call.reject("Must provide a key")
            return
        }

        preferences.remove(by: key)
        call.resolve()
    }

    @objc func preferenceKeys(_ call: CAPPluginCall) {
        let keys = preferences.keys()

        call.resolve([
            "keys": keys
        ])
    }

    @objc func preferenceClear(_ call: CAPPluginCall) {
        preferences.removeAll()
        call.resolve()
    }

    @objc func preferenceMigrate(_ call: CAPPluginCall) {
        var migrated: [String] = []
        var existing: [String] = []
        let oldPrefix = "_cap_"
        let oldKeys = UserDefaults.standard.dictionaryRepresentation().keys.filter { $0.hasPrefix(oldPrefix) }

        for oldKey in oldKeys {
            let key = String(oldKey.dropFirst(oldPrefix.count))
            let value = UserDefaults.standard.string(forKey: oldKey) ?? ""
            let currentValue = preferences.get(by: key)

            if currentValue == nil {
                preferences.set(value, for: key)
                migrated.append(key)
            } else {
                existing.append(key)
            }
        }

        call.resolve([
            "migrated": migrated,
            "existing": existing
        ])
    }

    static func stringify(json: Any, prettyPrinted: Bool = false) -> String {
        var options: JSONSerialization.WritingOptions = []
        if prettyPrinted {
          options = JSONSerialization.WritingOptions.prettyPrinted
        }

        do {
          let data = try JSONSerialization.data(withJSONObject: json, options: options)
          if let string = String(data: data, encoding: String.Encoding.utf8) {
            return string
          }
        } catch {
          print(error)
        }

        return ""
    }

}
