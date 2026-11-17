import SwiftUI

public struct CameraScannerView: View {
    @ObservedObject var appState: AppState
    @State private var scanlineOffset: CGFloat = -180

    public init(appState: AppState) {
        self.appState = appState
    }

    public var body: some View {
        GeometryReader { geo in
            ZStack {
                // Camera Feed Simulated Background (Dark Slate gradient with table texture)
                RadialGradient(
                    gradient: Gradient(colors: [
                        Color(red: 0.14, green: 0.20, blue: 0.32),
                        Color(red: 0.05, green: 0.08, blue: 0.14)
                    ]),
                    center: .center,
                    startRadius: 40,
                    endRadius: geo.size.width * 0.7
                )

                // Grid Overlay for Technical Scanner Feel
                Path { path in
                    let step: CGFloat = 36
                    for x in stride(from: 0, to: geo.size.width, by: step) {
                        path.move(to: CGPoint(x: x, y: 0))
                        path.addLine(to: CGPoint(x: x, y: geo.size.height))
                    }
                    for y in stride(from: 0, to: geo.size.height, by: step) {
                        path.move(to: CGPoint(x: 0, y: y))
                        path.addLine(to: CGPoint(x: geo.size.width, y: y))
                    }
                }
                .stroke(Color.cyan.opacity(0.08), lineWidth: 1)

                // Animated Scanline Beam
                Rectangle()
                    .fill(
                        LinearGradient(
                            colors: [Color.clear, Color.cyan.opacity(0.35), Color.clear],
                            startPoint: .top,
                            endPoint: .bottom
                        )
                    )
                    .frame(height: 18)
                    .offset(y: scanlineOffset)

                // AR Bounding Boxes over Detected Scrap Items
                ForEach(appState.detectedScraps) { scrap in
                    let w = geo.size.width * scrap.boxWidth
                    let h = geo.size.height * scrap.boxHeight
                    let x = geo.size.width * scrap.boxX
                    let y = geo.size.height * scrap.boxY

                    ZStack(alignment: .topLeading) {
                        RoundedRectangle(cornerRadius: 8)
                            .stroke(scrap.isEssential ? Color.cyan : Color.orange, lineWidth: 2)
                            .background(
                                RoundedRectangle(cornerRadius: 8)
                                    .fill(scrap.isEssential ? Color.cyan.opacity(0.12) : Color.orange.opacity(0.12))
                            )

                        // Label chip
                        HStack(spacing: 4) {
                            Circle()
                                .fill(scrap.isEssential ? Color.cyan : Color.orange)
                                .frame(width: 5, height: 5)
                            Text("\(scrap.name) (\(Int(scrap.confidence * 100))%)")
                                .font(.system(size: 10, weight: .bold, design: .monospaced))
                                .foregroundColor(.white)
                        }
                        .padding(.horizontal, 6)
                        .padding(.vertical, 3)
                        .background(
                            RoundedRectangle(cornerRadius: 4)
                                .fill(Color.black.opacity(0.75))
                        )
                        .offset(x: 4, y: 4)
                    }
                    .frame(width: w, height: h)
                    .position(x: x + w / 2, y: y + h / 2)
                }

                // HUD Top Overlay
                VStack {
                    HStack {
                        HStack(spacing: 8) {
                            Circle()
                                .fill(Color.red)
                                .frame(width: 8, height: 8)
                            Text("GEMINI 2.0 VLM • OBJECT DETECTION HUD")
                                .font(.system(size: 11, weight: .heavy, design: .monospaced))
                                .foregroundColor(.white)
                        }
                        .padding(.horizontal, 10)
                        .padding(.vertical, 6)
                        .background(Capsule().fill(Color.black.opacity(0.6)))

                        Spacer()

                        Text("\(appState.detectedScraps.count) MATERIALS IDENTIFIED")
                            .font(.system(size: 11, weight: .bold, design: .rounded))
                            .foregroundColor(.cyan)
                            .padding(.horizontal, 10)
                            .padding(.vertical, 6)
                            .background(Capsule().fill(Color.cyan.opacity(0.2)))
                    }
                    .padding(16)

                    Spacer()

                    // Bottom Action Bar
                    HStack(spacing: 16) {
                        Button(action: {
                            appState.triggerScrapScan()
                        }) {
                            HStack(spacing: 6) {
                                Image(systemName: "arrow.clockwise")
                                Text("Rescan Table")
                            }
                            .font(.system(size: 13, weight: .bold, design: .rounded))
                            .foregroundColor(.white)
                            .padding(.horizontal, 16)
                            .padding(.vertical, 10)
                            .background(Capsule().fill(Color.white.opacity(0.18)))
                        }
                        .buttonStyle(.plain)

                        Button(action: {
                            appState.selectChapter(2)
                        }) {
                            HStack(spacing: 6) {
                                Image(systemName: "sparkles")
                                Text("Forge Rocket Racer!")
                            }
                            .font(.system(size: 13, weight: .heavy, design: .rounded))
                            .foregroundColor(.white)
                            .padding(.horizontal, 20)
                            .padding(.vertical, 10)
                            .background(
                                Capsule()
                                    .fill(LinearGradient(colors: [Color.blue, Color.purple], startPoint: .leading, endPoint: .trailing))
                            )
                            .shadow(color: Color.blue.opacity(0.5), radius: 8)
                        }
                        .buttonStyle(.plain)
                    }
                    .padding(.bottom, 24)
                }
            }
            .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
            .onAppear {
                withAnimation(.linear(duration: 3.0).repeatForever(autoreverses: true)) {
                    scanlineOffset = geo.size.height / 2 - 20
                }
            }
        }
    }
}
