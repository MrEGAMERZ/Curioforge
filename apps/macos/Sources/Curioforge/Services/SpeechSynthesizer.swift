import Foundation
import AVFoundation

public final class SpeechSynthesizerService: NSObject, AVSpeechSynthesizerDelegate {
    public static let shared = SpeechSynthesizerService()

    private let synthesizer = AVSpeechSynthesizer()
    public var onSpeakingChanged: ((Bool) -> Void)?

    private override init() {
        super.init()
        synthesizer.delegate = self
    }

    public func speak(text: String, language: SupportedLanguage = .english) {
        stop()

        let utterance = AVSpeechUtterance(string: text)
        utterance.rate = 0.48 // Calm, clear pace for primary students
        utterance.pitchMultiplier = 1.05 // Warm, friendly tone
        utterance.volume = 1.0

        let bcp47: String
        switch language {
        case .english: bcp47 = "en-US"
        case .hindi, .hinglish: bcp47 = "hi-IN"
        case .spanish: bcp47 = "es-ES"
        }

        if let voice = AVSpeechSynthesisVoice(language: bcp47) {
            utterance.voice = voice
        } else {
            utterance.voice = AVSpeechSynthesisVoice(language: "en-US")
        }

        onSpeakingChanged?(true)
        synthesizer.speak(utterance)
    }

    public func stop() {
        if synthesizer.isSpeaking {
            synthesizer.stopSpeaking(at: .immediate)
        }
        onSpeakingChanged?(false)
    }

    public func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, didFinish utterance: AVSpeechUtterance) {
        onSpeakingChanged?(false)
    }

    public func speechSynthesizer(_ synthesizer: AVSpeechSynthesizer, didCancel utterance: AVSpeechUtterance) {
        onSpeakingChanged?(false)
    }
}
