import SwiftUI

public struct SocraticChatView: View {
    @ObservedObject var appState: AppState
    @State private var inputText: String = ""

    public init(appState: AppState) {
        self.appState = appState
    }

    public var body: some View {
        VStack(spacing: 12) {
            // Chat History
            ScrollViewReader { proxy in
                ScrollView {
                    LazyVStack(spacing: 14) {
                        ForEach(appState.messages) { message in
                            messageBubble(for: message)
                        }

                        if appState.isRecording && !appState.liveTranscript.isEmpty {
                            HStack {
                                Spacer()
                                Text(appState.liveTranscript)
                                    .font(.system(size: 13, weight: .medium, design: .rounded))
                                    .foregroundColor(.white)
                                    .padding(.horizontal, 14)
                                    .padding(.vertical, 10)
                                    .background(
                                        RoundedRectangle(cornerRadius: 16)
                                            .fill(Color.blue.opacity(0.4))
                                    )
                                    .overlay(
                                        RoundedRectangle(cornerRadius: 16)
                                            .stroke(Color.cyan.opacity(0.6), lineWidth: 1)
                                    )
                            }
                        }
                    }
                    .padding(.horizontal, 4)
                    .padding(.top, 4)
                }
                .onChange(of: appState.messages.count) { _ in
                    if let last = appState.messages.last {
                        withAnimation {
                            proxy.scrollTo(last.id, anchor: .bottom)
                        }
                    }
                }
            }

            // Interactive Prediction Question Chips (if on prediction step)
            if appState.currentChapter == 2 || appState.stageMode == .simulator {
                VStack(alignment: .leading, spacing: 6) {
                    Text("💡 CHOOSE YOUR HYPOTHESIS:")
                        .font(.system(size: 10, weight: .heavy, design: .rounded))
                        .foregroundColor(Color(red: 0.43, green: 0.63, blue: 1.00))

                    HStack(spacing: 8) {
                        ForEach(appState.activityPlan.prediction.options) { option in
                            Button(action: {
                                appState.selectPrediction(optionId: option.id)
                            }) {
                                HStack(spacing: 6) {
                                    Text(option.emoji)
                                    Text(option.label)
                                        .font(.system(size: 11, weight: .semibold, design: .rounded))
                                }
                                .padding(.horizontal, 10)
                                .padding(.vertical, 7)
                                .background(
                                    Capsule()
                                        .fill(Color(red: 0.12, green: 0.18, blue: 0.32))
                                        .overlay(
                                            Capsule()
                                                .stroke(Color.blue.opacity(0.4), lineWidth: 1)
                                        )
                                )
                                .foregroundColor(.white)
                            }
                            .buttonStyle(.plain)
                        }
                    }
                }
                .padding(.horizontal, 4)
            }

            // Suggested Chips from the latest AI message
            if let lastBot = appState.messages.last(where: { $0.sender == .curioforge }),
               !lastBot.suggestedChips.isEmpty {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 8) {
                        ForEach(lastBot.suggestedChips, id: \.self) { chip in
                            Button(action: {
                                appState.sendStudentMessage(chip)
                            }) {
                                Text(chip)
                                    .font(.system(size: 11, weight: .medium, design: .rounded))
                                    .padding(.horizontal, 10)
                                    .padding(.vertical, 6)
                                    .background(
                                        Capsule()
                                            .fill(Color(red: 0.10, green: 0.15, blue: 0.25))
                                    )
                                    .overlay(
                                        Capsule().stroke(Color.white.opacity(0.12), lineWidth: 1)
                                    )
                                    .foregroundColor(.white.opacity(0.9))
                            }
                            .buttonStyle(.plain)
                        }
                    }
                }
                .frame(height: 28)
            }

