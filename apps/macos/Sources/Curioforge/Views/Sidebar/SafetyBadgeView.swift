import SwiftUI

public struct SafetyBadgeView: View {
    @ObservedObject var appState: AppState

    public init(appState: AppState) {
        self.appState = appState
    }

    public var body: some View {
        ScrollView {
            VStack(alignment: .leading, spacing: 14) {
                // Safety Shield Banner
                HStack(spacing: 12) {
                    ZStack {
                        Circle()
                            .fill(Color.green.opacity(0.2))
                            .frame(width: 44, height: 44)
                        Image(systemName: "checkmark.shield.fill")
                            .font(.system(size: 22))
                            .foregroundColor(.green)
                    }

                    VStack(alignment: .leading, spacing: 2) {
                        Text("100% KID-SAFE EXPERIMENT")
                            .font(.system(size: 12, weight: .heavy, design: .rounded))
                            .foregroundColor(.green)
                        Text("No toxic chemicals, no open fire, no dangerous blades.")
                            .font(.system(size: 11, design: .rounded))
                            .foregroundColor(.white.opacity(0.7))
                    }
                }
                .padding(12)
                .background(
                    RoundedRectangle(cornerRadius: 14)
                        .fill(Color.green.opacity(0.10))
                        .overlay(
                            RoundedRectangle(cornerRadius: 14)
                                .stroke(Color.green.opacity(0.25), lineWidth: 1)
                        )
                )

                // Curriculum Alignment Section
                VStack(alignment: .leading, spacing: 8) {
                    Text("📚 CURRICULUM CONCEPTS (NCERT & NGSS)")
                        .font(.system(size: 11, weight: .heavy, design: .rounded))
                        .foregroundColor(Color.cyan)

                    ForEach(appState.activityPlan.concepts) { concept in
                        VStack(alignment: .leading, spacing: 4) {
                            HStack {
                                Text(concept.name)
                                    .font(.system(size: 12, weight: .bold, design: .rounded))
                                    .foregroundColor(.white)
                                Spacer()
                                Text(concept.curriculumTag)
                                    .font(.system(size: 9, weight: .semibold))
                                    .padding(.horizontal, 6)
                                    .padding(.vertical, 2)
                                    .background(Capsule().fill(Color.blue.opacity(0.25)))
                                    .foregroundColor(Color(red: 0.43, green: 0.63, blue: 1.00))
                            }

                            Text(concept.explanation)
                                .font(.system(size: 11, design: .rounded))
                                .foregroundColor(.white.opacity(0.75))
                                .lineSpacing(2)
                        }
                        .padding(10)
                        .background(
                            RoundedRectangle(cornerRadius: 10)
                                .fill(Color(red: 0.08, green: 0.12, blue: 0.20))
                        )
                    }
                }

                // Parent/Teacher Gate Summary
                VStack(alignment: .leading, spacing: 8) {
                    Text("👨‍🏫 PARENT & TEACHER SUPERVISE")
                        .font(.system(size: 11, weight: .heavy, design: .rounded))
                        .foregroundColor(Color(red: 0.85, green: 0.70, blue: 1.00))

                    Text("Curioforge activities emphasize critical thinking, hands-on mechanical intuition, and physical safety. No personal data is stored without local consent.")
                        .font(.system(size: 11, design: .rounded))
                        .foregroundColor(.white.opacity(0.7))
                        .lineSpacing(2)

                    HStack {
                        Image(systemName: "hand.raised.fill")
                            .foregroundColor(.orange)
                        Text("Scissors / cutting required: Adult assistance recommended for wheel punching.")
                            .font(.system(size: 10, weight: .medium))
                            .foregroundColor(.orange)
                    }
                    .padding(8)
                    .background(
                        RoundedRectangle(cornerRadius: 8)
                            .fill(Color.orange.opacity(0.10))
                    )
                }
            }
            .padding(10)
        }
    }
}
