//
//  PermissionStatus.swift
//  App
//
//  Created by Francesco Lo Truglio on 01/09/22.
//

import Foundation

struct PermissionStatus {
    public let camera: String
    public let microphone: String
    public let storage: String
    
    public func toDictionary() -> Dictionary<String, Any> {
        return [
            "camera": camera,
            "storage": storage,
            "voice recording": microphone
        ]
    }
}

struct PermissionStatusNoCam {
    
    public let microphone: String
    public let storage: String
    
    public func toDictionary() -> Dictionary<String, Any> {
        return [
            "storage": storage,
            "voice recording": microphone
        ]
    }
}
