import SwiftUI

public struct SettingsView: View {
    @ObservedObject var appState: AppState
    @ObservedObject var cloudSync = CloudSyncService.shared
    @Environment(\.dismiss) private var dismiss

    @State private var geminiKey: String = ""
    @State private var backendURL: String = "http://localhost:8787"
    @State private var studentName: String = ""
    @State private var gradeBand: String = "Grade 3"

    public init(appState: AppState) {
        self.appState = appState
    }

    public var body: some View {
        VStack(spacing: 20) {
            // Header
            HStack {
                Image(systemName: "gearshape.fill")
                    .foregroundColor(Color(red: 0.43, green: 0.63, blue: 1.00))
                Text("CURIOFORGE SETTINGS")
                    .font(.system(size: 15, weight: .heavy, design: .rounded))
                    .foregroundColor(.white)
                Spacer()
                Button("Done") {
                    saveSettings()
                    dismiss()
                }
                .keyboardShortcut(.defaultAction)
                .padding(.horizontal, 14)
                .padding(.vertical, 6)
                .background(Capsule().fill(Color.blue))
                .foregroundColor(.white)
            }
            .padding(.bottom, 4)

            Divider()
                .background(Color.white.opacity(0.12))

            Form {
                // Section 1: AI Engine Keys
                Section(header: Text("GOOGLE GEMINI MULTIMODAL API (LLM + VLM)").foregroundColor(.cyan).font(.system(size: 11, weight: .bold))) {
                    VStack(alignment: .leading, spacing: 4) {
                        SecureField("Gemini API Key (leave empty for realistic offline mock)", text: $geminiKey)
                            .textFieldStyle(.roundedBorder)

                        Text("Used for live Socratic reasoning, camera scrap vision, and physical verification.")
                            .font(.system(size: 10))
                            .foregroundColor(.white.opacity(0.5))
                    }

                    TextField("Core Backend URL", text: $backendURL)
                        .textFieldStyle(.roundedBorder)
                }

                // Section 2: Multilingual Settings
                Section(header: Text("LANGUAGE & REGIONAL LOCALIZATION").foregroundColor(.cyan).font(.system(size: 11, weight: .bold))) {
                    Picker("Primary Language", selection: $appState.selectedLanguage) {
                        ForEach(SupportedLanguage.allCases, id: \.self) { lang in
                            Text("\(lang.flag) \(lang.displayName)").tag(lang)
                        }
                    }
                }

                // Section 3: Cloud & Persistence (Firebase / Supabase)
                Section(header: Text("CLOUD STORAGE & AUTHENTICATION").foregroundColor(.cyan).font(.system(size: 11, weight: .bold))) {
                    HStack {
                        Image(systemName: "icloud.fill")
                            .foregroundColor(.blue)
                        Text("Provider: \(cloudSync.cloudProvider)")
                            .font(.system(size: 12, weight: .medium))
                            .foregroundColor(.white)
                        Spacer()
                        Text("Active")
                            .font(.system(size: 10, weight: .bold))
                            .padding(.horizontal, 6)
                            .padding(.vertical, 2)
                            .background(Capsule().fill(Color.green.opacity(0.3)))
                            .foregroundColor(.green)
                    }

                    TextField("Student Name", text: $studentName)
                        .textFieldStyle(.roundedBorder)

                    TextField("Grade Band", text: $gradeBand)
                        .textFieldStyle(.roundedBorder)
                }
            }
            .formStyle(.grouped)
        }
        .padding(24)
        .frame(width: 520, height: 440)
        .background(Color(red: 0.05, green: 0.08, blue: 0.14))
        .onAppear {
            geminiKey = APIClient.shared.directGeminiKey
            backendURL = APIClient.shared.backendBaseURL
            studentName = cloudSync.profile.name
            gradeBand = cloudSync.profile.gradeBand
        }
    }

    private func saveSettings() {
        APIClient.shared.directGeminiKey = geminiKey.trimmingCharacters(in: .whitespacesAndNewlines)
        APIClient.shared.backendBaseURL = backendURL.trimmingCharacters(in: .whitespacesAndNewlines)
        cloudSync.profile.name = studentName.trimmingCharacters(in: .whitespacesAndNewlines)
        cloudSync.profile.gradeBand = gradeBand.trimmingCharacters(in: .whitespacesAndNewlines)
    }
}
