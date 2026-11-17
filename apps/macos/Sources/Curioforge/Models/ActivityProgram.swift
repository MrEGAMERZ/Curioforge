import Foundation
import CoreGraphics

public struct ScrapItem: Identifiable, Codable, Hashable {
    public let id: String
    public let name: String
    public let confidence: Double
    public let boxX: Double
    public let boxY: Double
    public let boxWidth: Double
    public let boxHeight: Double
    public let isEssential: Bool
    public let alternative: String?

    public init(
        id: String = UUID().uuidString,
        name: String,
        confidence: Double = 0.95,
        boxX: Double = 0.2,
        boxY: Double = 0.2,
        boxWidth: Double = 0.3,
        boxHeight: Double = 0.3,
        isEssential: Bool = true,
        alternative: String? = nil
    ) {
        self.id = id
        self.name = name
        self.confidence = confidence
        self.boxX = boxX
        self.boxY = boxY
        self.boxWidth = boxWidth
        self.boxHeight = boxHeight
        self.isEssential = isEssential
        self.alternative = alternative
    }

    public var normalizedRect: CGRect {
        CGRect(x: boxX, y: boxY, width: boxWidth, height: boxHeight)
    }
}

public struct PredictionOption: Identifiable, Codable, Hashable {
    public let id: String
    public let label: String
    public let emoji: String
    public let reactionText: String

    public init(id: String, label: String, emoji: String, reactionText: String) {
        self.id = id
        self.label = label
        self.emoji = emoji
        self.reactionText = reactionText
    }
}

public struct PredictionQuestion: Identifiable, Codable, Hashable {
    public let id: String
    public let question: String
    public let spokenText: String
    public let options: [PredictionOption]
    public let correctOptionId: String
    public let scienceExplanation: String

    public init(
        id: String = UUID().uuidString,
        question: String,
        spokenText: String,
        options: [PredictionOption],
        correctOptionId: String,
        scienceExplanation: String
    ) {
        self.id = id
        self.question = question
        self.spokenText = spokenText
        self.options = options
        self.correctOptionId = correctOptionId
        self.scienceExplanation = scienceExplanation
    }
}

public struct ActivityStep: Identifiable, Codable, Hashable {
    public let id: String
    public let stepNumber: Int
    public let title: String
    public let instruction: String
    public let spokenText: String
    public let sfSymbol: String
    public let safetyTip: String?
    public var isCompleted: Bool

    public init(
        id: String = UUID().uuidString,
        stepNumber: Int,
        title: String,
        instruction: String,
        spokenText: String,
        sfSymbol: String,
        safetyTip: String? = nil,
        isCompleted: Bool = false
    ) {
        self.id = id
        self.stepNumber = stepNumber
        self.title = title
        self.instruction = instruction
        self.spokenText = spokenText
        self.sfSymbol = sfSymbol
        self.safetyTip = safetyTip
        self.isCompleted = isCompleted
    }
}

public struct ScienceConcept: Identifiable, Codable, Hashable {
    public let id: String
    public let name: String
    public let explanation: String
    public let curriculumTag: String

    public init(
        id: String = UUID().uuidString,
        name: String,
        explanation: String,
        curriculumTag: String
    ) {
        self.id = id
        self.name = name
        self.explanation = explanation
        self.curriculumTag = curriculumTag
    }
}

public struct ActivityPlan: Identifiable, Codable, Hashable {
    public let id: String
    public let title: String
    public let tagline: String
    public let discipline: String
    public let gradeBand: String
    public let estimatedMinutes: Int
    public let concepts: [ScienceConcept]
    public let materials: [ScrapItem]
    public let prediction: PredictionQuestion
    public var steps: [ActivityStep]
    public let safetyLevel: String
    public let adultSupervisionRequired: Bool
    public var isVerified: Bool
    public var verificationNote: String?

    public init(
        id: String = UUID().uuidString,
        title: String,
        tagline: String,
        discipline: String = "Physics",
        gradeBand: String = "Grades 2-5",
        estimatedMinutes: Int = 8,
        concepts: [ScienceConcept],
        materials: [ScrapItem],
        prediction: PredictionQuestion,
        steps: [ActivityStep],
        safetyLevel: String = "100% Kid-Safe (No Fire/Blades)",
        adultSupervisionRequired: Bool = false,
        isVerified: Bool = false,
        verificationNote: String? = nil
    ) {
        self.id = id
        self.title = title
        self.tagline = tagline
        self.discipline = discipline
        self.gradeBand = gradeBand
        self.estimatedMinutes = estimatedMinutes
        self.concepts = concepts
        self.materials = materials
        self.prediction = prediction
        self.steps = steps
        self.safetyLevel = safetyLevel
        self.adultSupervisionRequired = adultSupervisionRequired
        self.isVerified = isVerified
        self.verificationNote = verificationNote
    }

