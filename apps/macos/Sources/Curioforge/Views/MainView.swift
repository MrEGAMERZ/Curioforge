import SwiftUI

public struct MainView: View {
    @StateObject private var appState = AppState()
    @ObservedObject private var cloudSync = CloudSyncService.shared

    public init() {}

    public var body: some View {
        VStack(spacing: 0) {
            // macOS Top App Header Bar
            HStack(spacing: 14) {
                // Wordmark & Flame Icon
                HStack(spacing: 8) {
                    ZStack {
                        Circle()
                            .fill(
                                LinearGradient(
                                    colors: [Color(red: 0.25, green: 0.55, blue: 1.00), Color(red: 0.55, green: 0.36, blue: 0.96)],
                                    startPoint: .topLeading,
                                    endPoint: .bottomTrailing
                                )
                            )
                            .frame(width: 26, height: 26)
                        Image(systemName: "flame.fill")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(.white)
                    }

                    HStack(spacing: 0) {
                        Text("CURIO")
                            .font(.system(size: 15, weight: .black, design: .rounded))
                            .foregroundColor(.white)
                        Text("FORGE")
                            .font(.system(size: 15, weight: .black, design: .rounded))
                            .foregroundColor(Color(red: 0.43, green: 0.63, blue: 1.00))
                    }
                }

                // Tagline Pill
                Text("Turning Curiosity into Invention")
                    .font(.system(size: 11, weight: .medium, design: .rounded))
                    .foregroundColor(.white.opacity(0.5))

                Spacer()

                // Student Stats Pill
                HStack(spacing: 6) {
                    Image(systemName: "rosette")
                        .foregroundColor(.yellow)
                    Text("\(cloudSync.profile.completedInventionsCount) Inventions Built")
                        .font(.system(size: 11, weight: .bold, design: .rounded))
                        .foregroundColor(.white)
                }
                .padding(.horizontal, 10)
                .padding(.vertical, 5)
                .background(Capsule().fill(Color.white.opacity(0.08)))

                // Quick Language Selector
                Menu {
                    ForEach(SupportedLanguage.allCases, id: \.self) { lang in
                        Button(action: {
                            appState.selectedLanguage = lang
                        }) {
                            HStack {
                                Text("\(lang.flag) \(lang.displayName)")
                                if appState.selectedLanguage == lang {
                                    Image(systemName: "checkmark")
                                }
                            }
                        }
                    }
                } label: {
                    HStack(spacing: 4) {
                        Text(appState.selectedLanguage.flag)
                        Text(appState.selectedLanguage.displayName)
                            .font(.system(size: 11, weight: .semibold, design: .rounded))
                            .foregroundColor(.white)
                    }
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(Capsule().fill(Color.white.opacity(0.10)))
                }
                .menuStyle(.borderlessButton)

                // Settings Gear Button
                Button(action: {
                    appState.showSettingsSheet = true
                }) {
                    Image(systemName: "gearshape.fill")
                        .font(.system(size: 14))
                        .foregroundColor(.white.opacity(0.8))
                }
                .buttonStyle(.plain)
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 8)
            .background(Color(red: 0.05, green: 0.07, blue: 0.12))

            Divider()
                .background(Color.white.opacity(0.12))

            // Main Split: 70% YouTube Cinema Stage / 30% Apple Intelligence Co-Pilot
            GeometryReader { geo in
                HStack(spacing: 0) {
                    // Left 70%: Living Cinema Stage
                    CinemaStageView(appState: appState)
                        .frame(width: geo.size.width * 0.70)

                    Divider()
                        .background(Color.white.opacity(0.12))

                    // Right 30%: Apple Intelligence Co-Pilot Sidebar
                    CoPilotSidebarView(appState: appState)
                        .frame(width: geo.size.width * 0.30)
                }
            }
        }
        .frame(minWidth: 1100, minHeight: 720)
        .background(Color(red: 0.04, green: 0.06, blue: 0.10))
        .sheet(isPresented: $appState.showSettingsSheet) {
            SettingsView(appState: appState)
        }
        .sheet(isPresented: $appState.showCertificateSheet) {
            CertificateModalView(appState: appState)
        }
    }
}
