// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "Curioforge",
    platforms: [
        .macOS(.v14)
    ],
    products: [
        .executable(name: "Curioforge", targets: ["Curioforge"])
    ],
    dependencies: [],
    targets: [
        .executableTarget(
            name: "Curioforge",
            dependencies: [],
            path: "Sources"
        )
    ]
)
