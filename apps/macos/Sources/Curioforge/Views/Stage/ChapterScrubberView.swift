import SwiftUI

public struct ChapterScrubberView: View {
    @ObservedObject var appState: AppState

    private let chapters = [
        (index: 0, title: "Spark Idea", icon: "sparkles"),
        (index: 1, title: "Scrap Scan", icon: "camera.viewfinder"),
        (index: 2, title: "Predict", icon: "atom"),
        (index: 3, title: "Forge/Build", icon: "hammer.fill"),
        (index: 4, title: "Science Reveal", icon: "checkmark.seal.fill")
    ]

    public init(appState: AppState) {
        self.appState = appState
    }

    public var body: some View {
        VStack(spacing: 8) {
            // Chapter Progress Bar with Markers
            ZStack(alignment: .leading) {
                // Background Track
                RoundedRectangle(cornerRadius: 3)
                    .fill(Color.white.opacity(0.15))
                    .frame(height: 6)

                // Active Filled Progress
                GeometryReader { geo in
                    let progress = CGFloat(appState.currentChapter) / CGFloat(chapters.count - 1)
                    RoundedRectangle(cornerRadius: 3)
                        .fill(
                            LinearGradient(
                                colors: [Color.blue, Color.purple, Color.cyan],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .frame(width: geo.size.width * max(0.05, progress), height: 6)
                }
                .frame(height: 6)

                // Chapter Milestone Nodes
                HStack {
                    ForEach(chapters, id: \.index) { chapter in
                        Button(action: {
                            appState.selectChapter(chapter.index)
                        }) {
                            ZStack {
                                Circle()
                                    .fill(appState.currentChapter >= chapter.index ? Color.blue : Color(red: 0.15, green: 0.20, blue: 0.30))
                                    .frame(width: 16, height: 16)
                                    .overlay(
                                        Circle()
                                            .stroke(appState.currentChapter == chapter.index ? Color.white : Color.clear, lineWidth: 2)
                                    )

                                if appState.currentChapter >= chapter.index {
                                    Circle()
                                        .fill(Color.white)
                                        .frame(width: 6, height: 6)
                                }
                            }
                        }
                        .buttonStyle(.plain)

                        if chapter.index < chapters.count - 1 {
                            Spacer()
                        }
                    }
                }
            }
            .frame(height: 16)
            .padding(.horizontal, 8)

            // Scrubber Controls & Chapter Labels
            HStack(spacing: 14) {
                // Play / Pause
                Button(action: {
                    if appState.stageMode == .simulator {
                        appState.runSimulation()
                    } else if appState.stageMode == .steps {
                        appState.speakCurrentStep()
                    }
                }) {
                    Image(systemName: appState.simulation.isRunning ? "pause.fill" : "play.fill")
                        .font(.system(size: 15, weight: .bold))
                        .foregroundColor(.white)
                }
                .buttonStyle(.plain)

                // Prev Chapter / Step
                Button(action: {
                    if appState.currentChapter > 0 {
                        appState.selectChapter(appState.currentChapter - 1)
                    }
                }) {
                    Image(systemName: "backward.fill")
                        .font(.system(size: 13))
                        .foregroundColor(.white.opacity(0.8))
                }
                .buttonStyle(.plain)
                .disabled(appState.currentChapter == 0)

                // Next Chapter / Step
                Button(action: {
                    if appState.currentChapter < chapters.count - 1 {
                        appState.selectChapter(appState.currentChapter + 1)
                    }
                }) {
                    Image(systemName: "forward.fill")
                        .font(.system(size: 13))
                        .foregroundColor(.white.opacity(0.8))
                }
                .buttonStyle(.plain)
                .disabled(appState.currentChapter >= chapters.count - 1)

                // Current Chapter Name Badge
                HStack(spacing: 6) {
                    Image(systemName: chapters[appState.currentChapter].icon)
                        .foregroundColor(Color.cyan)
                    Text("CHAPTER \(appState.currentChapter + 1): \(chapters[appState.currentChapter].title.uppercased())")
                        .font(.system(size: 11, weight: .heavy, design: .rounded))
                        .foregroundColor(.white)
                }
                .padding(.horizontal, 10)
                .padding(.vertical, 4)
                .background(
                    Capsule().fill(Color.white.opacity(0.10))
                )

                Spacer()

                // Audio Volume Toggle
                Button(action: {
                    if appState.isSpeakingAudio {
                        SpeechSynthesizerService.shared.stop()
                    } else {
                        appState.speakCurrentStep()
                    }
                }) {
                    Image(systemName: appState.isSpeakingAudio ? "speaker.wave.3.fill" : "speaker.fill")
                        .font(.system(size: 13))
                        .foregroundColor(appState.isSpeakingAudio ? Color.cyan : .white.opacity(0.7))
                }
                .buttonStyle(.plain)

                // Subtitle (CC) Badge
                Text("CC")
                    .font(.system(size: 10, weight: .heavy))
                    .padding(.horizontal, 5)
                    .padding(.vertical, 2)
                    .background(RoundedRectangle(cornerRadius: 4).fill(Color.white.opacity(0.2)))
                    .foregroundColor(.white)
            }
            .padding(.horizontal, 6)
        }
        .padding(10)
        .background(
            Color.black.opacity(0.40)
        )
    }
}
