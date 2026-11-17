import SwiftUI

public struct StepByStepPlayerView: View {
    @ObservedObject var appState: AppState

    public init(appState: AppState) {
        self.appState = appState
    }

    public var body: some View {
        let currentStep = appState.activityPlan.steps[appState.currentStepIndex]
        let totalSteps = appState.activityPlan.steps.count

        GeometryReader { geo in
            ZStack {
                // Background dark radial wash
                RadialGradient(
                    colors: [Color(red: 0.12, green: 0.18, blue: 0.30), Color(red: 0.05, green: 0.08, blue: 0.14)],
                    center: .center,
                    startRadius: 20,
                    endRadius: geo.size.width * 0.8
                )

                VStack(spacing: 16) {
                    // Top Step Indicator Pills
                    HStack(spacing: 8) {
                        ForEach(0..<totalSteps, id: \.self) { idx in
                            Capsule()
                                .fill(idx <= appState.currentStepIndex ? Color.blue : Color.white.opacity(0.15))
                                .frame(height: 6)
                        }
                    }
                    .padding(.horizontal, 36)
                    .padding(.top, 20)

                    HStack {
                        Text("FORGE STEP \(appState.currentStepIndex + 1) OF \(totalSteps)")
                            .font(.system(size: 11, weight: .heavy, design: .rounded))
                            .foregroundColor(Color(red: 0.43, green: 0.63, blue: 1.00))
                            .padding(.horizontal, 10)
                            .padding(.vertical, 4)
                            .background(Capsule().fill(Color.blue.opacity(0.2)))

                        Spacer()

                        Button(action: {
                            appState.speakCurrentStep()
                        }) {
                            HStack(spacing: 6) {
                                Image(systemName: "speaker.wave.2.fill")
                                Text("Speak Step")
                            }
                            .font(.system(size: 11, weight: .bold, design: .rounded))
                            .foregroundColor(.cyan)
                            .padding(.horizontal, 10)
                            .padding(.vertical, 4)
                            .background(Capsule().fill(Color.cyan.opacity(0.15)))
                        }
                        .buttonStyle(.plain)
                    }
                    .padding(.horizontal, 36)

                    Spacer()

                    // Central Visual Step Graphic
                    ZStack {
                        Circle()
                            .fill(
                                LinearGradient(
                                    colors: [Color.blue.opacity(0.3), Color.purple.opacity(0.2)],
                                    startPoint: .topLeading,
                                    endPoint: .bottomTrailing
                                )
                            )
                            .frame(width: 140, height: 140)
                            .blur(radius: 20)

                        Circle()
                            .fill(Color(red: 0.10, green: 0.15, blue: 0.25))
                            .frame(width: 110, height: 110)
                            .overlay(
                                Circle().stroke(Color.white.opacity(0.15), lineWidth: 2)
                            )

                        Image(systemName: currentStep.sfSymbol)
                            .font(.system(size: 48, weight: .bold))
                            .foregroundColor(.white)
                    }

                    // Step Title & Kid Instruction
                    VStack(spacing: 8) {
                        Text(currentStep.title)
                            .font(.system(size: 24, weight: .heavy, design: .rounded))
                            .foregroundColor(.white)
                            .multilineTextAlignment(.center)

                        Text(currentStep.instruction)
                            .font(.system(size: 15, weight: .regular, design: .rounded))
                            .foregroundColor(Color(red: 0.88, green: 0.90, blue: 0.95))
                            .multilineTextAlignment(.center)
                            .lineSpacing(4)
                            .frame(maxWidth: 580)
                    }
                    .padding(.horizontal, 24)

                    // Safety Tip
                    if let tip = currentStep.safetyTip {
                        HStack(spacing: 8) {
                            Image(systemName: "hand.raised.fill")
                                .foregroundColor(.orange)
                            Text(tip)
                                .font(.system(size: 12, weight: .medium, design: .rounded))
                                .foregroundColor(.orange)
                        }
                        .padding(.horizontal, 14)
                        .padding(.vertical, 8)
                        .background(
                            RoundedRectangle(cornerRadius: 10)
                                .fill(Color.orange.opacity(0.12))
                        )
                    }

                    Spacer()

                    // Bottom Navigation Buttons
                    HStack(spacing: 20) {
                        Button(action: {
                            appState.prevStep()
                        }) {
                            HStack(spacing: 6) {
                                Image(systemName: "arrow.left")
                                Text("Previous")
                            }
                            .font(.system(size: 13, weight: .bold, design: .rounded))
                            .foregroundColor(.white)
                            .padding(.horizontal, 20)
                            .padding(.vertical, 10)
                            .background(Capsule().fill(Color.white.opacity(0.15)))
                        }
                        .buttonStyle(.plain)
                        .disabled(appState.currentStepIndex == 0)

                        Button(action: {
                            appState.nextStep()
                        }) {
                            HStack(spacing: 8) {
                                Text(appState.currentStepIndex == totalSteps - 1 ? "Finish & Verify On Camera 📷" : "Next Step")
                                Image(systemName: "arrow.right")
                            }
                            .font(.system(size: 13, weight: .heavy, design: .rounded))
                            .foregroundColor(.white)
                            .padding(.horizontal, 24)
                            .padding(.vertical, 11)
                            .background(
                                Capsule()
                                    .fill(LinearGradient(colors: [Color.blue, Color.purple], startPoint: .leading, endPoint: .trailing))
                            )
                            .shadow(color: Color.blue.opacity(0.4), radius: 6)
                        }
                        .buttonStyle(.plain)
                    }
                    .padding(.bottom, 24)
                }
            }
        }
    }
}