    public static let sampleJetCar = ActivityPlan(
        title: "Jet-Propelled Balloon Rocket Car",
        tagline: "Turn a scrap plastic bottle into a high-speed Newton's Third Law racer!",
        discipline: "Physics & Mechanics",
        gradeBand: "Grades 2-4",
        estimatedMinutes: 8,
        concepts: [
            ScienceConcept(name: "Newton's 3rd Law", explanation: "Every action has an equal and opposite reaction. Escaping air pushes forward!", curriculumTag: "NCERT Class 3-8 / NGSS-PS2"),
            ScienceConcept(name: "Pneumatics & Air Pressure", explanation: "Compressed air inside the balloon stores potential energy.", curriculumTag: "Forces & Motion"),
            ScienceConcept(name: "Friction & Rolling", explanation: "Round bottle caps minimize surface drag against the floor.", curriculumTag: "Mechanics")
        ],
        materials: [
            ScrapItem(name: "Empty 500ml Plastic Bottle", confidence: 0.98, boxX: 0.15, boxY: 0.35, boxWidth: 0.45, boxHeight: 0.28, isEssential: true),
            ScrapItem(name: "Latex Balloon (or rubber glove finger)", confidence: 0.94, boxX: 0.62, boxY: 0.20, boxWidth: 0.25, boxHeight: 0.25, isEssential: true),
            ScrapItem(name: "Plastic Straw (or hollow pen tube)", confidence: 0.92, boxX: 0.48, boxY: 0.65, boxWidth: 0.38, boxHeight: 0.12, isEssential: true),
            ScrapItem(name: "Tape / Rubber Bands", confidence: 0.96, boxX: 0.18, boxY: 0.70, boxWidth: 0.22, boxHeight: 0.18, isEssential: true),
            ScrapItem(name: "4 Plastic Bottle Caps (Wheels)", confidence: 0.91, boxX: 0.08, boxY: 0.15, boxWidth: 0.25, boxHeight: 0.18, isEssential: false, alternative: "Cardboard circles or toy wheels")
        ],
        prediction: PredictionQuestion(
            question: "When we let the inflated balloon go through the straw, which way will the car travel?",
            spokenText: "What do you predict will happen when air shoots backward out of the straw? Does the car zoom forward, stay still, or spin around?",
            options: [
                PredictionOption(id: "forward", label: "Zooms Forward!", emoji: "🚀", reactionText: "Spot on! The backward air blast forces the car forward! That is action and reaction."),
                PredictionOption(id: "still", label: "Stays Still", emoji: "🛑", reactionText: "Not quite—air has real mass and force when it escapes quickly!"),
                PredictionOption(id: "spins", label: "Spins in Circles", emoji: "🔄", reactionText: "If the straw is straight, it shoots in a straight line; if curved, it spins!")
            ],
            correctOptionId: "forward",
            scienceExplanation: "As the stretched rubber pushes air backward at high speed, the equal and opposite reaction force propels the car forward across the table."
        ),
        steps: [
            ActivityStep(
                stepNumber: 1,
                title: "Prepare the Jet Straw",
                instruction: "Insert one end of the plastic drinking straw into the neck of the balloon. Wrap tape tightly around the neck so air can only escape through the straw.",
                spokenText: "First, slide the straw inside your balloon and seal it with tape so no air leaks out.",
                sfSymbol: "arrow.right.circle.fill",
                safetyTip: "Check that the straw is not pinched closed."
            ),
            ActivityStep(
                stepNumber: 2,
                title: "Mount the Engine to the Chassis",
                instruction: "Tape the straw along the top of your plastic bottle so the open end of the straw sticks out of the back like an exhaust pipe.",
                spokenText: "Tape the straw straight down the back of the bottle. The open straw is your jet engine!",
                sfSymbol: "car.side.fill",
                safetyTip: "Keep the straw pointing straight backward for maximum forward speed."
            ),
            ActivityStep(
                stepNumber: 3,
                title: "Attach the Axles & Caps",
                instruction: "Tape two wooden skewers or pencils under the bottle, and push bottle caps on each side for wheels.",
                spokenText: "Tape your two pencils underneath for axles, and snap on your bottle cap wheels.",
                sfSymbol: "circle.grid.2x1.fill",
                safetyTip: "Make sure wheels spin freely without rubbing against the bottle."
            ),
            ActivityStep(
                stepNumber: 4,
                title: "Fuel & Launch!",
                instruction: "Blow through the open straw to inflate the balloon. Pinch the tip of the straw, place the car on a smooth floor, and release!",
                spokenText: "Blow into the straw to pump up your balloon! Put the car on the floor, count down from three, and let it rip!",
                sfSymbol: "paperplane.fill",
                safetyTip: "Stand back and watch the racer fly!"
            )
        ]
    )
}
