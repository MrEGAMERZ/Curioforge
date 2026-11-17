import SwiftUI

public struct CuriosityFeedView: View {
    @ObservedObject var appState: AppState

    public init(appState: AppState) {
        self.appState = appState
    }

    public var body: some View {
        ScrollView {
            LazyVStack(spacing: 12) {
                // Header Banner
                HStack {
                    Image(systemName: "flame.fill")
                        .foregroundColor(.orange)
                    Text("MORE SCRAP INVENTIONS")
                        .font(.system(size: 11, weight: .heavy, design: .rounded))
                        .foregroundColor(.white.opacity(0.85))
                    Spacer()
                    Text("Zero-Cost")
                        .font(.system(size: 10, weight: .bold))
                        .padding(.horizontal, 8)
                        .padding(.vertical, 3)
                        .background(Capsule().fill(Color.green.opacity(0.25)))
                        .foregroundColor(.green)
                }
                .padding(.horizontal, 4)

                ForEach(ExperimentFeedItem.sampleFeed) { item in
                    feedCard(for: item)
                }
            }
            .padding(.horizontal, 4)
            .padding(.top, 4)
        }
    }

    @ViewBuilder
    private func feedCard(for item: ExperimentFeedItem) -> some View {
        Button(action: {
            appState.sendStudentMessage("Can we make the \(item.title)?")
        }) {
            HStack(spacing: 12) {
                // Thumbnail icon container
                ZStack {
                    RoundedRectangle(cornerRadius: 12, style: .continuous)
                        .fill(
                            LinearGradient(
                                colors: [Color(red: 0.20, green: 0.35, blue: 0.65), Color(red: 0.35, green: 0.20, blue: 0.60)],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .frame(width: 52, height: 52)

                    Image(systemName: item.sfSymbol)
                        .font(.system(size: 22, weight: .bold))
                        .foregroundColor(.white)
                }

                VStack(alignment: .leading, spacing: 3) {
                    Text(item.title)
                        .font(.system(size: 13, weight: .bold, design: .rounded))
                        .foregroundColor(.white)
                        .lineLimit(1)

                    Text(item.discipline)
                        .font(.system(size: 11, weight: .medium, design: .rounded))
                        .foregroundColor(Color(red: 0.43, green: 0.63, blue: 1.00))

                    HStack(spacing: 8) {
                        HStack(spacing: 3) {
                            Image(systemName: "clock")
                            Text("\(item.estimatedMinutes) min")
                        }
                        .font(.system(size: 10, weight: .medium))
                        .foregroundColor(.white.opacity(0.5))

                        Text("•")
                            .foregroundColor(.white.opacity(0.3))

                        Text(item.scrapsNeeded)
                            .font(.system(size: 10))
                            .foregroundColor(.white.opacity(0.6))
                            .lineLimit(1)
                    }
                }

                Spacer()

                Image(systemName: "chevron.right")
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundColor(.white.opacity(0.3))
            }
            .padding(10)
            .background(
                RoundedRectangle(cornerRadius: 14, style: .continuous)
                    .fill(Color(red: 0.09, green: 0.13, blue: 0.22))
                    .overlay(
                        RoundedRectangle(cornerRadius: 14, style: .continuous)
                            .stroke(Color.white.opacity(0.08), lineWidth: 1)
                    )
            )
        }
        .buttonStyle(.plain)
    }
}
