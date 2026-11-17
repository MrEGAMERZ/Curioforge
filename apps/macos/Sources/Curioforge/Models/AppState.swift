import Foundation
import SwiftUI
import Combine

public enum StageMode: String, CaseIterable, Identifiable {
    case scanner = "Scrap Scanner"
    case simulator = "Living Canvas"
    case steps = "Step Builder"
    case verification = "Verify Result"

    public var id: String { rawValue }
    public var sfSymbol: String {
        switch self {
        case .scanner: return "camera.viewfinder"
        case .simulator: return "atom"
        case .steps: return "hammer.fill"
        case .verification: return "checkmark.seal.fill"
        }
    }
}

@MainActor
public final class AppState: ObservableObject {
    @Published public var currentChapter: Int = 0 // 0: Spark, 1: Inventory, 2: Predict, 3: Build, 4: Reveal
    @Published public var stageMode: StageMode = .scanner
    @Published public var activityPlan: ActivityPlan = .sampleJetCar
    @Published public var currentStepIndex: Int = 0

    @Published public var messages: [SocraticMessage] = []
    @Published public var detectedScraps: [ScrapItem] = []
    @Published public var simulation: SimulationState = SimulationState()
    @Published public var selectedLanguage: SupportedLanguage = .english

    @Published public var isRecording: Bool = false
    @Published public var isSpeakingAudio: Bool = false
    @Published public var audioOrbAmplitude: CGFloat = 0.15

    @Published public var isScanningScrap: Bool = false
    @Published public var isVerifyingResult: Bool = false
    @Published public var showSettingsSheet: Bool = false
    @Published public var showCertificateSheet: Bool = false

    @Published public var isCameraActive: Bool = true
    @Published public var liveTranscript: String = ""

    private let apiClient = APIClient.shared
    private let speechSynth = SpeechSynthesizerService.shared
    private let speechRec = SpeechRecognizerService.shared
    private let cloudSync = CloudSyncService.shared

    private var cancellables = Set<AnyCancellable>()
    private var simulationTimer: Timer?

    public init() {
        self.detectedScraps = ActivityPlan.sampleJetCar.materials
        self.simulation.computePhysics()
        setupInitialMessages()
        bindServices()
    }

    private func setupInitialMessages() {
        messages = [
            SocraticMessage(
                sender: .curioforge,
                text: "Hello young inventor! 👋 What would you like to build or explore today? You can speak, or point your camera at whatever scrap items you have on your desk!",
                timestamp: Date(),
                audioSpoken: true,
                language: selectedLanguage,
                suggestedChips: [
                    "I want to make a super-fast car! 🏎️",
                    "Can we make something that launches? 🚀",
                    "Scan what is on my table 📷"
                ]
            )
        ]
    }

    private func bindServices() {
        speechSynth.onSpeakingChanged = { [weak self] speaking in
            DispatchQueue.main.async {
                self?.isSpeakingAudio = speaking
                if speaking {
                    self?.audioOrbAmplitude = 0.75
                } else {
                    self?.audioOrbAmplitude = 0.15
                }
            }
        }

        speechRec.onTranscriptUpdated = { [weak self] text in
            DispatchQueue.main.async {
                self?.liveTranscript = text
            }
        }

        speechRec.onAudioLevelUpdated = { [weak self] level in
            DispatchQueue.main.async {
                if self?.isRecording == true {
                    self?.audioOrbAmplitude = CGFloat(max(0.2, Double(level)))
                }
            }
        }
    }

