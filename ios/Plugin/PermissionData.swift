//
//  PermissionData.swift
//  App
//
//  Created by Francesco Lo Truglio on 25/08/22.
//

import Foundation

struct PermissionData {
    public let camera: Bool
    public let microphone: Bool
    public let storage: Bool
    
    public func toDictionary() -> Dictionary<String, Any> {
        return [
            "camera": camera,
            "storage": storage,
            "voice recording": microphone
        ]
    }
}

struct PermissionDataNoCam {
    /*public let camera: Bool*/
    public let microphone: Bool
    public let storage: Bool
    
    public func toDictionary() -> Dictionary<String, Any> {
        return [
            /*"camera": camera,*/
            "storage": storage,
            "voice recording": microphone
        ]
    }
}
