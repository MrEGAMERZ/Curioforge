import Foundation

public struct StudentProfile: Codable {
    public var id: String
    public var name: String
    public var gradeBand: String
    public var language: SupportedLanguage
    public var completedInventionsCount: Int
    public var earnedBadges: [String]

    public static let `default` = StudentProfile(
        id: "student-demo-01",
        name: "Aarav Sharma",
        gradeBand: "Grade 3",
        language: .english,
        completedInventionsCount: 3,
        earnedBadges: ["Newton Junior", "Scrap Master", "Capillary Wizard"]
    )
}

public final class CloudSyncService: ObservableObject {
    public static let shared = CloudSyncService()

    @Published public var profile: StudentProfile = .default
    @Published public var isSyncing: Bool = false
    @Published public var isCloudConnected: Bool = true
    @Published public var cloudProvider: String = "Firebase Cloud Firestore & Storage"

    private let userDefaultsKey = "curioforge_student_profile"

    private init() {
        loadLocalProfile()
    }

    public func recordCompletedInvention(title: String, badge: String) {
        profile.completedInventionsCount += 1
        if !profile.earnedBadges.contains(badge) {
            profile.earnedBadges.append(badge)
        }
        saveLocalProfile()
        syncToCloud()
    }

    private func loadLocalProfile() {
        if let data = UserDefaults.standard.data(forKey: userDefaultsKey),
           let saved = try? JSONDecoder().decode(StudentProfile.self, from: data) {
            self.profile = saved
        }
    }

    private func saveLocalProfile() {
        if let data = try? JSONEncoder().encode(profile) {
            UserDefaults.standard.set(data, forKey: userDefaultsKey)
        }
    }

    public func syncToCloud() {
        isSyncing = true
        // Simulated or real REST sync with Supabase / Firebase
        DispatchQueue.global().asyncAfter(deadline: .now() + 0.6) { [weak self] in
            DispatchQueue.main.async {
                self?.isSyncing = false
            }
        }
    }
}
