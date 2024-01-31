//
//  CustomMediaRecorder.swift
//  App
//
//  Created by Francesco Lo Truglio on 25/08/22.
//

import Foundation
import AVFoundation
import AVFoundation.AVFAudio
import Accelerate



class CustomMediaRecorder {
    
    private var recordingSession: AVAudioSession!
    private var audioRecorder: AVAudioRecorder!
    private var audioFilePath: URL!
    private var tmp_audioFilePath: URL!
    private var originalRecordingSessionCategory: AVAudioSession.Category!
    private var status = CurrentRecordingStatus.NONE
    private var useAgc = false
    private var audioEngine : AVAudioEngine!
    private var outputFile : AVAudioFile?
    
    
    public private(set) var recordIOFormat: AVAudioFormat!
    public private(set) var voiceIOFormat: AVAudioFormat!
    public private(set) var outputIOFormat: AVAudioFormat!
    public private(set) var voiceIOPowerMeter = PowerMeter()
    
    private var meterTableAvarage = MeterTable()
    private var meterTablePeak = MeterTable()
    
    let LEVEL_LOWPASS_TRIG:Float32 = 0.30
    var averagePower:Float = 0
    
    private var observers = NSMutableArray()
    private var micObservers = NSMutableArray()
    
    public func setAgc(agc :Bool) {
        useAgc = agc
    }
    
    public func attachObserver(eventName:String, action: @escaping ((Any?)->())) {
        let newListener = EventListenerAction(callback: action);
        observers.add(newListener)
    }
    public func detatchObservers() {
        observers.removeAllObjects()
    }
    public func attachMicObserver(eventName:String, action: @escaping ((Any?)->())) {
        let newListener = MicListenerAction(callback: action);
        micObservers.add(newListener)
    }
    public func detatchMicObservers() {
        micObservers.removeAllObjects()
    }

    func notifyMic(data: Any) {
        for actionObject in micObservers {
            if let actionToPerform = actionObject as? MicListenerAction {
                if let methodToCall = actionToPerform.actionExpectsInfo {
                    methodToCall(data);
                }
                else if let methodToCall = actionToPerform.action {
                    methodToCall();
                }
            }
        }
    }
    func notify(data: Any) {
        //Convert dbValue to meterTable:
        let audioLevels:AudioLevels
        let _power:PowerMeter.PowerLevels
        if (data == nil ) {
            audioLevels = AudioLevels(level: 0.0, peakLevel: 0.0)
        } else {
            _power = data as! PowerMeter.PowerLevels
            audioLevels = AudioLevels(level: meterTableAvarage.valueForPower(_power.average),
                                      peakLevel: meterTablePeak.valueForPower(_power.peak))
        }
        
        for actionObject in observers {
            if let actionToPerform = actionObject as? EventListenerAction {
                if let methodToCall = actionToPerform.actionExpectsInfo {
                    methodToCall(audioLevels);
                }
                else if let methodToCall = actionToPerform.action {
                    methodToCall();
                }
            }
        }
    }
    
    
    private let settings = [
        AVFormatIDKey: Int(kAudioFormatLinearPCM),
        AVSampleRateKey: 44100,
        AVNumberOfChannelsKey: 1,
        AVEncoderAudioQualityKey: AVAudioQuality.high.rawValue
    ]
    private let kSampleRate = 44100
    private let kNumberOfChannels = 1
    
    private func getDirectoryToSaveAudioFile() -> URL {
        return URL(fileURLWithPath: NSTemporaryDirectory(), isDirectory: true)
    }
    
