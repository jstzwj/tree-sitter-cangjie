import XCTest
import SwiftTreeSitter
import TreeSitterCangjie

final class TreeSitterCangjieTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_cangjie())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Cangjie grammar")
    }
}
