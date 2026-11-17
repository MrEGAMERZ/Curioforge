import Foundation
import Speech
import AVFoundation

public final class SpeechRecognizerService: ObservableObject {
    public static let shared = SpeechRecognizerService()

    private let speechRecognizer = SFSpeechRecognizer(locale: Locale(identifier: "en-US"))
    private var recognitionRequest: SFSpeechAudioBufferRecognitionRequest?
    private var recognitionTask: SFSpeechRecognitionTask?
    private let audioEngine = AVAudioEngine()

    @Published public var isRecording: Bool = false
    @Published public var recognizedText: String = ""
    @Published public var audioLevel: Float = 0.0

    public var onTranscriptUpdated: ((String) -> Void)?
    public var onAudioLevelUpdated: ((Float) -> Void)?

    private init() {}

    public func startRecording() {
        guard !isRecording else { return }

        // Cancel prior tasks
        recognitionTask?.cancel()
        recognitionTask = nil

        recognitionRequest = SFSpeechAudioBufferRecognitionRequest()
        guard let recognitionRequest = recognitionRequest else { return }
        recognitionRequest.shouldReportPartialResults = true

        let inputNode = audioEngine.inputNode
        let recordingFormat = inputNode.outputFormat(forBus: 0)

        inputNode.installTap(onBus: 0, bufferSize: 1024, format: recordingFormat) { [weak self] buffer, _ in
            self?.recognitionRequest?.append(buffer)

            // Calculate instantaneous RMS audio level
            guard let channelData = buffer.floatChannelData?[0] else { return }
            let frames = buffer.frameLength
            var sum: Float = 0.0
            for i in 0..<Int(frames) {
                sum += channelData[i] * channelData[i]
            }
            let rms = sqrt(sum / Float(frames))
            let normalizedLevel = min(1.0, max(0.0, rms * 5.0))

            DispatchQueue.main.async {
                self?.audioLevel = normalizedLevel
                self?.onAudioLevelUpdated?(normalizedLevel)
            }
        }

        audioEngine.prepare()
        do {
            try audioEngine.start()
            isRecording = true
        } catch {
            print("[SpeechRecognizer] Could not start audio engine: \(error)")
            return
        }

        recognitionTask = speechRecognizer?.recognitionTask(with: recognitionRequest) { [weak self] result, error in
            if let result = result {
                let text = result.bestTranscription.formattedString
                DispatchQueue.main.async {
                    self?.recognizedText = text
                    self?.onTranscriptUpdated?(text)
                }
            }

            if error != nil || result?.isFinal == true {
                DispatchQueue.main.async {
                    self?.stopRecording()
                }
            }
        }
    }

    public func stopRecording() {
        guard isRecording else { return }

        audioEngine.stop()
        audioEngine.inputNode.removeTap(onBus: 0)

        recognitionRequest?.endAudio()
        recognitionRequest = nil

        recognitionTask?.cancel()
        recognitionTask = nil

        isRecording = false
        audioLevel = 0.0
        onAudioLevelUpdated?(0.0)
    }
}