    enum AudioEngineError: Error {
        case bufferRetrieveError
        case fileFormatError
        case audioFileNotFound
    }
    
    
    public func startRecording() -> Bool {
        averagePower = 0
        do {
            tmp_audioFilePath = getDirectoryToSaveAudioFile().appendingPathComponent("\(UUID().uuidString).caf")
            audioFilePath = getDirectoryToSaveAudioFile().appendingPathComponent("\(UUID().uuidString).wav")
            
            recordingSession = AVAudioSession.sharedInstance()
            
            
            /* Start AuEngine*/
            audioEngine  = AVAudioEngine()
            /* tutto pronto, avvia engine e sessione*/
            let input = audioEngine.inputNode //Ottieni il nodo input
            
            print("Preferred sample rate: \(recordingSession.preferredSampleRate)")
            
            /* Prepara formati per la registrazione */
            recordIOFormat = input.outputFormat(forBus: 0)
            
            outputIOFormat = AVAudioFormat(
                commonFormat: .pcmFormatFloat32, sampleRate: Double(kSampleRate), channels: AVAudioChannelCount(kNumberOfChannels), interleaved: true
            )
            voiceIOFormat = AVAudioFormat(
                commonFormat: .pcmFormatFloat32, sampleRate: Double(kSampleRate), channels: AVAudioChannelCount(kNumberOfChannels), interleaved: false
            )
            
            print("Input IO format: \(String(describing: recordIOFormat)), \(String(describing: recordIOFormat.settings))")
            print("Output IO format: \(String(describing: outputIOFormat)), \(String(describing: outputIOFormat.settings))")
            print("voice SampleRate: \(recordIOFormat.sampleRate), Canali: \(outputIOFormat.channelCount)")
            /**init audio session**/
            originalRecordingSessionCategory = recordingSession.category
            //Lascia registrazione in modalità play e record, per poter sentire l'audio da iphone (immediatamente)
            try recordingSession.setCategory(AVAudioSession.Category.playAndRecord)
            
            //Setta il sistema di misurazione al minimo, così da avere l'AGC staccato
            if(useAgc == false) {
                try recordingSession.setMode(AVAudioSession.Mode.measurement)
            } else {
                try recordingSession.setMode(AVAudioSession.Mode.default)
            }
            
            if #available(iOS 14.5, *) {
                try recordingSession.setPrefersNoInterruptionsFromSystemAlerts(true)
            } else {
                // Fallback on earlier versions
            }
            
            /* Set recording ratio */
            //try recordingSession.setPreferredSampleRate(Double(kSampleRate))
            
            
            //let audioUnit = input.audioUnit!
            print("Verifica AGC: \(input.isVoiceProcessingAGCEnabled)")
            if( useAgc == true) {
                do {
                    try input.setVoiceProcessingEnabled(true)
                } catch {
                    print("could not enable voice processing \(error)")
                }
            }
            print("Verifica AGC[POST]: \(input.isVoiceProcessingAGCEnabled)")

            input.installTap(onBus: 0, bufferSize: 256, format: recordIOFormat) { buffer,time in
                if(self.status == CurrentRecordingStatus.RECORDING) {
                    do {
                        try self.outputFile?.write(from: buffer)
                    } catch {
                        print("impossibile scrivere file audio... \(error)")
                    }
                    self.updateMeters(buffer: buffer,frameLen: 256)
                    //self.voiceIOPowerMeter.process(buffer: buffer)
                    //Eventuali misurazioni del peak o dei livelli vanno qui...
                } else {
                    //self.voiceIOPowerMeter.processSilence()
                }
            }
            outputFile = try AVAudioFile(forWriting: tmp_audioFilePath, settings: recordIOFormat.settings)
            //audioRecorder = try AVAudioRecorder(url: audioFilePath, settings: settings)
            //audioRecorder.record()
            audioEngine.prepare()
            
            if(recordingSession.isInputAvailable) {
                //There is an input available!
                let currentRoute = recordingSession.inputDataSource
                print("Got mic? \(currentRoute.debugDescription)")
                print("Got ids? \(recordingSession.inputDataSources?.debugDescription)")
                for inputS in recordingSession.currentRoute.inputs {
                    print("Got input: \(inputS.debugDescription), UID? \(inputS.description), UID? \(inputS.uid), Port? \(inputS.portName), DS? \(inputS.dataSources?.debugDescription)")
                    
                    updateMicInfo(info: "Name: \(inputS.uid), Port: \(inputS.portName), DS \(inputS.dataSources?.debugDescription)", sensitivity: 0.0)
                }
                
                
            }
            
            print("audioEngine ready to record")
            try recordingSession.setActive(true)
            try audioEngine.start()
            
            status = CurrentRecordingStatus.RECORDING
            return true
        } catch {
            return false
        }
    }
    private func updateMicInfo(info: String, sensitivity: Float) {
        notifyMic(data: ["mic": info,"sensitivity":sensitivity])
    }
    
    /* Calcolo usando EchoSample from Apple*/
    private func updateMeters(buffer: AVAudioPCMBuffer, frameLen: Int) {
        var powerLevel:PowerMeter.PowerLevels = PowerMeter.PowerLevels(average: -160, peak: -160)
        let channelCount = Int(buffer.format.channelCount)
        let length = vDSP_Length(buffer.frameLength)
        if let floatData = buffer.floatChannelData {
            powerLevel = PowerMeter.getPowers(data: floatData[0], strideFrames: buffer.stride, length: length)
        }
        notify(data: powerLevel)
    }
    
    /*Calcolo secondo stackOverflow, RMS base*/
    private func __updateMeters(buffer: AVAudioPCMBuffer, frameLen: Int) {
        let inNumberFrames:UInt = UInt(buffer.frameLength)
        if buffer.format.channelCount > 0 {
            let samples = (buffer.floatChannelData![0])
            var avgValue:Float32 = 0
            vDSP_meamgv(samples,1 , &avgValue, inNumberFrames)
            var v:Float = -100
            if avgValue != 0 {
                v = 20.0 * log10f(avgValue)
            }
            self.averagePower = (self.LEVEL_LOWPASS_TRIG*v) + ((1-self.LEVEL_LOWPASS_TRIG)*self.averagePower)
            
        }
        notify(data: self.averagePower)
                
    }

    /* Deprecata */
    private func _updateMeters(buffer: AVAudioPCMBuffer) {
        //let channelCount = Int(buffer.format.channelCount)
        var peaks = [Float]()
        
                
        var envelopeState:Float = 0
        let envConstantAtk:Float = 0.16
        let envConstantDec:Float = 0.003
        let enviOSConstant:Float = 32768.0
        let bufferSize = buffer.frameLength
        
        let samples = UInt(70)
        if let floatData = buffer.floatChannelData {
            //let channelDataArray = Array(UnsafeBufferPointer(start:floatData[0], count: Int(bufferSize)))
            let _data = floatData[0]
            let blockSize = Int(floor(Double(bufferSize) / Double(samples)))
            for i in 0...Int(samples) {
                let blockStart = blockSize*i
                var sum = Float(0)
                for j in 0...blockSize {
                    sum = sum + (abs(_data[blockStart+j])*enviOSConstant)
                    /*
                    let normalized = abs(_data[blockStart+j])
                    if envelopeState < normalized {
                        envelopeState += envConstantAtk * (normalized - envelopeState)
                    } else {
                        envelopeState += envConstantDec * (normalized - envelopeState)
                    }
                    sum = sum + envelopeState
                    */
                }
                peaks.append(sum/Float(blockSize))
            }
            
            
        }
        print("Got peakLevels? \(peaks)")
        notify(data: peaks)
    }
    func audioBufferToBytes(audioBuffer: AVAudioPCMBuffer) -> [UInt8] {
        let srcLeft = audioBuffer.floatChannelData![0]
        let bytesPerFrame = audioBuffer.format.streamDescription.pointee.mBytesPerFrame
        let numBytes = Int(bytesPerFrame * audioBuffer.frameLength)

        // initialize bytes by 0
        var audioByteArray = [UInt8](repeating: 0, count: numBytes)

        srcLeft.withMemoryRebound(to: UInt8.self, capacity: numBytes) { srcByteData in
            audioByteArray.withUnsafeMutableBufferPointer {
                $0.baseAddress!.initialize(from: srcByteData, count: numBytes)
            }
        }

        return audioByteArray
    }
    
    public func stopRecording() {
        do {
            /* Ferma la registrazione*/
            status = CurrentRecordingStatus.NONE
            /* Rimuovi il Tap dall'input node */
            audioEngine.inputNode.removeTap(onBus: 0) //Ferma la registrazione sul file.
            audioEngine.stop()
            /* ferma la sessione audio */
            try recordingSession.setActive(false)
            try recordingSession.setCategory(originalRecordingSessionCategory)
            if #available(iOS 14.5, *) {
                try recordingSession.setPrefersNoInterruptionsFromSystemAlerts(false)
            } else {
                // Fallback on earlier versions
            }
            //audioFilePath = tmp_audioFilePath //Al momento ritorna l'audio di test...
            
            guard let inputBuffer = CustomMediaRecorder.getBuffer(fileURL: tmp_audioFilePath) else {
                return
            }

            let wavFile = try AVAudioFile(forWriting: audioFilePath, settings: outputIOFormat.settings)
            let converter = AVAudioConverter(from: recordIOFormat, to: wavFile.processingFormat)
            let sampleRateConversionRatio = recordIOFormat.sampleRate / outputIOFormat.sampleRate
            let outputCapacity = AVAudioFrameCount(ceil( Double(inputBuffer.frameCapacity) * sampleRateConversionRatio ))
            guard let outputBuffer = AVAudioPCMBuffer(pcmFormat: wavFile.processingFormat, frameCapacity: outputCapacity) else {
                throw AudioEngineError.bufferRetrieveError
            }
            var gotData = false
                var error: NSError?
                converter?.convert(to: outputBuffer, error: &error) { (numPackets, status) in
                    if gotData {
                        status.pointee = .noDataNow
                        return nil
                    }
                    gotData = true
                    status.pointee = .haveData
                    return inputBuffer
                }
                try wavFile.write(from: outputBuffer)
            //audioRecorder.stop()
            originalRecordingSessionCategory = nil
            audioRecorder = nil
            recordingSession = nil
            status = CurrentRecordingStatus.NONE
        } catch {
            print("Connot stop recording: \(error)")
            
        }
    }
    
    private static func getBuffer(fileURL: URL) -> AVAudioPCMBuffer? {
        let file: AVAudioFile!
        do {
            try file = AVAudioFile(forReading: fileURL)
        } catch {
            print("Could not load file: \(error)")
            return nil
        }
        file.framePosition = 0
        
        // Add 100 ms to the capacity.
        let bufferCapacity = AVAudioFrameCount(file.length)
                + AVAudioFrameCount(file.processingFormat.sampleRate * 0.1)
        guard let buffer = AVAudioPCMBuffer(pcmFormat: file.processingFormat,
                                            frameCapacity: bufferCapacity) else { return nil }
        do {
            try file.read(into: buffer)
        } catch {
            print("Could not load file into buffer: \(error)")
            return nil
        }
        file.framePosition = 0
        return buffer
    }
    
    public func getOutputFile() -> URL {
        return audioFilePath
    }
    
    public func getTmpOutputFile() -> URL {
        return tmp_audioFilePath
    }
    
    public func pauseRecording() -> Bool {
        if(status == CurrentRecordingStatus.RECORDING) {
            audioRecorder.pause()
            status = CurrentRecordingStatus.PAUSED
            return true
        } else {
            return false
        }
    }
    
    public func resumeRecording() -> Bool {
        if(status == CurrentRecordingStatus.PAUSED) {
            audioRecorder.record()
            status = CurrentRecordingStatus.RECORDING
            return true
        } else {
            return false
        }
    }
    
    public func getCurrentStatus() -> CurrentRecordingStatus {
        return status
    }
    
}

class EventListenerAction {
    let action:(() -> ())?;
    let actionExpectsInfo:((Any?) -> ())?;
    
    init(callback: @escaping (() -> ()) ) {
        self.action = callback;
        self.actionExpectsInfo = nil;
    }
    
    init(callback: @escaping ((Any?) -> ()) ) {
        self.actionExpectsInfo = callback;
        self.action = nil;
    }
}

class MicListenerAction {
    let action:(() -> ())?;
    let actionExpectsInfo:((Any?) -> ())?;
    
    init(callback: @escaping (() -> ()) ) {
        self.action = callback;
        self.actionExpectsInfo = nil;
    }
    
    init(callback: @escaping ((Any?) -> ()) ) {
        self.actionExpectsInfo = callback;
        self.action = nil;
    }
}