    // MARK: - Voice Input
    public func toggleVoiceRecording() {
        if isRecording {
            isRecording = false
            speechRec.stopRecording()
            if !liveTranscript.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
                sendStudentMessage(liveTranscript)
                liveTranscript = ""
            }
        } else {
            isRecording = true
            liveTranscript = ""
            speechSynth.stop()
            speechRec.startRecording()
        }
    }

    // MARK: - Dialogue & Socratic Guidance
    public func sendStudentMessage(_ text: String) {
        let trimmed = text.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !trimmed.isEmpty else { return }

        let userMsg = SocraticMessage(
            sender: .student,
            text: trimmed,
            timestamp: Date(),
            language: selectedLanguage
        )
        messages.append(userMsg)

        // Check if user asked to scan materials
        if trimmed.lowercased().contains("scan") || trimmed.lowercased().contains("table") || trimmed.lowercased().contains("camera") {
            triggerScrapScan()
            return
        }

        Task {
            let (reply, followUps, prompt) = await apiClient.sendChatMessage(
                text: trimmed,
                history: messages,
                language: selectedLanguage
            )

            var chips = followUps
            if let prompt = prompt, !chips.contains(prompt) {
                chips.append(prompt)
            }

            let botMsg = SocraticMessage(
                sender: .curioforge,
                text: reply,
                timestamp: Date(),
                language: selectedLanguage,
                suggestedChips: chips
            )
            self.messages.append(botMsg)
            self.speechSynth.speak(text: reply, language: selectedLanguage)
        }
    }

    // MARK: - Scrap Scanning (VLM)
    public func triggerScrapScan() {
        isScanningScrap = true
        stageMode = .scanner
        currentChapter = 1

        Task {
            let scraps = await apiClient.scanScrapMaterials()
            self.detectedScraps = scraps
            self.isScanningScrap = false

            let intro = "I scanned your desk! I found an empty plastic bottle, a latex balloon, and drinking straws. We have everything needed to forge a Jet-Propulsion Rocket Car!"
            let scanMsg = SocraticMessage(
                sender: .curioforge,
                text: intro,
                timestamp: Date(),
                language: selectedLanguage,
                suggestedChips: [
                    "Let's make the prediction! 🧪",
                    "How does air pressure work? 💨",
                    "Start building now 🛠️"
                ]
            )
            self.messages.append(scanMsg)
            self.speechSynth.speak(text: intro, language: selectedLanguage)
        }
    }

    // MARK: - Prediction & Living Canvas
    public func selectPrediction(optionId: String) {
        guard let option = activityPlan.prediction.options.first(where: { $0.id == optionId }) else { return }

        let choiceMsg = SocraticMessage(
            sender: .student,
            text: "My hypothesis: \(option.emoji) \(option.label)",
            timestamp: Date(),
            language: selectedLanguage
        )
        messages.append(choiceMsg)

        let explanation = "\(option.reactionText) \(activityPlan.prediction.scienceExplanation)"
        let answerMsg = SocraticMessage(
            sender: .curioforge,
            text: explanation,
            timestamp: Date(),
            language: selectedLanguage,
            suggestedChips: ["Test on the Living Canvas! 🚀", "Begin Step 1 🛠️"]
        )
        messages.append(answerMsg)
        speechSynth.speak(text: explanation, language: selectedLanguage)

        stageMode = .simulator
        currentChapter = 2
    }

    // MARK: - Physics Simulation Run
    public func runSimulation() {
        guard !simulation.isRunning else { return }

        simulation.computePhysics()
        simulation.isRunning = true
        simulation.currentPosition = 0.0

        simulationTimer?.invalidate()
        let stepDuration = 0.03
        let targetSpeed = max(0.1, simulation.calculatedSpeed)
        let deltaPerTick = targetSpeed * 0.012

        simulationTimer = Timer.scheduledTimer(withTimeInterval: stepDuration, repeats: true) { [weak self] timer in
            Task { @MainActor [weak self] in
                guard let self = self else {
                    timer.invalidate()
                    return
                }

                if self.simulation.currentPosition < 0.90 {
                    self.simulation.currentPosition += deltaPerTick
                } else {
                    self.simulation.currentPosition = 0.90
                    self.simulation.isRunning = false
                    self.simulation.hasRunTest = true
                    timer.invalidate()

                    let feedback = "🚀 Simulation finished! At \(Int(self.simulation.airPressure * 100))% air pressure, the jet achieved a top velocity of \(String(format: "%.1f", self.simulation.calculatedSpeed)) m/s and traveled \(String(format: "%.1f", self.simulation.calculatedDistanceMeters)) meters!"
                    let simMsg = SocraticMessage(
                        sender: .curioforge,
                        text: feedback,
                        timestamp: Date(),
                        language: self.selectedLanguage,
                        suggestedChips: ["Let's build the physical car! 🛠️", "Increase Air Pressure 🎈"]
                    )
                    self.messages.append(simMsg)
                    self.speechSynth.speak(text: feedback, language: self.selectedLanguage)
                }
            }
        }
    }

    // MARK: - Step Navigation
    public func nextStep() {
        if currentStepIndex < activityPlan.steps.count - 1 {
            activityPlan.steps[currentStepIndex].isCompleted = true
            currentStepIndex += 1
            speakCurrentStep()
        } else {
            activityPlan.steps[currentStepIndex].isCompleted = true
            // Move to verification
            currentChapter = 4
            stageMode = .verification
            let verifyPrompt = "Outstanding work assembling the rocket car! Now hold your finished racer in front of the camera and test it so our AI can verify your physics discovery!"
            let vMsg = SocraticMessage(
                sender: .curioforge,
                text: verifyPrompt,
                timestamp: Date(),
                language: selectedLanguage,
                suggestedChips: ["Capture Launch Video / Photo 📷", "Show Certificate 🏆"]
            )
            messages.append(vMsg)
            speechSynth.speak(text: verifyPrompt, language: selectedLanguage)
        }
    }

    public func prevStep() {
        if currentStepIndex > 0 {
            currentStepIndex -= 1
            speakCurrentStep()
        }
    }

    public func speakCurrentStep() {
        let step = activityPlan.steps[currentStepIndex]
        speechSynth.speak(text: step.spokenText, language: selectedLanguage)
    }

    // MARK: - Result Verification & Certificate
    public func verifyResult() {
        isVerifyingResult = true

        Task {
            let (success, explanation) = await apiClient.verifyResult(activityId: activityPlan.id)
            self.isVerifyingResult = false
            self.activityPlan.isVerified = success
            self.activityPlan.verificationNote = explanation

            self.cloudSync.recordCompletedInvention(
                title: self.activityPlan.title,
                badge: "Newton Junior Master"
            )

            let doneMsg = SocraticMessage(
                sender: .curioforge,
                text: explanation,
                timestamp: Date(),
                language: selectedLanguage,
                suggestedChips: ["Print Inventor Certificate 🖨️", "Try Next Project: Vortex Cannon 🎈"]
            )
            self.messages.append(doneMsg)
            self.speechSynth.speak(text: explanation, language: selectedLanguage)
            self.showCertificateSheet = true
        }
    }

    public func selectChapter(_ chapter: Int) {
        currentChapter = max(0, min(4, chapter))
        switch currentChapter {
        case 0:
            stageMode = .steps
        case 1:
            stageMode = .scanner
        case 2:
            stageMode = .simulator
        case 3:
            stageMode = .steps
        case 4:
            stageMode = .verification
        default:
            break
        }
    }
}