            // Input Row
            HStack(spacing: 8) {
                TextField("Ask Curioforge or speak your idea...", text: $inputText)
                    .textFieldStyle(.plain)
                    .font(.system(size: 13, design: .rounded))
                    .padding(.horizontal, 12)
                    .padding(.vertical, 9)
                    .background(
                        RoundedRectangle(cornerRadius: 12)
                            .fill(Color(red: 0.08, green: 0.12, blue: 0.20))
                            .overlay(
                                RoundedRectangle(cornerRadius: 12)
                                    .stroke(Color.white.opacity(0.12), lineWidth: 1)
                            )
                    )
                    .foregroundColor(.white)
                    .onSubmit {
                        submitText()
                    }

                // Send Button
                Button(action: {
                    submitText()
                }) {
                    Image(systemName: "arrow.up.circle.fill")
                        .font(.system(size: 24))
                        .foregroundColor(inputText.trimmingCharacters(in: .whitespaces).isEmpty ? .gray : Color.blue)
                }
                .buttonStyle(.plain)
                .disabled(inputText.trimmingCharacters(in: .whitespaces).isEmpty)
            }
            .padding(.top, 4)
        }
    }

    private func submitText() {
        let text = inputText.trimmingCharacters(in: .whitespacesAndNewlines)
        guard !text.isEmpty else { return }
        inputText = ""
        appState.sendStudentMessage(text)
    }

    @ViewBuilder
    private func messageBubble(for message: SocraticMessage) -> some View {
        HStack(alignment: .top, spacing: 8) {
            if message.sender == .curioforge {
                // Robot / Mentor Avatar
                ZStack {
                    Circle()
                        .fill(
                            LinearGradient(
                                colors: [Color(red: 0.31, green: 0.55, blue: 1.00), Color(red: 0.55, green: 0.36, blue: 0.96)],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .frame(width: 28, height: 28)
                    Image(systemName: "sparkles")
                        .font(.system(size: 13, weight: .bold))
                        .foregroundColor(.white)
                }

                VStack(alignment: .leading, spacing: 6) {
                    Text(message.text)
                        .font(.system(size: 13, weight: .regular, design: .rounded))
                        .foregroundColor(Color(red: 0.92, green: 0.94, blue: 0.98))
                        .lineSpacing(3)
                        .fixedSize(horizontal: false, vertical: true)

                    // Replay Audio Button
                    HStack(spacing: 8) {
                        Button(action: {
                            SpeechSynthesizerService.shared.speak(text: message.text, language: message.language)
                        }) {
                            HStack(spacing: 4) {
                                Image(systemName: "speaker.wave.2.fill")
                                Text("Listen")
                            }
                            .font(.system(size: 10, weight: .medium, design: .rounded))
                            .foregroundColor(Color.cyan)
                        }
                        .buttonStyle(.plain)

                        Text(message.language.displayName)
                            .font(.system(size: 9, weight: .medium))
                            .foregroundColor(.white.opacity(0.4))
                    }
                }
                .padding(12)
                .background(
                    RoundedRectangle(cornerRadius: 16, style: .continuous)
                        .fill(Color(red: 0.10, green: 0.14, blue: 0.24))
                        .overlay(
                            RoundedRectangle(cornerRadius: 16, style: .continuous)
                                .stroke(Color.white.opacity(0.08), lineWidth: 1)
                        )
                )

                Spacer(minLength: 20)
            } else {
                Spacer(minLength: 20)

                VStack(alignment: .trailing, spacing: 4) {
                    Text(message.text)
                        .font(.system(size: 13, weight: .medium, design: .rounded))
                        .foregroundColor(.white)
                        .lineSpacing(3)
                        .fixedSize(horizontal: false, vertical: true)
                }
                .padding(12)
                .background(
                    RoundedRectangle(cornerRadius: 16, style: .continuous)
                        .fill(
                            LinearGradient(
                                colors: [Color(red: 0.23, green: 0.44, blue: 0.88), Color(red: 0.45, green: 0.30, blue: 0.82)],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                )

                // Student Avatar
                ZStack {
                    Circle()
                        .fill(Color.blue.opacity(0.6))
                        .frame(width: 28, height: 28)
                    Image(systemName: "person.crop.circle.fill")
                        .font(.system(size: 16))
                        .foregroundColor(.white)
                }
            }
        }
    }
}
