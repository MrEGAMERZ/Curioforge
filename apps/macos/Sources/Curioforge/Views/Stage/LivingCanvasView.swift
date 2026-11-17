import SwiftUI

public struct LivingCanvasView: View {
    @ObservedObject var appState: AppState

    public init(appState: AppState) {
        self.appState = appState
    }

    public var body: some View {
        GeometryReader { geo in
            VStack(spacing: 0) {
                // Top Telemetry Header
                HStack(spacing: 16) {
                    telemetryCard(
                        title: "AIR PRESSURE",
                        value: "\(Int(appState.simulation.airPressure * 100))%",
                        symbol: "gauge.with.needle.fill",
                        color: Color.cyan
                    )

                    telemetryCard(
                        title: "TOP VELOCITY",
                        value: String(format: "%.1f m/s", appState.simulation.calculatedSpeed),
                        symbol: "speedometer",
                        color: Color.blue
                    )

                    telemetryCard(
                        title: "EST. DISTANCE",
                        value: String(format: "%.1f m", appState.simulation.calculatedDistanceMeters),
                        symbol: "ruler.fill",
                        color: Color.purple
                    )

                    Spacer()

                    // Launch Simulation Rocket Button
                    Button(action: {
                        appState.runSimulation()
                    }) {
                        HStack(spacing: 8) {
                            Image(systemName: "rocket.fill")
                            Text(appState.simulation.isRunning ? "RUNNING..." : "TEST LAUNCH")
                        }
                        .font(.system(size: 13, weight: .heavy, design: .rounded))
                        .foregroundColor(.white)
                        .padding(.horizontal, 18)
                        .padding(.vertical, 10)
                        .background(
                            Capsule()
                                .fill(LinearGradient(colors: [Color.blue, Color.purple], startPoint: .leading, endPoint: .trailing))
                        )
                        .shadow(color: Color.blue.opacity(0.4), radius: 6)
                    }
                    .buttonStyle(.plain)
                    .disabled(appState.simulation.isRunning)
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 12)
                .background(Color.black.opacity(0.4))

                // The 2D Physics Track Stage
                ZStack(alignment: .bottomLeading) {
                    // Track Floor
                    Rectangle()
                        .fill(
                            LinearGradient(
                                colors: [Color(red: 0.10, green: 0.14, blue: 0.22), Color(red: 0.05, green: 0.08, blue: 0.12)],
                                startPoint: .top,
                                endPoint: .bottom
                            )
                        )

                    // Track Grid & Meter Lines
                    VStack {
                        Spacer()
                        HStack(spacing: 0) {
                            ForEach(0..<10) { meter in
                                VStack(alignment: .leading, spacing: 2) {
                                    Rectangle()
                                        .fill(Color.white.opacity(0.2))
                                        .frame(width: 1, height: 18)
                                    Text("\(meter)m")
                                        .font(.system(size: 9, weight: .bold, design: .monospaced))
                                        .foregroundColor(.white.opacity(0.4))
                                }
                                if meter < 9 {
                                    Spacer()
                                }
                            }
                        }
                        .padding(.horizontal, 24)
                        .padding(.bottom, 20)
                    }

                    // Start Line
                    Rectangle()
                        .fill(Color.cyan.opacity(0.6))
                        .frame(width: 2, height: 90)
                        .offset(x: 24, y: -20)

                    // Finish Flag
                    VStack {
                        Image(systemName: "flag.checkered")
                            .font(.system(size: 20))
                            .foregroundColor(.yellow)
                        Rectangle()
                            .fill(Color.yellow.opacity(0.8))
                            .frame(width: 2, height: 70)
                    }
                    .offset(x: geo.size.width - 45, y: -20)

                    // The Animated Balloon Rocket Car
                    let carWidth: CGFloat = 110
                    let trackWidth = max(50, geo.size.width - carWidth - 60)
                    let carX = 24 + (trackWidth * CGFloat(appState.simulation.currentPosition))

                    HStack(spacing: -6) {
                        // Exhaust Thrust Particles (when running)
                        if appState.simulation.isRunning {
                            HStack(spacing: 2) {
                                ForEach(0..<3) { _ in
                                    Circle()
                                        .fill(Color.cyan.opacity(0.7))
                                        .frame(width: 6, height: 6)
                                        .blur(radius: 1)
                                }
                            }
                            .offset(x: -8, y: -10)
                        }

                        // Straw Nozzle
                        Rectangle()
                            .fill(Color.orange)
                            .frame(width: 24, height: 6)
                            .offset(y: -10)

                        // Inflated Balloon (expands dynamically with air pressure slider)
                        let balloonSize = 36 + CGFloat(appState.simulation.airPressure * 40)
                        ZStack {
                            Ellipse()
                                .fill(
                                    RadialGradient(
                                        colors: [Color.pink.opacity(0.9), Color.red.opacity(0.85)],
                                        center: .center,
                                        startRadius: 4,
                                        endRadius: balloonSize / 2
                                    )
                                )
                                .frame(width: balloonSize, height: balloonSize * 0.75)
                                .shadow(color: Color.red.opacity(0.5), radius: 6)

                            Text("💨")
                                .font(.system(size: 14))
                        }
                        .offset(y: -12)

                        // Plastic Bottle Chassis
                        ZStack {
                            RoundedRectangle(cornerRadius: 10)
                                .fill(Color.cyan.opacity(0.35))
                                .frame(width: 75, height: 28)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 10)
                                        .stroke(Color.cyan, lineWidth: 1.5)
                                )

                            Text("JET RACER")
                                .font(.system(size: 8, weight: .heavy, design: .rounded))
                                .foregroundColor(.white)
                        }
                        .offset(y: -6)
                    }
                    .overlay(
                        // Wheels (Bottle Caps)
                        HStack(spacing: 50) {
                            Circle()
                                .fill(Color.white)
                                .frame(width: 16, height: 16)
                                .overlay(Circle().stroke(Color.black, lineWidth: 2))

                            Circle()
                                .fill(Color.white)
                                .frame(width: 16, height: 16)
                                .overlay(Circle().stroke(Color.black, lineWidth: 2))
                        }
                        .offset(x: 34, y: 12)
                    )
                    .offset(x: carX, y: -45)
                    .animation(.easeOut(duration: 0.1), value: appState.simulation.currentPosition)
                }

                // Interactive Parameter Sliders
                HStack(spacing: 24) {
                    sliderControl(
                        title: "BALLOON AIR PRESSURE",
                        icon: "gauge",
                        value: $appState.simulation.airPressure,
                        range: 0.1...1.0,
                        unit: "%",
                        multiplier: 100
                    )

                    sliderControl(
                        title: "CHASSIS MASS",
                        icon: "scalemass.fill",
                        value: $appState.simulation.carMass,
                        range: 0.2...1.0,
                        unit: "g",
                        multiplier: 100
                    )

                    sliderControl(
                        title: "WHEEL FRICTION",
                        icon: "road.lanes",
                        value: $appState.simulation.wheelFriction,
                        range: 0.1...0.8,
                        unit: "μ",
                        multiplier: 100
                    )
                }
                .padding(.horizontal, 20)
                .padding(.vertical, 14)
                .background(Color(red: 0.07, green: 0.10, blue: 0.16))
            }
        }
        .onChange(of: appState.simulation.airPressure) { _ in
            appState.simulation.computePhysics()
        }
        .onChange(of: appState.simulation.carMass) { _ in
            appState.simulation.computePhysics()
        }
        .onChange(of: appState.simulation.wheelFriction) { _ in
            appState.simulation.computePhysics()
        }
    }

    @ViewBuilder
    private func telemetryCard(title: String, value: String, symbol: String, color: Color) -> some View {
        HStack(spacing: 8) {
            Image(systemName: symbol)
                .foregroundColor(color)
                .font(.system(size: 15))

            VStack(alignment: .leading, spacing: 1) {
                Text(title)
                    .font(.system(size: 9, weight: .bold, design: .rounded))
                    .foregroundColor(.white.opacity(0.5))
                Text(value)
                    .font(.system(size: 14, weight: .heavy, design: .monospaced))
                    .foregroundColor(.white)
            }
        }
        .padding(.horizontal, 10)
        .padding(.vertical, 6)
        .background(
            RoundedRectangle(cornerRadius: 8)
                .fill(Color.white.opacity(0.08))
        )
    }

    @ViewBuilder
    private func sliderControl(
        title: String,
        icon: String,
        value: Binding<Double>,
        range: ClosedRange<Double>,
        unit: String,
        multiplier: Double
    ) -> some View {
        VStack(alignment: .leading, spacing: 4) {
            HStack {
                Image(systemName: icon)
                    .font(.system(size: 11))
                    .foregroundColor(Color(red: 0.43, green: 0.63, blue: 1.00))
                Text(title)
                    .font(.system(size: 10, weight: .bold, design: .rounded))
                    .foregroundColor(.white.opacity(0.7))
                Spacer()
                Text("\(Int(value.wrappedValue * multiplier))\(unit)")
                    .font(.system(size: 11, weight: .heavy, design: .monospaced))
                    .foregroundColor(.white)
            }

            Slider(value: value, in: range)
                .accentColor(Color.blue)
        }
    }
}
