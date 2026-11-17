import SwiftUI

public struct SiriOrbView: View {
    @ObservedObject var appState: AppState
    @State private var rotationPhase: Double = 0.0

    public init(appState: AppState) {
        self.appState = appState
    }

    public var body: some View {
        Button(action: {
            appState.toggleVoiceRecording()
        }) {
            ZStack {
                // Background subtle ambient glow
                Circle()
                    .fill(
                        AngularGradient(
                            gradient: Gradient(colors: [
                                Color(red: 0.20, green: 0.60, blue: 1.00),
                                Color(red: 0.55, green: 0.36, blue: 0.96),
                                Color(red: 0.92, green: 0.28, blue: 0.60),
                                Color(red: 0.02, green: 0.71, blue: 0.83),
                                Color(red: 0.20, green: 0.60, blue: 1.00)
                            ]),
                            center: .center,
                            startAngle: .degrees(rotationPhase),
                            endAngle: .degrees(rotationPhase + 360)
                        )
                    )
                    .frame(width: 84, height: 84)
                    .blur(radius: appState.isRecording || appState.isSpeakingAudio ? 18 : 8)
                    .opacity(0.85)

                // Foreground core orb
                Circle()
                    .fill(
                        RadialGradient(
                            gradient: Gradient(colors: [
                                Color.white.opacity(0.95),
                                Color(red: 0.25, green: 0.55, blue: 1.00),
                                Color(red: 0.54, green: 0.36, blue: 0.96),
                                Color(red: 0.07, green: 0.11, blue: 0.18)
                            ]),
                            center: .center,
                            startRadius: 2,
                            endRadius: 40
                        )
                    )
                    .frame(width: 68, height: 68)
                    .overlay(
                        Circle()
                            .stroke(Color.white.opacity(0.4), lineWidth: 1.5)
                    )
                    .scaleEffect(appState.isRecording ? 1.0 + (appState.audioOrbAmplitude * 0.4) : (appState.isSpeakingAudio ? 1.05 + sin(rotationPhase * 0.1) * 0.08 : 1.0))
                    .shadow(color: Color.blue.opacity(0.4), radius: 8)

                // Center Icon (Microphone or Audio Waves)
                Image(systemName: appState.isRecording ? "mic.fill" : (appState.isSpeakingAudio ? "waveform" : "sparkles"))
                    .font(.system(size: 20, weight: .bold))
                    .foregroundColor(.white)
                    .scaleEffect(appState.isRecording ? 1.15 : 1.0)
            }
            .frame(height: 100)
            .animation(.easeInOut(duration: 0.2), value: appState.audioOrbAmplitude)
            .onAppear {
                withAnimation(.linear(duration: 6.0).repeatForever(autoreverses: false)) {
                    rotationPhase = 360.0
                }
            }
        }
        .buttonStyle(.plain)
        .help("Click to speak with Curioforge Socratic Mentor")
    }
}
