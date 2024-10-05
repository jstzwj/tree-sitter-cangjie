struct Rectangle {
    let width: Int64
    let height: Int64

    public init(width: Int64, height: Int64) {
        this.width = width
        this.height = height
    }

    public func area() {
        width * height
    }
}

struct RectangleStaticInit {
    static let degree: Int64
    static init() {
        degree = 180
    }
}