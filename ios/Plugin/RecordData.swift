//
//  RecordData.swift
//  App
//
//  Created by Francesco Lo Truglio on 25/08/22.
//

import Foundation

struct RecordData {
    public var recordDataBase64: String? = nil
    public var mimeType: String = ""
    public var msDuration: Int = 0
    
    private var returnCAF = false
    private var cafData : Dictionary<String,Any>?
    
    public mutating func returnCafFile(ret : Bool) {
        returnCAF = ret
    }
    public mutating func setCAFFile(data: RecordData) {
        cafData = data.toDictionary()
    }
    
    init(_recordDataBase64: String?, _mimeType: String, _msDuration: Int) {
        recordDataBase64 = _recordDataBase64
        mimeType = _mimeType
        msDuration = _msDuration
    }
    
    public func toDictionary() -> Dictionary<String, Any> {
        if(returnCAF == true) {
            return [
                "recordDataBase64": recordDataBase64 ?? "",
                "msDuration": msDuration,
                "mimeType": mimeType,
                "caf": cafData ?? false
            ]
        }
        return [
            "recordDataBase64": recordDataBase64 ?? "",
            "msDuration": msDuration,
            "mimeType": mimeType
        ]
    }
}
