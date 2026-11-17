import SwiftUI

public enum SidebarTab: String, CaseIterable, Identifiable {
    case mentor = "Mentor"
    case feed = "Up Next"
    case safety = "Supervise"

    public var id: String { rawValue }
    public var sfSymbol: String {
        switch self {
        case .mentor: return "sparkles"
        case .feed: return "play.rectangle.on.rectangle.fill"
        case .safety: return "checkmark.shield.fill"
        }
    }
}

public struct CoPilotSidebarView: View {
    @ObservedObject var appState: AppState
    @State private var selectedTab: SidebarTab = .mentor

    public init(appState: AppState) {
        self.appState = appState
    }

    public var body: some View {
        VStack(spacing: 10) {
            // Top Siri Orb & Voice Status
            VStack(spacing: 4) {
                SiriOrbView(appState: appState)

                HStack(spacing: 6) {
                    Circle()
                        .fill(appState.isRecording ? Color.red : (appState.isSpeakingAudio ? Color.green : Color.cyan))
                        .frame(width: 7, height: 7)

                    Text(appState.isRecording ? "Listening to student..." : (appState.isSpeakingAudio ? "Curioforge is speaking..." : "Tap Orb to Speak"))
                        .font(.system(size: 11, weight: .semibold, design: .rounded))
                        .foregroundColor(.white.opacity(0.85))
                }
            }
            .padding(.top, 4)

            // Segmented Picker
            Picker("", selection: $selectedTab) {
                ForEach(SidebarTab.allCases) { tab in
                    Label(tab.rawValue, systemImage: tab.sfSymbol).tag(tab)
                }
            }
            .pickerStyle(.segmented)
            .padding(.horizontal, 4)

            Divider()
                .background(Color.white.opacity(0.1))

            // Tab Content
            switch selectedTab {
            case .mentor:
                SocraticChatView(appState: appState)
            case .feed:
                CuriosityFeedView(appState: appState)
            case .safety:
                SafetyBadgeView(appState: appState)
            }
        }
        .padding(12)
        .background(
            Color(red: 0.05, green: 0.08, blue: 0.14).opacity(0.95)
        )
    }
}
