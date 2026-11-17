import Foundation

public struct SimulationState: Equatable {
    public var airPressure: Double // 0.1 to 1.0 (balloon size)
    public var carMass: Double     // 0.2 to 1.0 (bottle weight)
    public var wheelFriction: Double // 0.1 to 0.8
    public var currentPosition: Double // 0.0 to 1.0 on track
    public var isRunning: Bool
    public var calculatedSpeed: Double
    public var calculatedDistanceMeters: Double
    public var hasRunTest: Bool

    public init(
        airPressure: Double = 0.75,
        carMass: Double = 0.40,
        wheelFriction: Double = 0.20,
        currentPosition: Double = 0.0,
        isRunning: Bool = false,
        calculatedSpeed: Double = 0.0,
        calculatedDistanceMeters: Double = 0.0,
        hasRunTest: Bool = false
    ) {
        self.airPressure = airPressure
        self.carMass = carMass
        self.wheelFriction = wheelFriction
        self.currentPosition = currentPosition
        self.isRunning = isRunning
        self.calculatedSpeed = calculatedSpeed
        self.calculatedDistanceMeters = calculatedDistanceMeters
        self.hasRunTest = hasRunTest
    }

    public mutating func computePhysics() {
        // Thrust force is proportional to air pressure squared
        let thrustForce = pow(airPressure, 1.4) * 12.0
        let opposingForce = (carMass * 9.8 * wheelFriction)
        let netAcceleration = max(0.2, (thrustForce - opposingForce) / max(0.1, carMass))

        let topSpeed = sqrt(2 * netAcceleration * 1.5)
        let estimatedDistance = (pow(topSpeed, 2) / (2 * (wheelFriction * 9.8 + 0.5))) * 1.8

        self.calculatedSpeed = topSpeed
        self.calculatedDistanceMeters = Double(round(100 * estimatedDistance) / 100)
    }
}
