// swift-tools-version:5.3
import PackageDescription

let package = Package(
    name: "TreeSitterCangjie",
    products: [
        .library(name: "TreeSitterCangjie", targets: ["TreeSitterCangjie"]),
    ],
    dependencies: [
        .package(url: "https://github.com/ChimeHQ/SwiftTreeSitter", from: "0.8.0"),
    ],
    targets: [
        .target(
            name: "TreeSitterCangjie",
            dependencies: [],
            path: ".",
            exclude: [
                "Cargo.toml",
                "Makefile",
                "binding.gyp",
                "bindings/c",
                "bindings/go",
                "bindings/node",
                "bindings/python",
                "bindings/rust",
                "prebuilds",
                "grammar.js",
                "package.json",
                "package-lock.json",
                "pyproject.toml",
                "setup.py",
                "test",
                "examples",
                ".editorconfig",
                ".github",
                ".gitignore",
                ".gitattributes",
                ".gitmodules",
            ],
            sources: [
                "src/parser.c",
                // NOTE: if your language has an external scanner, add it here.
            ],
            resources: [
                .copy("queries")
            ],
            publicHeadersPath: "bindings/swift",
            cSettings: [.headerSearchPath("src")]
        ),
        .testTarget(
            name: "TreeSitterCangjieTests",
            dependencies: [
                "SwiftTreeSitter",
                "TreeSitterCangjie",
            ],
            path: "bindings/swift/TreeSitterCangjieTests"
        )
    ],
    cLanguageStandard: .c11
)
