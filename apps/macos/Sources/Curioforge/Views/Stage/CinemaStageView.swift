import SwiftUI

public struct CinemaStageView: View {
    @ObservedObject var appState: AppState

    public init(appState: AppState) {
        self.appState = appState
    }

    public var body: some View {
        VStack(spacing: 0) {
            // Top Stage Navigation Header
            HStack(spacing: 12) {
                // Live Badge
                HStack(spacing: 5) {
                    Circle()
                        .fill(Color.red)
                        .frame(width: 7, height: 7)
                    Text("LIVE STAGE")
                        .font(.system(size: 10, weight: .heavy, design: .monospaced))
                        .foregroundColor(.white)
                }
                .padding(.horizontal, 8)
                .padding(.vertical, 4)
                .background(Capsule().fill(Color.red.opacity(0.35)))

                Text(appState.activityPlan.title)
                    .font(.system(size: 14, weight: .bold, design: .rounded))
                    .foregroundColor(.white)

                Text("•")
                    .foregroundColor(.white.opacity(0.3))

                Text(appState.activityPlan.discipline)
                    .font(.system(size: 11, weight: .medium, design: .rounded))
                    .foregroundColor(Color(red: 0.43, green: 0.63, blue: 1.00))

                Spacer()

                // Mode Picker Pills
                HStack(spacing: 6) {
                    ForEach(StageMode.allCases) { mode in
                        Button(action: {
                            appState.stageMode = mode
                        }) {
                            HStack(spacing: 4) {
                                Image(systemName: mode.sfSymbol)
                                Text(mode.rawValue)
                            }
                            .font(.system(size: 11, weight: .bold, design: .rounded))
                            .padding(.horizontal, 10)
                            .padding(.vertical, 5)
                            .background(
                                Capsule()
                                    .fill(appState.stageMode == mode ? Color.blue : Color.white.opacity(0.08))
                            )
                            .foregroundColor(appState.stageMode == mode ? .white : .white.opacity(0.75))
                        }
                        .buttonStyle(.plain)
                    }
                }
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 10)
            .background(Color(red: 0.04, green: 0.07, blue: 0.12))

            // Main Stage Viewport
            ZStack {
                switch appState.stageMode {
                case .scanner:
                    CameraScannerView(appState: appState)
                case .simulator:
                    LivingCanvasView(appState: appState)
                case .steps:
                    StepByStepPlayerView(appState: appState)
                case .verification:
                    verificationView
                }
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)

            // YouTube Bottom Chapter Scrubber
            ChapterScrubberView(appState: appState)
        }
        .background(Color(red: 0.03, green: 0.05, blue: 0.09))
    }

    @ViewBuilder
    private var verificationView: some View {
        GeometryReader { geo in
            ZStack {
                RadialGradient(
                    colors: [Color(red: 0.14, green: 0.22, blue: 0.35), Color(red: 0.04, green: 0.06, blue: 0.10)],
                    center: .center,
                    startRadius: 20,
                    endRadius: geo.size.width * 0.7
                )

                VStack(spacing: 20) {
                    // Header
                    HStack {
                        Image(systemName: "camera.viewfinder")
                            .font(.system(size: 18))
                            .foregroundColor(.cyan)
                        Text("GEMINI 2.0 VLM • RESULT VERIFICATION")
                            .font(.system(size: 13, weight: .heavy, design: .monospaced))
                            .foregroundColor(.white)
                    }
                    .padding(.top, 24)

                    Spacer()

                    // Center Inspection Reticle
                    ZStack {
                        Circle()
                            .stroke(Color.cyan.opacity(0.4), style: StrokeStyle(lineWidth: 2, dash: [8, 6]))
                            .frame(width: 220, height: 220)

                        if appState.activityPlan.isVerified {
                            VStack(spacing: 10) {
                                Image(systemName: "checkmark.seal.fill")
                                    .font(.system(size: 64))
                                    .foregroundColor(.green)
                                    .shadow(color: Color.green.opacity(0.6), radius: 12)

                                Text("PHYSICS VERIFIED!")
                                    .font(.system(size: 18, weight: .heavy, design: .rounded))
                                    .foregroundColor(.white)

                                Text("Sir Isaac Newton Junior")
                                    .font(.system(size: 12, weight: .semibold, design: .rounded))
                                    .foregroundColor(.cyan)
                            }
                        } else {
                            VStack(spacing: 8) {
                                Image(systemName: "viewfinder")
                                    .font(.system(size: 48))
                                    .foregroundColor(.white.opacity(0.6))

                                Text("Hold up your racer to camera")
                                    .font(.system(size: 13, weight: .medium, design: .rounded))
                                    .foregroundColor(.white.opacity(0.8))
                            }
                        }
                    }

                    Spacer()

                    // Action Buttons
                    HStack(spacing: 16) {
                        Button(action: {
                            appState.verifyResult()
                        }) {
                            HStack(spacing: 8) {
                                Image(systemName: appState.isVerifyingResult ? "arrow.triangle.2.circlepath" : "sparkles")
                                Text(appState.isVerifyingResult ? "Verifying with VLM..." : "Verify Invention with AI")
                            }
                            .font(.system(size: 14, weight: .heavy, design: .rounded))
                            .foregroundColor(.white)
                            .padding(.horizontal, 24)
                            .padding(.vertical, 12)
                            .background(
                                Capsule()
                                    .fill(LinearGradient(colors: [Color.blue, Color.purple], startPoint: .leading, endPoint: .trailing))
                            )
                            .shadow(color: Color.blue.opacity(0.4), radius: 8)
                        }
                        .buttonStyle(.plain)
                        .disabled(appState.isVerifyingResult)

                        if appState.activityPlan.isVerified {
                            Button(action: {
                                appState.showCertificateSheet = true
                            }) {
                                HStack(spacing: 6) {
                                    Image(systemName: "printer.fill")
                                    Text("Print Certificate")
                                }
                                .font(.system(size: 13, weight: .bold, design: .rounded))
                                .foregroundColor(.white)
                                .padding(.horizontal, 18)
                                .padding(.vertical, 12)
                                .background(Capsule().fill(Color.green.opacity(0.8)))
                            }
                            .buttonStyle(.plain)
                        }
                    }
                    .padding(.bottom, 24)
                }
            }
        }
    }
}
