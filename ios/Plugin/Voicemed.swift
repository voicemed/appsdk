import Foundation

@objc public class Voicemed: NSObject {
    @objc public func echo(_ value: String) -> String {
        print(value)
        return value
    }
}
