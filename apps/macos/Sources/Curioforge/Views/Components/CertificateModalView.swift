import SwiftUI

public struct CertificateModalView: View {
    @ObservedObject var appState: AppState
    @Environment(\.dismiss) private var dismiss
    @State private var isLowInkMode: Bool = false

    public init(appState: AppState) {
        self.appState = appState
    }

    public var body: some View {
        VStack(spacing: 20) {
            // Certificate Canvas
            VStack(spacing: 16) {
                // Header
                HStack {
                    Image(systemName: "sparkles")
                        .foregroundColor(isLowInkMode ? .black : .orange)
                        .font(.system(size: 20))
                    Text("CURIOFORGE OFFICIAL STEM CERTIFICATE")
                        .font(.system(size: 14, weight: .heavy, design: .monospaced))
                        .foregroundColor(isLowInkMode ? .black : Color.cyan)
                    Spacer()
                    Text("NO. CF-\(Int.random(in: 1000...9999))")
                        .font(.system(size: 11, weight: .bold, design: .monospaced))
                        .foregroundColor(isLowInkMode ? .black : .white.opacity(0.4))
                }

                Divider()
                    .background(isLowInkMode ? Color.black : Color.white.opacity(0.15))

                // Title
                VStack(spacing: 4) {
                    Text("CERTIFICATE OF INVENTIVE MASTERY")
                        .font(.system(size: 22, weight: .heavy, design: .rounded))
                        .foregroundColor(isLowInkMode ? .black : .white)

                    Text("This honors that")
                        .font(.system(size: 12, design: .rounded))
                        .foregroundColor(isLowInkMode ? .black.opacity(0.7) : .white.opacity(0.6))

                    Text(CloudSyncService.shared.profile.name)
                        .font(.system(size: 28, weight: .black, design: .rounded))
                        .foregroundColor(isLowInkMode ? .black : Color(red: 0.43, green: 0.63, blue: 1.00))
                        .underline()

                    Text("has successfully transformed household scrap into a working invention:")
                        .font(.system(size: 12, design: .rounded))
                        .foregroundColor(isLowInkMode ? .black.opacity(0.7) : .white.opacity(0.6))
                }

                // Project Box
                VStack(spacing: 6) {
                    Text(appState.activityPlan.title)
                        .font(.system(size: 18, weight: .bold, design: .rounded))
                        .foregroundColor(isLowInkMode ? .black : .white)

                    HStack(spacing: 12) {
                        Label("Physics & Mechanics", systemImage: "atom")
                        Label("NCERT Class 3-8 / NGSS", systemImage: "graduationcap.fill")
                    }
                    .font(.system(size: 11, weight: .semibold, design: .rounded))
                    .foregroundColor(isLowInkMode ? .black.opacity(0.8) : Color.cyan)
                }
                .padding(14)
                .frame(maxWidth: .infinity)
                .background(
                    RoundedRectangle(cornerRadius: 12)
                        .fill(isLowInkMode ? Color.white : Color(red: 0.10, green: 0.15, blue: 0.25))
                        .overlay(
                            RoundedRectangle(cornerRadius: 12)
                                .stroke(isLowInkMode ? Color.black : Color.blue.opacity(0.3), lineWidth: 1)
                        )
                )

                // Gold Seal and Sign-off
                HStack {
                    VStack(alignment: .leading, spacing: 2) {
                        Text("VERIFIED BY:")
                            .font(.system(size: 9, weight: .heavy))
                            .foregroundColor(isLowInkMode ? .black : .white.opacity(0.5))
                        Text("Gemini 2.0 Multimodal VLM")
                            .font(.system(size: 11, weight: .bold))
                            .foregroundColor(isLowInkMode ? .black : .white)
                        Text(Date().formatted(date: .long, time: .omitted))
                            .font(.system(size: 10))
                            .foregroundColor(isLowInkMode ? .black : .white.opacity(0.6))
                    }

                    Spacer()

                    // Seal Icon
                    ZStack {
                        Circle()
                            .fill(isLowInkMode ? Color.white : Color.yellow.opacity(0.2))
                            .frame(width: 56, height: 56)
                            .overlay(Circle().stroke(isLowInkMode ? Color.black : Color.yellow, lineWidth: 2))

                        Image(systemName: "rosette")
                            .font(.system(size: 32))
                            .foregroundColor(isLowInkMode ? .black : .yellow)
                    }
                }
            }
            .padding(28)
            .background(
                RoundedRectangle(cornerRadius: 18, style: .continuous)
                    .fill(isLowInkMode ? Color.white : Color(red: 0.07, green: 0.10, blue: 0.18))
                    .overlay(
                        RoundedRectangle(cornerRadius: 18, style: .continuous)
                            .stroke(isLowInkMode ? Color.black : Color.yellow.opacity(0.4), lineWidth: 2)
                    )
            )

            // Toolbar
            HStack(spacing: 16) {
                Toggle("Low-Ink Comic Mode (For Rural Printing)", isOn: $isLowInkMode)
                    .toggleStyle(.checkbox)
                    .foregroundColor(.white)

                Spacer()

                Button("Done") {
                    dismiss()
                }
                .keyboardShortcut(.defaultAction)
                .padding(.horizontal, 16)
                .padding(.vertical, 8)
                .background(Capsule().fill(Color.blue))
                .foregroundColor(.white)
            }
            .padding(.horizontal, 8)
        }
        .padding(24)
        .frame(width: 620, height: 520)
        .background(Color(red: 0.04, green: 0.06, blue: 0.10))
    }
}
