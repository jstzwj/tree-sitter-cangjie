package tree_sitter_cangjie_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_cangjie "github.com/tree-sitter/tree-sitter-cangjie/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_cangjie.Language())
	if language == nil {
		t.Errorf("Error loading Cangjie grammar")
	}
}
