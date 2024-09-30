/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const PREC = {
  COMMENT: 0, // //  /*  */
  ASSIGN: 1, // =  += -=  *=  /=  %=  &=  ^=  |=  <<=  >>=  >>>=
  DECL: 2,
  ELEMENT_VAL: 2,
  TERNARY: 3, // ?:
  FLOW: 4, // |>
  COALESCING: 5, // ??
  OR: 6, // ||
  AND: 7, // &&
  BIT_OR: 8, // |
  BIT_XOR: 9, // ^
  BIT_AND: 10, // &
  EQUALITY: 11, // ==  !=
  GENERIC: 12,
  REL: 13, // <  <=  >  >=  instanceof
  RANGE: 14, // .. ..=
  SHIFT: 15, // <<  >>  >>>
  ADD: 16, // +  -
  EXP: 17, // **
  MULT: 18, // *  /  %
  CAST: 19, // (Type)
  OBJ_INST: 20, // new
  UNARY: 21, // ++a  --a  a++  a--  +  -  !  ~
  ARRAY: 22, // [Index]
  OBJ_ACCESS: 23, // .
  PARENS: 24, // (Expression)
  CLASS_LITERAL: 25, // .
  FUNCTION_MODIFIER: 26,
  VARIABLE_MODIFIER: 27,
  PROPERTY_MODIFIER: 28,
};

module.exports = grammar({
  name: 'cangjie',
  extras: ($) => [/[\s\uFEFF\u2028\u2029\u2060\u200B]/, $.comment],
  word: ($) => $.identifier,
  conflicts: ($) => [],
  rules: {
    source_file: ($) =>
      seq(
        optional($.preamble),
        // repeat($.top_level_object),
        // optional($.main_definition),
      ),

    _end: ($) => choice('\n', '\r\n', ';'),

    // Preamble, package, and import definitions
    preamble: ($) => seq(optional($.package_header), repeat1($.import_list)),
    package_header: ($) => seq('package', $.package_name_identifier, $._end),
    package_name_identifier: ($) => sepBy1('.', $.identifier),
    import_list: ($) =>
      seq(
        optional(seq('from', $.identifier)),
        'import',
        sepBy1(',', $.import_part),
        $._end,
      ),
    import_part: ($) => sepBy1('.', choice('*', $.identifier)),
    import_alias: ($) => seq('as', $.identifier),

    // Identifiers and literals
    identifier: ($) =>
      token(
        /`[_\p{XID_Start}][_\p{XID_Continue}]*`|[_\p{XID_Start}][_\p{XID_Continue}]*/u,
      ),
    dollar_identifier: ($) => seq('$', $.identifier),

    // Comments
    comment: ($) => choice($.line_comment, $.delimited_comment),
    line_comment: ($) => token(seq('//', /.*/)),
    delimited_comment: ($) =>
      token(seq('/*', /[^*]*\*+([^/*][^*]*\*+)*/, '*/')),

    // Delimiters
    QUOTE_OPEN: ($) => '"',
    QUOTE_CLOSE: ($) => '"',
    TRIPLE_QUOTE_OPEN: ($) => '"""',
    TRIPLE_QUOTE_CLOSE: ($) => '"""',
  },
});

/**
 * Creates a rule to match one or more of the rules separated by the separator.
 *
 * @param {RuleOrLiteral} sep - The separator to use.
 * @param {RuleOrLiteral} rule
 *
 * @return {SeqRule}
 *
 */
function sepBy1(sep, rule) {
  return seq(rule, repeat(seq(sep, rule)));
}

/**
 * Creates a rule to optionally match one or more of the rules separated by the separator.
 *
 * @param {RuleOrLiteral} sep - The separator to use.
 * @param {RuleOrLiteral} rule
 *
 * @return {ChoiceRule}
 *
 */
function sepBy(sep, rule) {
  return optional(sepBy1(sep, rule));
}
