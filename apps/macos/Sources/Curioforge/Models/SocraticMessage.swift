import Foundation

public enum MessageSender: String, Codable {
    case student
    case curioforge
    case system
}

public enum SupportedLanguage: String, Codable, CaseIterable {
    case english = "en-US"
    case hindi = "hi-IN"
    case hinglish = "hi-Latn"
    case spanish = "es-ES"

    public var displayName: String {
        switch self {
        case .english: return "English"
        case .hindi: return "हिंदी (Hindi)"
        case .hinglish: return "Hinglish"
        case .spanish: return "Español"
        }
    }

    public var flag: String {
        switch self {
        case .english: return "🇬🇧"
        case .hindi: return "🇮🇳"
        case .hinglish: return "🇮🇳"
        case .spanish: return "🇪🇸"
        }
    }
}

public struct SocraticMessage: Identifiable, Codable, Hashable {
    public let id: String
    public let sender: MessageSender
    public let text: String
    public let timestamp: Date
    public var audioSpoken: Bool
    public let language: SupportedLanguage
    public let suggestedChips: [String]

    public init(
        id: String = UUID().uuidString,
        sender: MessageSender,
        text: String,
        timestamp: Date = Date(),
        audioSpoken: Bool = false,
        language: SupportedLanguage = .english,
        suggestedChips: [String] = []
    ) {
        self.id = id
        self.sender = sender
        self.text = text
        self.timestamp = timestamp
        self.audioSpoken = audioSpoken
        self.language = language
        self.suggestedChips = suggestedChips
    }
}

public struct ExperimentFeedItem: Identifiable, Codable, Hashable {
    public let id: String
    public let title: String
    public let discipline: String
    public let estimatedMinutes: Int
    public let sfSymbol: String
    public let scrapsNeeded: String
    public let difficultyBadge: String
    public let gradientColors: [String]

    public init(
        id: String = UUID().uuidString,
        title: String,
        discipline: String,
        estimatedMinutes: Int,
        sfSymbol: String,
        scrapsNeeded: String,
        difficultyBadge: String = "Zero-Cost",
        gradientColors: [String] = ["#4F8CFF", "#8B5CF6"]
    ) {
        self.id = id
        self.title = title
        self.discipline = discipline
        self.estimatedMinutes = estimatedMinutes
        self.sfSymbol = sfSymbol
        self.scrapsNeeded = scrapsNeeded
        self.difficultyBadge = difficultyBadge
        self.gradientColors = gradientColors
    }

    public static let sampleFeed: [ExperimentFeedItem] = [
        ExperimentFeedItem(
            title: "Vortex Smoke/Air Cannon",
            discipline: "Physics • Pneumatics",
            estimatedMinutes: 6,
            sfSymbol: "wind",
            scrapsNeeded: "Plastic cup, balloon, tape",
            difficultyBadge: "Super Easy"
        ),
        ExperimentFeedItem(
            title: "Saltwater & Penny LED Battery",
            discipline: "Chemistry • Electrolytes",
            estimatedMinutes: 10,
            sfSymbol: "bolt.fill",
            scrapsNeeded: "Pennies/copper, zinc washers, salt water, cardboard",
            difficultyBadge: "Zero-Cost"
        ),
        ExperimentFeedItem(
            title: "Straw Pan Flute & Pitch",
            discipline: "Physics • Acoustics",
            estimatedMinutes: 5,
            sfSymbol: "music.note",
            scrapsNeeded: "6 drinking straws, scissors, tape",
            difficultyBadge: "Easy"
        ),
        ExperimentFeedItem(
            title: "Capillary Rainbow Walking Water",
            discipline: "Chemistry & Biology",
            estimatedMinutes: 8,
            sfSymbol: "drop.fill",
            scrapsNeeded: "3 glasses, paper towels, food dye/turmeric",
            difficultyBadge: "Zero-Cost"
        )
    ]
}
