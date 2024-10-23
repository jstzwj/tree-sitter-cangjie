/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

const PREC = {
  CLOSURE: -1, // {}
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
  CAST: 13, // as
  CHECK: 14, // is
  REL: 15, // <  <=  >  >=  instanceof
  RANGE: 16, // .. ..=
  SHIFT: 17, // <<  >>  >>>
  ADD: 18, // +  -
  MULT: 19, // *  /  %
  EXP: 20, // **
  NEG: 21, // +  -
  NOT: 22, // !
  QUESTION: 23, // ?
  INC: 24, // a++  a--
  PARENS: 25, // (Expression)
  CALL: 26, // ()
  ARRAY: 27, // [Index]
  MEMBER: 28, // .
  CLASS_LITERAL: 29, // .
};

const INTEGER_SUFFIX = ['i8', 'i16', 'i32', 'i64', 'u8', 'u16', 'u32', 'u64'];
const FLOAT_SUFFIX = ['f16', 'f32', 'f64'];

const SINGLE_CHAR_BYTE =
  /[\u0000-\u0009\u000B\u000C\u000E-\u0021\u0023-\u0026\u0028-\u005B\u005D-\u007F]/;
const SINGLE_CHAR = /[^'\\\r\n]/;
const UNI_CHARACTER_LITERAL = /\\u\{[0-9a-fA-F]{1,8}\}/;
const ESCAPED_IDENTIFIER = /\\[tbrn'"\\fv0$]/;
const ESCAPE_SEQ = /\\u\{[0-9a-fA-F]{1,8}\}|\\[tbrn'"\\fv0$]/; // choice(UNI_CHARACTER_LITERAL, ESCAPED_IDENTIFIER);

const HEX_CHAR_BYTE = seq('\\u{', /[0-9a-fA-F]{1,4}/, '}');
const BYTE_ESCAPED_IDENTIFIER = /\\[tbrn'"\\fv0]/;
const BYTE_ESCAPE_SEQ = choice(HEX_CHAR_BYTE, BYTE_ESCAPED_IDENTIFIER);

const DECIMAL_DIGIT_WITHOUT_ZERO = /[1-9]/;
const DECIMAL_DIGIT = /[0-9]/;
const HEXADECIMAL_LITERAL = /0[xX]/;
const HEXADECIMAL_DIGITS = /[0-9a-fA-F][0-9a-fA-F_]*/;
const HEXADECIMAL_DIGIT = /[0-9a-fA-F]/;

const DECIMAL_LITERAL = /([1-9][0-9_]*|[0-9])/;
const DECIMAL_FRACTION = /\.[0-9][0-9_]*/;
const DECIMAL_FRAGMENT = /[0-9][0-9_]*/;
const DECIMAL_EXPONENT = /[eE][+-]?[0-9][0-9_]*/;

const HEXADECIMAL_PREFIX = /0[xX]/;
const HEXADECIMAL_FRACTION = /\.[0-9a-fA-F][0-9a-fA-F_]*/;
const HEXADECIMAL_EXPONENT = /[pP][+-]?[0-9][0-9_]*/;

module.exports = grammar({
  name: 'cangjie',
  extras: ($) => [/[\u0020\u0009\u000C]/, $.line_comment, $.delimited_comment],

  externals: ($) => [
    $._line_str_text_no_escape,
    $._multi_line_str_text_no_escape,
    $.multi_line_raw_string_start,
    $.multi_line_raw_string_content,
    $.multi_line_raw_string_end,
    $.error_sentinel,
  ],
  word: ($) => $.identifier,
  conflicts: ($) => [
    [$.source_file],
    [
      $.class_modifier,
      $.interface_modifier,
      $.function_modifier,
      $.variable_modifier,
      $.enum_modifier,
    ],
    [
      $.class_modifier,
      $.interface_modifier,
      $.function_modifier,
      $.variable_modifier,
    ],
    [$.class_modifier, $.interface_modifier, $.function_modifier],
    [$.class_modifier, $.function_modifier],
    [$.function_modifier, $.variable_modifier],
    [$.var_binding_pattern, $.enum_pattern],
    [
      $.source_file,
      $.function_definition,
      $.variable_declaration,
      $.enum_definition,
    ],
    [$.function_definition, $.variable_declaration, $.enum_definition],
    [$.wildcard_pattern, $.type_pattern],
    [$.var_binding_pattern, $.type_pattern, $.enum_pattern],
    [$.function_modifier, $.property_modifier],
    [$.foreign_body, $._foreign_member_declaration],
    [
      $.class_modifier,
      $.interface_modifier,
      $.function_modifier,
      $.variable_modifier,
      $.property_modifier,
    ],
    [
      $.class_modifier,
      $.interface_modifier,
      $.function_modifier,
      $.property_modifier,
    ],
    [$.class_modifier, $.function_modifier, $.property_modifier],
    [$.class_non_static_member_modifier, $.struct_non_static_member_modifier],
    [$.function_modifier, $.variable_modifier, $.property_modifier],
    [$.case_body, $.struct_name],
    [$.super_class, $.interface_type],
    [$.class_definition],
    [$.left_aux_expression, $._atomic_expression],
    [$.user_type, $._identifier_or_keyword],
    [$._atomic_expression, $._literal_constant],
    [$._expression, $.left_aux_expression],
    [$.variable_declaration],
    [$.interface_definition],
    [$.function_definition],
    [$.enum_definition],
    [$.foreign_body],
    [$.class_primary_init, $.var_binding_pattern, $.enum_pattern],
    [
      $.class_primary_init,
      $.struct_name,
      $.var_binding_pattern,
      $.enum_pattern,
    ],
    [$.quote_token, $.macro_input_expr_with_parens],
    [$.quote_token, $.macro_attr_expr],
    [$.class_body],
    [
      $.class_body,
      $.function_definition,
      $.operator_function_definition,
      $.variable_declaration,
    ],
    [$.line_string_expression, $._expression_or_declaration],
    [$.multi_line_string_expression, $._expression_or_declaration],
    [$.function_modifier, $.variable_modifier, $._identifier_or_keyword],
    [$.function_modifier, $._identifier_or_keyword],
    [$.variable_modifier, $._identifier_or_keyword],
    [$.left_aux_expression, $.prefix_unary_expression, $.postfix_expression],
    [$.interface_body],
    [$.function_parameters],
    [$.class_primary_init],
    [$.block, $._expression_or_declaration],
    [$.class_init, $.struct_init],
    [$.operator_function_definition],
    [$.line_string_expression],
    [$.multi_line_string_expression],
    [$.unnamed_tuple_type, $.parenthesized_type],
    [$.quote_expr, $.quote_token],
    [$.left_aux_expression, $._identifier_or_keyword],
    [$.left_aux_expression, $.multiplicative_expression, $.postfix_expression],
    [
      $.left_aux_expression,
      $.bitwise_conjunction_expression,
      $.postfix_expression,
    ],
    [
      $.left_aux_expression,
      $.comparison_or_type_expression,
      $.postfix_expression,
    ],
    [
      $.left_aux_expression,
      $.bitwise_disjunction_expression,
      $.postfix_expression,
    ],
    [$.left_aux_expression, $.item_after_quest],
    [$.left_aux_expression, $.coalescing_expression, $.postfix_expression],
    [
      $.left_aux_expression,
      $.logic_disjunction_expression,
      $.postfix_expression,
    ],
    [
      $.left_aux_expression,
      $.logic_conjunction_expression,
      $.postfix_expression,
    ],
    [$.left_aux_expression, $.range_expression, $.postfix_expression],
    [$.left_aux_expression, $.bitwise_xor_expression, $.postfix_expression],
    [
      $.left_aux_expression,
      $.equality_comparison_expression,
      $.postfix_expression,
    ],
    [$.left_aux_expression, $.shifting_expression, $.postfix_expression],
    [$.left_aux_expression, $.additive_expression, $.postfix_expression],
    [$.left_aux_expression, $.exponent_expression, $.postfix_expression],
    [$.left_aux_expression, $.flow_expression, $.postfix_expression],
    [$.assignment_expression, $.left_aux_expression, $.postfix_expression],
    [$.class_primary_init, $.enum_pattern_parameters],
    [$.user_type, $.var_binding_pattern, $.enum_pattern],
    [$.wildcard_pattern, $.exception_type_pattern],
    [$.unnamed_parameter, $.type_pattern],
    [$.user_type, $.enum_pattern],
    [$.unnamed_arrow_parameters, $.unit_literal],
    [$.unnamed_arrow_parameters, $.unnamed_tuple_type, $.parenthesized_type],
    [$.unnamed_arrow_parameters, $.unnamed_tuple_type],
    [$.match_case, $._expression_or_declaration],
    [
      $.class_modifier,
      $.interface_modifier,
      $.function_modifier,
      $.variable_modifier,
      $.enum_modifier,
      $.struct_modifier,
    ],
    [
      $.function_definition,
      $.variable_declaration,
      $.enum_definition,
      $.struct_definition,
    ],
    [
      $.source_file,
      $.function_definition,
      $.variable_declaration,
      $.enum_definition,
      $.struct_definition,
    ],
    [$.struct_definition],
    [$.struct_body],
    [
      $.function_definition,
      $.operator_function_definition,
      $.variable_declaration,
      $.struct_body,
    ],
  ],
  rules: {
    source_file: ($) =>
      seq(
        $.preamble,
        repeat(prec.left($._end)),
        repeat(prec.left($._top_level_object)),
        optional(seq(repeat1(prec.left($._end)), $.main_definition)),
        repeat(prec.left($._nl)),
        optional(sepBy(repeat(prec.left($._nl)), $._top_level_object)),
      ),

    _nl: ($) => token(/\n|\r\n/),
    _end: ($) => prec.left(PREC.CLASS_LITERAL, choice($._nl, ';')),

    // Preamble, package, and import definitions
    preamble: ($) =>
      prec.left(
        choice(
          $.package_header,
          seq(optional($.package_header), repeat1($.import_list)),
        ),
      ),
    package_modifier: ($) => 'macro',
    package_header: ($) =>
      prec.left(
        seq(
          optional($.package_modifier),
          'package',
          repeat(prec.left($._nl)),
          $.package_name_identifier,
          repeat1($._end),
        ),
      ),
    package_name_identifier: ($) =>
      prec.left(sepBy1(seq(repeat($._nl), '.', repeat($._nl)), $.identifier)),
    import_list: ($) =>
      prec.left(
        seq(
          optional(seq('from', repeat($._nl), $.identifier)),
          repeat($._nl),
          'import',
          repeat($._nl),
          sepBy1(
            seq(repeat($._nl), ',', repeat($._nl)),
            $.import_all_or_specified,
          ),
          repeat1($._end),
        ),
      ),
    import_all_or_specified: ($) =>
      prec.left(
        choice(
          $.import_all,
          seq($.import_specified, optional(seq(repeat($._nl), $.import_alias))),
        ),
      ),
    import_all: ($) =>
      seq(
        repeat1(
          prec.left(seq($.identifier, repeat($._nl), '.', repeat($._nl))),
        ),
        '*',
      ),
    import_specified: ($) =>
      prec.left(sepBy1(seq(repeat($._nl), '.', repeat($._nl)), $.identifier)),
    import_alias: ($) => seq('as', repeat($._nl), $.identifier),

    // Top-level object definitions
    _top_level_object: ($) =>
      choice(
        $.class_definition,
        $.interface_definition,
        $.function_definition,
        $.variable_declaration,
        $.enum_definition,
        $.struct_definition,
        $.type_alias,
        $.extend_definition,
        $.foreign_declaration,
        $.macro_definition,
        $.macro_expression,
      ),
    // Class definition
    class_definition: ($) =>
      seq(
        optional(seq($.class_modifier_list, repeat($._nl))),
        'class',
        repeat($._nl),
        field('name', $.identifier),
        repeat($._nl),
        field('type_parameters', optional($.type_parameters)),
        repeat($._nl),
        optional(
          seq('<:', field('super', optional($.super_class_or_interfaces))),
        ),
        repeat($._nl),
        field('constraints', optional($.generic_constraints)),
        repeat($._nl),
        field('body', $.class_body),
      ),

    super_class_or_interfaces: ($) =>
      prec.left(
        choice(
          seq(
            $.super_class,
            optional(
              seq(repeat($._nl), '&', repeat($._nl), $.super_interfaces),
            ),
          ),
          $.super_interfaces,
        ),
      ),
    super_class: ($) => $.class_type,
    interface_type: ($) => $.class_type,
    class_modifier_list: ($) => repeat1($.class_modifier),
    class_modifier: ($) =>
      choice(
        'public',
        'protected',
        'internal',
        'private',
        'abstract',
        'open',
        'sealed',
        'override',
      ),
    type_parameters: ($) =>
      seq(
        '<',
        repeat($._nl),
        sepBy1(seq(repeat($._nl), ',', repeat($._nl)), $.identifier),
        repeat($._nl),
        '>',
      ),
    class_type: ($) =>
      prec.left(
        seq(
          sepBy1(seq(repeat($._nl), '.', repeat($._nl)), $.identifier),
          optional(seq(repeat($._nl), $.type_parameters)),
        ),
      ),
    super_interfaces: ($) =>
      prec.left(
        sepBy1(seq(repeat($._nl), ',', repeat($._nl)), $.interface_type),
      ),
    generic_constraints: ($) =>
      prec.left(
        seq(
          'where',
          repeat($._nl),
          choice($.identifier, 'This'),
          repeat($._nl),
          '<:',
          repeat($._nl),
          $.upper_bounds,
          repeat(
            seq(
              repeat($._nl),
              ',',
              repeat($._nl),
              choice($.identifier, 'This'),
              repeat($._nl),
              '<:',
              repeat($._nl),
              $.upper_bounds,
            ),
          ),
        ),
      ),
    upper_bounds: ($) =>
      prec.left(sepBy1(seq(repeat($._nl), '&', repeat($._nl)), $._type)),
    class_body: ($) =>
      seq(
        '{',
        repeat($._end),
        repeat($._class_member_declaration),
        repeat($._nl),
        optional($.class_primary_init),
        repeat($._nl),
        repeat($._class_member_declaration),
        repeat($._end),
        '}',
      ),

    _class_member_declaration: ($) =>
      prec.left(
        seq(
          choice(
            $.class_init,
            $.static_init,
            $.variable_declaration,
            $.function_definition,
            $.operator_function_definition,
            $.macro_expression,
            $.property_definition,
            $.class_finalizer,
          ),
          repeat($._end),
        ),
      ),
    class_init: ($) =>
      seq(
        optional(
          choice(
            $.class_non_static_member_modifier,
            seq('const', repeat($._nl)),
          ),
        ),
        'init',
        repeat($._nl),
        $.function_parameters,
        repeat($._nl),
        $.block,
      ),
    static_init: ($) =>
      seq(
        'static',
        'init',
        '(',
        ')',
        '{',
        optional($._expression_or_declarations),
        '}',
      ),
    class_primary_init: ($) =>
      seq(
        optional(
          choice(
            $.class_non_static_member_modifier,
            seq('const', repeat($._nl)),
          ),
        ),
        field('name', $.identifier),
        repeat($._nl),
        '(',
        repeat($._nl),
        optional($.class_primary_init_param_lists),
        repeat($._nl),
        ')',
        repeat($._nl),
        '{',
        repeat($._nl),
        optional(seq('super', $.call_suffix)),
        $._end,
        optional($._expression_or_declarations),
        repeat($._nl),
        '}',
      ),

    class_primary_init_param_lists: ($) =>
      prec.left(
        choice(
          seq(
            $.unnamed_parameter_list,
            optional(
              seq(repeat($._nl), ',', repeat($._nl), $.named_parameter_list),
            ),
            optional(
              seq(
                repeat($._nl),
                ',',
                repeat($._nl),
                $.class_named_init_param_list,
              ),
            ),
          ),
          seq(
            $.unnamed_parameter_list,
            optional(
              seq(
                repeat($._nl),
                ',',
                repeat($._nl),
                $.class_unnamed_init_param_list,
              ),
            ),
            optional(
              seq(
                repeat($._nl),
                ',',
                repeat($._nl),
                $.class_named_init_param_list,
              ),
            ),
          ),
          seq(
            $.class_unnamed_init_param_list,
            optional(
              seq(
                repeat($._nl),
                ',',
                repeat($._nl),
                $.class_named_init_param_list,
              ),
            ),
          ),
          seq(
            $.named_parameter_list,
            optional(
              seq(
                repeat($._nl),
                ',',
                repeat($._nl),
                $.class_named_init_param_list,
              ),
            ),
          ),
          $.class_named_init_param_list,
        ),
      ),
    class_unnamed_init_param_list: ($) =>
      prec.left(
        sepBy1(
          seq(repeat($._nl), ',', repeat($._nl)),
          $.class_unnamed_init_param,
        ),
      ),
    class_named_init_param_list: ($) =>
      prec.left(
        sepBy1(
          seq(repeat($._nl), ',', repeat($._nl)),
          $.class_named_init_param,
        ),
      ),
    class_unnamed_init_param: ($) =>
      seq(
        optional(seq($.class_non_static_member_modifier, repeat($._nl))),
        choice('let', 'var'),
        repeat($._nl),
        $.identifier,
        repeat($._nl),
        ':',
        repeat($._nl),
        $._type,
      ),
    class_named_init_param: ($) =>
      prec.left(
        seq(
          optional(seq($.class_non_static_member_modifier, repeat($._nl))),
          choice('let', 'var'),
          repeat($._nl),
          $.identifier,
          repeat($._nl),
          '!',
          repeat($._nl),
          ':',
          repeat($._nl),
          $._type,
          optional(seq(repeat($._nl), '=', repeat($._nl), $._expression)),
        ),
      ),

    class_non_static_member_modifier: ($) =>
      choice('public', 'private', 'protected', 'internal'),

    class_finalizer: ($) => seq('~', 'init', '(', ')', $.block),

    // Interface definition
    interface_definition: ($) =>
      seq(
        optional(seq($.interface_modifier_list, repeat($._nl))),
        'interface',
        repeat($._nl),
        field('name', $.identifier),
        repeat($._nl),
        field('type_parameters', optional($.type_parameters)),
        repeat($._nl),
        optional(seq('<:', field('super', $.super_interfaces))),
        repeat($._nl),
        field('constraints', optional($.generic_constraints)),
        repeat($._nl),
        field('body', $.interface_body),
      ),
    interface_body: ($) =>
      seq(
        '{',
        repeat($._end),
        repeat($._interface_member_declaration),
        repeat($._end),
        '}',
      ),
    _interface_member_declaration: ($) =>
      prec.left(
        seq(
          choice(
            $.function_definition,
            $.operator_function_definition,
            $.macro_expression,
            $.property_definition,
          ),
          repeat($._end),
        ),
      ),
    interface_modifier_list: ($) =>
      repeat1(prec.left(seq($.interface_modifier, repeat($._nl)))),
    interface_modifier: ($) =>
      choice('public', 'protected', 'internal', 'private', 'open'),

    // Function definition
    function_definition: ($) =>
      prec.left(
        seq(
          field('modifier', optional($.function_modifier_list)),
          repeat($._nl),
          'func',
          repeat($._nl),
          field('name', $.identifier),
          repeat($._nl),
          field('type_parameters', optional($.type_parameters)),
          repeat($._nl),
          field('parameters', $.function_parameters),
          optional(seq(':', field('return_type', $._type))),
          repeat($._nl),
          field('constraints', optional($.generic_constraints)),
          repeat($._nl),
          field('body', optional($.block)),
        ),
      ),
    function_modifier_list: ($) =>
      prec.left(repeat1(prec.left(seq($.function_modifier, repeat($._nl))))),
    function_modifier: ($) =>
      prec.left(
        choice(
          'public',
          'private',
          'protected',
          'internal',
          'static',
          'open',
          'override',
          'operator',
          'redef',
          'mut',
          'unsafe',
          'const',
        ),
      ),

    operator_function_definition: ($) =>
      seq(
        field('modifier', optional($.function_modifier_list)),
        repeat($._nl),
        'operator',
        repeat($._nl),
        'func',
        repeat($._nl),
        field('operator', $.overloaded_operators),
        repeat($._nl),
        field('type_parameters', optional($.type_parameters)),
        repeat($._nl),
        field('parameters', $.function_parameters),
        optional(seq(':', field('return_type', $._type))),
        repeat($._nl),
        field('constraints', optional($.generic_constraints)),
        repeat($._nl),
        field('body', optional(choice($.block, seq('=', $._expression)))),
      ),

    function_parameters: ($) =>
      choice(
        seq(
          '(',
          repeat($._nl),
          field('unnamed_parameters', optional($.unnamed_parameter_list)),
          repeat($._nl),
          field(
            'named_parameters',
            optional(seq($._nl, ',', $._nl, $.named_parameter_list)),
          ),
          repeat($._nl),
          ')',
        ),
        seq('(', optional($.named_parameter_list), ')'),
      ),

    nondefault_parameter_list: ($) =>
      choice(
        seq(
          $.unnamed_parameter,
          optional(seq(repeat($._nl), ',', repeat($._nl), $.unnamed_parameter)),
          optional(seq(repeat($._nl), ',', repeat($._nl), $.named_parameter)),
        ),
        seq(
          $.named_parameter,
          optional(seq(repeat($._nl), ',', repeat($._nl), $.named_parameter)),
        ),
      ),

    unnamed_parameter_list: ($) =>
      prec.left(
        sepBy1(seq(repeat($._nl), ',', repeat($._nl)), $.unnamed_parameter),
      ),

    unnamed_parameter: ($) =>
      seq(
        choice($.identifier, '_'),
        repeat($._nl),
        ':',
        repeat($._nl),
        $._type,
      ),

    named_parameter_list: ($) =>
      prec.left(
        sepBy1(
          seq(repeat($._nl), ',', repeat($._nl)),
          choice($.named_parameter, $.default_parameter),
        ),
      ),

    named_parameter: ($) =>
      prec.left(
        seq(
          $.identifier,
          repeat($._nl),
          '!',
          repeat($._nl),
          ':',
          repeat($._nl),
          $._type,
        ),
      ),

    default_parameter: ($) =>
      seq(
        $.identifier,
        repeat($._nl),
        '!',
        repeat($._nl),
        ':',
        repeat($._nl),
        $._type,
        repeat($._nl),
        '=',
        repeat($._nl),
        $._expression,
      ),

    // Variable Declaration
    variable_declaration: ($) =>
      prec.left(
        seq(
          field('modifier', repeat($.variable_modifier)),
          repeat($._nl),
          field('specifier', choice('let', 'var', 'const')),
          repeat($._nl),
          field('name', $._patterns_maybe_irrefutable),
          repeat($._nl),
          choice(
            seq(
              optional(seq(':', repeat($._nl), field('type', $._type))),
              repeat($._nl),
              optional(seq('=', repeat($._nl), field('value', $._expression))),
            ),
            seq(':', repeat($._nl), field('type', $._type)),
          ),
        ),
      ),
    variable_modifier: ($) =>
      choice('public', 'protected', 'internal', 'private', 'static'),

    // Enum Definition
    enum_definition: ($) =>
      seq(
        field('modifier', optional($.enum_modifier)),
        repeat($._nl),
        'enum',
        repeat($._nl),
        field('name', $.identifier),
        repeat($._nl),
        field('type_parameters', optional(seq($.type_parameters))),
        repeat($._nl),
        optional(seq('<:', field('super', $.super_interfaces))),
        repeat($._nl),
        field('constraints', optional($.generic_constraints)),
        repeat($._nl),
        '{',
        repeat($._nl),
        field('body', optional($.enum_body)),
        repeat($._nl),
        '}',
      ),
    enum_modifier: ($) => choice('public', 'protected', 'internal', 'private'),
    enum_body: ($) =>
      prec.left(
        seq(
          optional(seq('|', repeat($._nl))),
          $.case_body,
          repeat(seq(repeat($._nl), '|', repeat($._nl), $.case_body)),
          repeat(
            seq(
              repeat($._nl),
              choice(
                $.function_definition,
                $.operator_function_definition,
                $.property_definition,
                $.macro_expression,
              ),
            ),
          ),
        ),
      ),
    case_body: ($) =>
      prec.left(
        seq(
          $.identifier,
          optional(
            seq(
              repeat($._nl),
              '(',
              repeat($._nl),
              $._type,
              repeat(seq(repeat($._nl), ',', repeat($._nl), $._type)),
              repeat($._nl),
              ')',
            ),
          ),
        ),
      ),

    // Struct Definition
    struct_definition: ($) =>
      seq(
        field('modifier', optional($.struct_modifier)),
        repeat($._nl),
        'struct',
        repeat($._nl),
        field('name', $.identifier),
        repeat($._nl),
        field('type_parameters', optional(seq($.type_parameters))),
        repeat($._nl),
        optional(seq('<:', repeat($._nl), field('super', $.super_interfaces))),
        repeat($._nl),
        field('constraints', optional($.generic_constraints)),
        repeat($._nl),
        field('body', $.struct_body),
      ),
    struct_body: ($) =>
      seq(
        '{',
        repeat($._end),
        repeat($._struct_member_declaration),
        repeat($._nl),
        optional($.struct_primary_init),
        repeat($._nl),
        repeat($._struct_member_declaration),
        repeat($._end),
        '}',
      ),
    _struct_member_declaration: ($) =>
      prec.left(
        seq(
          choice(
            $.struct_init,
            $.static_init,
            $.variable_declaration,
            $.function_definition,
            $.operator_function_definition,
            $.macro_expression,
            $.property_definition,
          ),
          repeat($._end),
        ),
      ),
    struct_init: ($) =>
      seq(
        optional(
          seq(
            choice(
              $.struct_non_static_member_modifier,
              seq('const', repeat($._nl)),
            ),
          ),
        ),
        'init',
        repeat($._nl),
        $.function_parameters,
        repeat($._nl),
        $.block,
      ),
    struct_primary_init: ($) =>
      seq(
        optional(seq(choice($.struct_non_static_member_modifier, 'const'))),
        $.struct_name,
        repeat($._nl),
        '(',
        repeat($._nl),
        optional($.struct_primary_init_param_lists),
        repeat($._nl),
        ')',
        repeat($._nl),
        '{',
        repeat($._nl),
        optional($._expression_or_declarations),
        repeat($._nl),
        '}',
      ),
    struct_name: ($) => prec.left($.identifier),

    struct_primary_init_param_lists: ($) =>
      choice(
        seq(
          $.unnamed_parameter_list,
          optional(
            seq(repeat($._nl), ',', repeat($._nl), $.named_parameter_list),
          ),
          optional(
            seq(
              repeat($._nl),
              ',',
              repeat($._nl),
              $.struct_named_init_param_list,
            ),
          ),
        ),
        seq(
          $.unnamed_parameter_list,
          optional(
            seq(
              repeat($._nl),
              ',',
              repeat($._nl),
              $.struct_unnamed_init_param_list,
            ),
          ),
          optional(
            seq(
              repeat($._nl),
              ',',
              repeat($._nl),
              $.struct_named_init_param_list,
            ),
          ),
        ),
        seq(
          $.struct_unnamed_init_param_list,
          optional(
            seq(
              repeat($._nl),
              ',',
              repeat($._nl),
              $.struct_named_init_param_list,
            ),
          ),
        ),
        seq(
          $.named_parameter_list,
          optional(
            seq(
              repeat($._nl),
              ',',
              repeat($._nl),
              $.struct_named_init_param_list,
            ),
          ),
        ),
        $.struct_named_init_param_list,
      ),

    struct_unnamed_init_param_list: ($) =>
      prec.left(
        seq(
          $.struct_unnamed_init_param,
          repeat(
            seq(repeat($._nl), ',', repeat($._nl), $.struct_unnamed_init_param),
          ),
        ),
      ),

    struct_named_init_param_list: ($) =>
      seq(
        $.struct_named_init_param,
        repeat(
          seq(repeat($._nl), ',', repeat($._nl), $.struct_named_init_param),
        ),
      ),

    struct_unnamed_init_param: ($) =>
      seq(
        optional(seq($.struct_non_static_member_modifier, repeat($._nl))),
        choice('let', 'var'),
        repeat($._nl),
        $.identifier,
        repeat($._nl),
        ':',
        repeat($._nl),
        $._type,
      ),

    struct_named_init_param: ($) =>
      seq(
        optional(seq($.struct_non_static_member_modifier, repeat($._nl))),
        choice('let', 'var'),
        repeat($._nl),
        $.identifier,
        repeat($._nl),
        'not',
        repeat($._nl),
        ':',
        repeat($._nl),
        $._type,
        optional(seq(repeat($._nl), '=', repeat($._nl), $._expression)),
      ),

    struct_modifier: ($) =>
      choice('public', 'protected', 'internal', 'private'),

    struct_non_static_member_modifier: ($) =>
      choice('public', 'protected', 'internal', 'private'),

    // Type Alias
    type_alias: ($) =>
      prec.left(
        seq(
          optional(seq($.type_modifier, repeat($._nl))),
          'type',
          repeat($._nl),
          $.identifier,
          optional(seq(repeat($._nl), $.type_parameters)),
          repeat($._nl),
          '=',
          repeat($._nl),
          $._type,
          repeat($._end),
        ),
      ),
    type_modifier: ($) => choice('public', 'protected', 'internal', 'private'),

    // Extend Definition
    extend_definition: ($) =>
      seq(
        'extend',
        repeat($._nl),
        optional($.extend_type),
        optional(seq(repeat($._nl), '<:', repeat($._nl), $.super_interfaces)),
        optional(seq(repeat($._nl), $.generic_constraints)),
        repeat($._nl),
        $.extend_body,
      ),
    extend_type: ($) =>
      choice(
        $.type_parameters,
        seq(
          sepBy1(seq(repeat($._nl), '.', repeat($._nl)), $.identifier),
          optional(seq(repeat($._nl), $.type_arguments)),
        ),
        'Int8',
        'Int16',
        'Int32',
        'Int64',
        'IntNative',
        'Uint8',
        'Uint16',
        'Uint32',
        'Uint64',
        'UintNative',
        'Float16',
        'Float32',
        'Float64',
        'Rune',
        'Boolean',
        'Nothing',
        'Unit',
      ),
    extend_body: ($) =>
      seq('{', $._end, repeat($._extend_member_declaration), $._end, '}'),
    _extend_member_declaration: ($) =>
      seq(
        choice(
          $.function_definition,
          $.operator_function_definition,
          $.macro_expression,
          $.property_definition,
        ),
        repeat($._end),
      ),

    foreign_declaration: ($) =>
      seq(
        'foreign',
        repeat($._nl),
        choice($.foreign_body, $._foreign_member_declaration),
      ),

    foreign_body: ($) =>
      seq(
        '{',
        repeat($._end),
        repeat($._foreign_member_declaration),
        repeat($._end),
        '}',
      ),

    _foreign_member_declaration: ($) =>
      seq(
        choice(
          $.class_definition,
          $.interface_definition,
          $.function_definition,
          $.macro_expression,
          $.variable_declaration,
        ),
        repeat($._end),
      ),

    annotation_list: ($) => repeat1($.annotation),

    annotation: ($) =>
      seq(
        '@',
        repeat(seq($.identifier, repeat($._nl), '.')),
        $.identifier,
        optional(
          seq(
            '[',
            repeat($._nl),
            $.annotation_argument_list,
            repeat($._nl),
            ']',
          ),
        ),
      ),

    annotation_argument_list: ($) =>
      seq(
        $.annotation_argument,
        repeat(seq(repeat($._nl), ',', repeat($._nl), $.annotation_argument)),
        repeat($._nl),
        optional(','),
      ),

    annotation_argument: ($) =>
      choice(
        seq($.identifier, repeat($._nl), ':', repeat($._nl), $._expression),
        $._expression,
      ),

    macro_definition: ($) =>
      seq(
        'public',
        repeat($._nl),
        'macro',
        repeat($._nl),
        field('name', $.identifier),
        repeat($._nl),
        choice($.macro_without_attr_param, $.macro_with_attr_param),
        repeat($._nl),
        optional(seq(':', repeat($._nl), $.identifier, repeat($._nl))),
        choice(seq('=', repeat($._nl), $._expression), $.block),
      ),

    macro_without_attr_param: ($) =>
      seq('(', repeat($._nl), $.macro_input_decl, repeat($._nl), ')'),

    macro_with_attr_param: ($) =>
      seq(
        '(',
        repeat($._nl),
        $.macro_attr_decl,
        repeat($._nl),
        ',',
        repeat($._nl),
        $.macro_input_decl,
        repeat($._nl),
        ')',
      ),

    macro_input_decl: ($) =>
      seq($.identifier, repeat($._nl), ':', repeat($._nl), $.identifier),

    macro_attr_decl: ($) =>
      seq($.identifier, repeat($._nl), ':', repeat($._nl), $.identifier),

    property_definition: ($) =>
      prec.left(
        seq(
          field('modifier', repeat($.property_modifier)),
          repeat($._nl),
          'prop',
          repeat($._nl),
          field('name', $.identifier),
          repeat($._nl),
          ':',
          repeat($._nl),
          field('type', $._type),
          repeat($._nl),
          field('body', optional($.property_body)),
        ),
      ),

    property_body: ($) =>
      seq(
        '{',
        repeat($._end),
        repeat1($.property_member_declaration),
        repeat($._end),
        '}',
      ),

    property_member_declaration: ($) =>
      choice(
        seq(
          'get',
          repeat($._nl),
          '(',
          ')',
          repeat($._nl),
          $.block,
          repeat($._end),
        ),
        seq(
          'set',
          repeat($._nl),
          '(',
          $.identifier,
          ')',
          repeat($._nl),
          $.block,
          repeat($._end),
        ),
      ),

    property_modifier: ($) =>
      choice(
        'public',
        'private',
        'protected',
        'internal',
        'static',
        'open',
        'override',
        'redef',
        'mut',
      ),
    // Main Definition
    main_definition: ($) =>
      seq(
        'main', // Matches the keyword 'main' // Matches newlines if present
        repeat($._nl),
        $.function_parameters, // Matches function parameters
        optional(seq(repeat($._nl), ':', repeat($._nl), $._type)), // Optionally matches a colon followed by the type // Matches newlines if present
        repeat($._nl),
        $.block, // Matches the block of the function
      ),

    // Type
    _type: ($) =>
      choice($.arrow_type, $.tuple_type, $.prefix_type, $._atomic_type),

    arrow_type: ($) =>
      seq($.arrow_parameters, repeat($._nl), '->', repeat($._nl), $._type),

    arrow_parameters: ($) =>
      choice($.unnamed_arrow_parameters, $.named_arrow_parameters),
    unnamed_arrow_parameters: ($) =>
      seq(
        '(',
        repeat($._nl),
        sepBy(seq(repeat($._nl), ',', repeat($._nl)), $._type),
        repeat($._nl),
        ')',
      ),
    named_arrow_parameters: ($) =>
      seq(
        '(',
        repeat($._nl),
        sepBy1(
          seq(repeat($._nl), ',', repeat($._nl)),
          seq(
            choice('_', $.identifier),
            repeat($._nl),
            ':',
            repeat($._nl),
            $._type,
          ),
        ),
        repeat($._nl),
        ')',
      ),

    tuple_type: ($) => choice($.unnamed_tuple_type, $.named_tuple_type),
    unnamed_tuple_type: ($) =>
      seq(
        '(',
        repeat($._nl),
        sepBy1(seq(repeat($._nl), ',', repeat($._nl)), $._type),
        repeat($._nl),
        ')',
      ),
    named_tuple_type: ($) =>
      seq(
        '(',
        repeat($._nl),
        sepBy1(
          seq(repeat($._nl), ',', repeat($._nl)),
          seq(
            choice('_', $.identifier),
            repeat($._nl),
            ':',
            repeat($._nl),
            $._type,
          ),
        ),
        repeat($._nl),
        ')',
      ),

    prefix_type: ($) => seq($.prefix_type_operator, $._type),

    prefix_type_operator: ($) => token('?'),

    _atomic_type: ($) =>
      choice($.builtin_types, $.user_type, $.parenthesized_type),

    builtin_types: ($) =>
      prec.left(
        choice($.numeric_types, 'Rune', 'Boolean', 'Nothing', 'Unit', 'This'),
      ),

    numeric_types: ($) =>
      choice(
        'Int8',
        'Int16',
        'Int32',
        'Int64',
        'IntNative',
        'Uint8',
        'Uint16',
        'Uint32',
        'Uint64',
        'UintNative',
        'Float16',
        'Float32',
        'Float64',
      ),

    user_type: ($) =>
      prec.right(
        seq(
          repeat(seq($.identifier, repeat($._nl), '.', repeat($._nl))),
          $.identifier,
          optional(seq(repeat($._nl), $.type_arguments)),
        ),
      ),

    parenthesized_type: ($) =>
      seq('(', repeat($._nl), $._type, repeat($._nl), ')'),

    type_arguments: ($) =>
      seq(
        '<',
        repeat($._nl),
        $._type,
        repeat($._nl),
        repeat(seq(repeat($._nl), ',', repeat($._nl), $._type)),
        repeat($._nl),
        '>',
      ),

    // Expression
    _expression: ($) =>
      choice(
        $._atomic_expression,
        // expression
        $.assignment_expression,
        $.flow_expression,
        $.coalescing_expression,
        $.logic_disjunction_expression,
        $.logic_conjunction_expression,
        $.range_expression,
        $.bitwise_disjunction_expression,
        $.bitwise_xor_expression,
        $.bitwise_conjunction_expression,
        $.equality_comparison_expression,
        $.comparison_or_type_expression,
        $.shifting_expression,
        $.additive_expression,
        $.multiplicative_expression,
        $.exponent_expression,
        $.prefix_unary_expression,
        $.inc_and_dec_expression,
        $.postfix_expression,
        seq($._identifier_or_keyword, optional($.type_arguments)),
      ),

    assignment_expression: ($) =>
      prec.right(
        PREC.ASSIGN,
        choice(
          seq(
            field('left', $.left_value_expression_without_wildcard),
            repeat($._nl),
            field('operator', $.assignment_operator),
            repeat($._nl),
            field('right', $._expression),
          ),
          seq(
            field('left', $.left_value_expression),
            repeat($._nl),
            field('operator', '='),
            repeat($._nl),
            field('right', $._expression),
          ),
          seq(
            field('left', $.tuple_left_value_expression),
            repeat($._nl),
            field('operator', '='),
            repeat($._nl),
            field('right', $._expression),
          ),
        ),
      ),

    tuple_left_value_expression: ($) =>
      seq(
        '(',
        repeat($._nl),
        choice($.left_value_expression, $.tuple_left_value_expression),
        repeat(
          seq(
            repeat($._nl),
            ',',
            repeat($._nl),
            choice($.left_value_expression, $.tuple_left_value_expression),
          ),
        ),
        repeat($._nl),
        optional(','),
        repeat($._nl),
        ')',
      ),

    left_value_expression: ($) =>
      choice($.left_value_expression_without_wildcard, '_'),

    left_value_expression_without_wildcard: ($) =>
      prec.left(
        PREC.COMMENT,
        choice(
          $.left_aux_expression,
          seq(
            $.left_aux_expression,
            optional('?'),
            repeat($._nl),
            $._assignable_suffix,
          ),
        ),
      ),

    left_aux_expression: ($) =>
      prec.left(
        PREC.COMMENT,
        choice(
          seq(
            $._identifier_or_keyword,
            optional(seq(repeat($._nl), $.type_arguments)),
          ),
          $._type,
          $.this_super_expression,
          seq(
            $._expression,
            optional('?'),
            repeat($._nl),
            '.',
            repeat($._nl),
            $.identifier,
            optional(seq(repeat($._nl), $.type_arguments)),
          ),
          seq($._expression, optional('?'), $.call_suffix),
          seq($._expression, optional('?'), $.index_access),
        ),
      ),

    _assignable_suffix: ($) => choice($.field_access, $.index_access),

    field_access: ($) => seq(repeat($._nl), '.', repeat($._nl), $.identifier),

    flow_expression: ($) =>
      prec.left(
        PREC.FLOW,
        seq(
          field('left', $._expression),
          repeat($._nl),
          field('operator', $.flow_operator),
          repeat($._nl),
          field('right', $._expression),
        ),
      ),

    coalescing_expression: ($) =>
      prec.left(
        PREC.COALESCING,
        seq(
          field('left', $._expression),
          repeat($._nl),
          field('operator', '??'),
          repeat($._nl),
          field('right', $._expression),
        ),
      ),

    logic_disjunction_expression: ($) =>
      prec.left(
        PREC.OR,
        seq(
          field('left', $._expression),
          repeat($._nl),
          field('operator', '||'),
          repeat($._nl),
          field('right', $._expression),
        ),
      ),

    logic_conjunction_expression: ($) =>
      prec.left(
        PREC.AND,
        seq(
          field('left', $._expression),
          repeat($._nl),
          field('operator', '&&'),
          repeat($._nl),
          field('right', $._expression),
        ),
      ),

    range_expression: ($) =>
      prec.left(
        PREC.RANGE,
        seq(
          field('left', $._expression),
          repeat($._nl),
          field('operator', choice('..', '..=')),
          repeat($._nl),
          field('right', $._expression),
          optional(
            seq(
              repeat($._nl),
              ':',
              repeat($._nl),
              field('step', $._expression),
            ),
          ),
        ),
      ),

    bitwise_disjunction_expression: ($) =>
      prec.left(
        PREC.BIT_OR,
        seq(
          field('left', $._expression),
          repeat($._nl),
          field('operator', '|'),
          repeat($._nl),
          field('right', $._expression),
        ),
      ),

    bitwise_xor_expression: ($) =>
      prec.left(
        PREC.BIT_XOR,
        seq(
          field('left', $._expression),
          repeat($._nl),
          field('operator', '^'),
          repeat($._nl),
          field('right', $._expression),
        ),
      ),

    bitwise_conjunction_expression: ($) =>
      prec.left(
        PREC.BIT_AND,
        seq(
          field('left', $._expression),
          repeat($._nl),
          field('operator', '&'),
          repeat($._nl),
          field('right', $._expression),
        ),
      ),

    equality_comparison_expression: ($) =>
      prec.left(
        PREC.EQUALITY,
        seq(
          field('left', $._expression),
          repeat($._nl),
          field('operator', choice('==', '!=')),
          repeat($._nl),
          field('right', $._expression),
        ),
      ),

    comparison_or_type_expression: ($) =>
      prec.left(
        choice(
          prec(
            PREC.REL,
            seq(
              field('left', $._expression),
              repeat($._nl),
              field('operator', choice('<', '>', '<=', '>=')),
              repeat($._nl),
              field('right', $._expression),
            ),
          ),
          prec(
            PREC.CHECK,
            seq(
              field('left', $._expression),
              repeat($._nl),
              field('operator', 'is'),
              repeat($._nl),
              field('right', $._type),
            ),
          ),
          prec(
            PREC.CAST,
            seq(
              field('left', $._expression),
              repeat($._nl),
              field('operator', 'as'),
              repeat($._nl),
              field('right', $._type),
            ),
          ),
        ),
      ),

    shifting_expression: ($) =>
      prec.left(
        PREC.SHIFT,
        seq(
          field('left', $._expression),
          repeat($._nl),
          field('operator', choice('<<', '>>')),
          repeat($._nl),
          field('right', $._expression),
        ),
      ),

    additive_expression: ($) =>
      prec.left(
        PREC.ADD,
        seq(
          field('left', $._expression),
          repeat($._nl),
          field('operator', choice('+', '-')),
          repeat($._nl),
          field('right', $._expression),
        ),
      ),

    multiplicative_expression: ($) =>
      prec.left(
        PREC.MULT,
        seq(
          field('left', $._expression),
          repeat($._nl),
          field('operator', choice('*', '/', '%')),
          repeat($._nl),
          field('right', $._expression),
        ),
      ),

    exponent_expression: ($) =>
      prec.left(
        PREC.EXP,
        seq(
          field('left', $._expression),
          repeat($._nl),
          field('operator', '**'),
          repeat($._nl),
          field('right', $._expression),
        ),
      ),

    prefix_unary_expression: ($) =>
      prec.left(
        PREC.NEG,
        seq(
          field('operator', $.prefix_unary_operator),
          field('expression', $._expression),
        ),
      ),

    inc_and_dec_expression: ($) =>
      prec.left(
        PREC.INC,
        seq(
          field('expression', $._expression),
          field('operator', choice('++', '--')),
        ),
      ),

    postfix_expression: ($) =>
      prec.left(
        PREC.CALL,
        seq(
          choice($._type, $._expression),
          choice(
            seq('.', $._identifier_or_keyword, optional($.type_arguments)),
            $.call_suffix,
            $.index_access,
            $.trailing_lambda_expression,
            repeat1(seq('?', $.quest_seperated_items)),
          ),
        ),
      ),

    quest_seperated_items: ($) => prec.left(repeat1($.quest_seperated_item)),

    quest_seperated_item: ($) =>
      prec.left(
        seq(
          $.item_after_quest,
          optional(
            choice(
              $.call_suffix,
              seq(optional($.call_suffix), $.trailing_lambda_expression),
              $.index_access,
            ),
          ),
        ),
      ),
    item_after_quest: ($) =>
      prec.left(
        choice(
          seq('.', $.identifier, optional($.type_arguments)),
          $.call_suffix,
          $.index_access,
          $.trailing_lambda_expression,
        ),
      ),

    call_suffix: ($) =>
      prec.left(
        // PREC.CALL,
        seq(
          '(',
          optional(seq($.value_argument, repeat(seq(',', $.value_argument)))),
          ')',
        ),
      ),

    value_argument: ($) =>
      choice(
        seq($.identifier, ':', $._expression),
        $._expression,
        $.ref_transfer_expression,
      ),

    ref_transfer_expression: ($) =>
      seq('inout', optional(seq($._expression, '.', $.identifier))),

    // FIXME: if there are whitespaces between index_access '[' and the expression
    // the index_access will be parsed as a collection_literal
    index_access: ($) =>
      prec.left(
        seq(token.immediate('['), choice($._expression, $.range_element), ']'),
      ),

    range_element: ($) =>
      prec.left(
        PREC.RANGE,
        choice(
          '..',
          seq(choice('..', '..='), $._expression),
          seq($._expression, '..'),
        ),
      ),

    _atomic_expression: ($) =>
      prec.left(
        choice(
          $._literal_constant,
          $.collection_literal,
          $.tuple_literal,
          $.unit_literal,
          $.if_expression,
          $.match_expression,
          $._loop_expression,
          $.try_expression,
          $.jump_expression,
          $.numeric_type_conv_expr,
          $.rune_type_conv_expr,
          $.this_super_expression,
          $.spawn_expression,
          $.synchronized_expression,
          $.parenthesized_expression,
          $.lambda_expression,
          $.quote_expression,
          $.macro_expression,
          $.unsafe_expression,
        ),
      ),

    _literal_constant: ($) =>
      choice(
        $.integer_literal,
        $.float_literal,
        $.rune_literal,
        $.byte_literal,
        $.boolean_literal,
        $.string_literal,
        $.byte_string_array_literal,
        $.unit_literal,
      ),

    boolean_literal: ($) => token(choice('true', 'false')),

    string_literal: ($) =>
      choice(
        $.line_string_literal,
        $.multi_line_string_literal,
        $.multi_line_raw_string_literal,
      ),

    _line_str_escape_seq: ($) => prec.left(repeat1(ESCAPE_SEQ)),
    _line_str_text_single: ($) =>
      prec.left(
        repeat1(
          choice($._line_str_text_no_escape, "'", $._line_str_escape_seq),
        ),
      ),
    _line_str_text_double: ($) =>
      prec.left(
        repeat1(
          choice($._line_str_text_no_escape, '"', $._line_str_escape_seq),
        ),
      ),
    line_string_content_single: ($) => $._line_str_text_single,
    line_string_content_double: ($) => $._line_str_text_double,

    _line_string_content_single_parts: ($) =>
      prec.left(
        repeat1(choice($.line_string_expression, $.line_string_content_single)),
      ),

    _line_string_content_double_parts: ($) =>
      prec.left(
        repeat1(choice($.line_string_expression, $.line_string_content_double)),
      ),

    line_string_literal: ($) =>
      prec.left(
        choice(
          seq('"', optional($._line_string_content_single_parts), '"'),
          seq("'", optional($._line_string_content_double_parts), "'"),
        ),
      ),

    line_string_expression: ($) =>
      prec.left(
        seq(
          '${',
          repeat(';'),
          sepBy1(';', $._expression_or_declaration),
          repeat(';'),
          '}',
        ),
      ),

    _multi_line_str_escape_seq: ($) => prec.left(repeat1(ESCAPE_SEQ)),
    _multi_line_str_text: ($) =>
      prec.left(
        repeat1(
          choice(
            $._multi_line_str_text_no_escape,
            $._multi_line_str_escape_seq,
          ),
        ),
      ),
    // _multi_line_str_text: ($) => choice(/[^\\]/, ESCAPE_SEQ),

    multi_line_string_content: ($) => $._multi_line_str_text,

    multi_line_string_literal: ($) =>
      seq(
        '"""',
        repeat(
          choice($.multi_line_string_expression, $.multi_line_string_content),
        ),
        '"""',
      ),

    multi_line_string_expression: ($) =>
      seq(
        '${',
        repeat(';'),
        repeat($._expression_or_declaration),
        repeat(';'),
        '}',
      ),

    collection_literal: ($) => $.array_literal,

    array_literal: ($) => seq('[', optional($.elements), ']'),

    elements: ($) => sepBy1(',', $.element),

    element: ($) => choice($.expression_element, $.spread_element),

    expression_element: ($) => $._expression,

    spread_element: ($) => seq('*', $._expression),

    tuple_literal: ($) => seq('(', sepBy1(',', $._expression), ')'),

    unit_literal: ($) => seq('(', ')'),

    if_expression: ($) =>
      seq(
        'if',
        '(',
        field('deconstruct', optional(seq('let', $.deconstruct_pattern, '<-'))),
        field('condition', $._expression),
        ')',
        field('consequence', $.block),
        optional(
          seq('else', field('alternative', choice($.if_expression, $.block))),
        ),
      ),

    deconstruct_pattern: ($) =>
      choice(
        $.constant_pattern,
        $.wildcard_pattern,
        $.var_binding_pattern,
        $.tuple_pattern,
        $.enum_pattern,
      ),

    match_expression: ($) =>
      prec.left(
        choice(
          seq('match', '(', field('value', $._expression), ')', $.match_body),
          seq(
            'match',
            '{',
            repeat1(
              seq(
                'case',
                choice($._expression, '_'),
                '=>',
                repeat1($._expression_or_declaration),
              ),
            ),
            '}',
          ),
        ),
      ),

    match_body: ($) => seq('{', repeat($.match_case), '}'),

    match_case: ($) =>
      seq(
        'case',
        $._pattern,
        optional($.pattern_guard),
        '=>',
        $._expression_or_declaration,
        repeat(seq(repeat(';'), $._expression_or_declaration)),
        repeat(';'),
      ),

    pattern_guard: ($) => seq('where', $._expression),

    _pattern: ($) =>
      choice(
        $.constant_pattern,
        $.wildcard_pattern,
        $.var_binding_pattern,
        $.tuple_pattern,
        $.type_pattern,
        $.enum_pattern,
      ),

    constant_pattern: ($) =>
      prec.left(
        seq(
          $._literal_constant,
          repeat(seq('|', optional($._literal_constant))),
        ),
      ),

    wildcard_pattern: ($) => token('_'),

    var_binding_pattern: ($) => $.identifier,

    tuple_pattern: ($) =>
      seq('(', $._pattern, repeat(seq(',', $._pattern)), ')'),

    type_pattern: ($) =>
      seq(choice('_', $.identifier), optional(seq(':', $._type))),

    enum_pattern: ($) =>
      prec.left(
        seq(
          optional(seq($.user_type, '.')),
          $.identifier,
          optional($.enum_pattern_parameters),
          optional(
            seq(
              '|',
              optional(
                seq(
                  optional(seq($.user_type, '.')),
                  $.identifier,
                  optional($.enum_pattern_parameters),
                ),
              ),
            ),
          ),
        ),
      ),

    enum_pattern_parameters: ($) =>
      seq('(', repeat(seq($._pattern, optional(seq(',', $._pattern)))), ')'),

    _loop_expression: ($) =>
      choice($.for_in_expression, $.while_expression, $.do_while_expression),

    for_in_expression: ($) =>
      seq(
        'for',
        optional(
          seq(
            '(',
            optional($._patterns_maybe_irrefutable),
            'in',
            $._expression,
            optional($.pattern_guard),
            ')',
          ),
        ),
        field('body', $.block),
      ),

    _patterns_maybe_irrefutable: ($) =>
      choice(
        $.wildcard_pattern,
        $.var_binding_pattern,
        $.tuple_pattern,
        $.enum_pattern,
      ),

    while_expression: ($) =>
      seq(
        'while',
        '(',
        optional(seq('let', $.deconstruct_pattern, '<-')),
        $._expression,
        ')',
        field('body', $.block),
      ),

    do_while_expression: ($) =>
      prec.left(
        seq(
          'do',
          field('body', $.block),
          'while',
          optional(seq('(', $._expression, ')')),
        ),
      ),

    try_expression: ($) =>
      prec.left(
        choice(
          seq('try', $.block, 'finally', $.block),
          seq(
            'try',
            $.block,
            repeat(seq('catch', seq('(', $.catch_pattern, ')', $.block))),
            optional(seq('finally', $.block)),
          ),
          seq(
            'try',
            seq('(', optional($.resource_specifications), ')'),
            $.block,
            repeat(seq('catch', seq('(', $.catch_pattern, ')', $.block))),
            optional(seq('finally', $.block)),
          ),
        ),
      ),

    catch_pattern: ($) => choice($.wildcard_pattern, $.exception_type_pattern),

    exception_type_pattern: ($) =>
      seq(
        choice('_', $.identifier),
        optional(seq(':', $._type)),
        optional(seq('|', optional($._type))),
      ),

    resource_specifications: ($) =>
      repeat1(
        seq(
          $.resource_specification,
          optional(seq(',', $.resource_specification)),
        ),
      ),

    resource_specification: ($) =>
      prec.left(
        seq(
          $.identifier,
          optional(seq(':', optional($.class_type))),
          optional(seq('=', $._expression)),
        ),
      ),

    jump_expression: ($) =>
      prec.left(
        choice(
          seq('throw', $._expression),
          seq('return', $._expression),
          prec.left(PREC.CLOSURE, 'return'),
          'continue',
          'break',
        ),
      ),
    numeric_type_conv_expr: ($) =>
      seq($.numeric_types, '(', $._expression, ')'),

    rune_type_conv_expr: ($) => seq('Rune', '(', $._expression, ')'),

    this_super_expression: ($) => token(choice('this', 'super')),

    lambda_expression: ($) =>
      seq(
        '{',
        optional($.lambda_parameters),
        '=>',
        optional($._expression_or_declarations),
        '}',
      ),

    trailing_lambda_expression: ($) =>
      prec.left(
        seq(
          '{',
          optional(seq(optional($.lambda_parameters), '=>')),
          optional($._expression_or_declarations),
          '}',
        ),
      ),

    lambda_parameters: ($) =>
      seq(sepBy1(',', $.lambda_parameter), optional(',')),

    lambda_parameter: ($) =>
      seq(choice($.identifier, '_'), optional(seq(':', $._type))),

    spawn_expression: ($) =>
      prec.left(
        seq(
          'spawn',
          optional(seq('(', $._expression, ')')),
          $.trailing_lambda_expression,
        ),
      ),

    synchronized_expression: ($) =>
      seq('synchronized', '(', $._expression, ')', $.block),

    parenthesized_expression: ($) =>
      prec.left(PREC.PARENS, seq('(', $._expression, ')')),

    block: ($) =>
      seq('{', optional($._expression_or_declarations), repeat(';'), '}'),

    unsafe_expression: ($) => seq('unsafe', $.block),

    _expression_or_declarations: ($) => repeat1($._expression_or_declaration),

    _expression_or_declaration: ($) =>
      choice($._expression, $._var_or_func_declaration, ';'),

    _var_or_func_declaration: ($) =>
      choice($.function_definition, $.variable_declaration),

    quote_expression: ($) => seq('quote', $.quote_expr),

    quote_expr: ($) => seq('(', optional($.quote_parameters), ')'),

    quote_parameters: ($) =>
      prec.left(
        repeat1(choice($.quote_token, $.quote_interpolate, $.macro_expression)),
      ),

    quote_token: ($) =>
      prec.left(
        choice(
          '.',
          ',',
          '(',
          ')',
          '[',
          ']',
          '{',
          '}',
          '**',
          '*',
          '%',
          '/',
          '+',
          '-',
          '|>',
          '~>',
          '++',
          '--',
          '&&',
          '||',
          '!',
          '&',
          '|',
          '^',
          '<<',
          '>>',
          ':',
          ';',
          '=',
          '+=',
          '-=',
          '*=',
          '**=',
          '/=',
          '%=',
          '&&=',
          '||=',
          '&=',
          '|=',
          '^=',
          '<<=',
          '>>=',
          '->',
          '=>',
          '...',
          '..=',
          '..',
          '#',
          '@',
          '?',
          '<:',
          '<',
          '>',
          '<=',
          '>=',
          '!=',
          '==',
          '_',
          '\\',
          '`',
          '$',
          'Int8',
          'Int16',
          'Int32',
          'Int64',
          'UInt8',
          'UInt16',
          'UInt32',
          'UInt64',
          'Float16',
          'Float32',
          'Float64',
          'Rune',
          'Bool',
          'Unit',
          'Nothing',
          'struct',
          'enum',
          'This',
          'package',
          'import',
          'class',
          'interface',
          'func',
          'let',
          'var',
          'type',
          'init',
          'this',
          'super',
          'if',
          'else',
          'case',
          'try',
          'catch',
          'finally',
          'for',
          'do',
          'while',
          'throw',
          'return',
          'continue',
          'break',
          'as',
          'in',
          '!in',
          'match',
          'from',
          'where',
          'extend',
          'spawn',
          'synchronized',
          'macro',
          'quote',
          'true',
          'false',
          'sealed',
          'static',
          'public',
          'private',
          'protected',
          'override',
          'abstract',
          'open',
          'operator',
          'foreign',
          $.identifier,
          $.dollar_identifier,
          $._literal_constant,
        ),
      ),

    quote_interpolate: ($) => seq('$', $.quote_expression),

    macro_expression: ($) =>
      prec.left(
        seq(
          '@',
          $.identifier,
          optional($.macro_attr_expr),
          repeat(
            choice(
              $.macro_input_expr_without_parens,
              $.macro_input_expr_with_parens,
            ),
          ),
        ),
      ),

    macro_attr_expr: ($) => seq('[', repeat($.quote_token), ']'),
    macro_input_expr_without_parens: ($) =>
      choice(
        $.function_definition,
        $.operator_function_definition,
        $.static_init,
        $.struct_definition,
        $.struct_primary_init,
        $.struct_init,
        $.enum_definition,
        $.case_body,
        $.class_definition,
        $.class_primary_init,
        $.class_init,
        $.interface_definition,
        $.variable_declaration,
        $.property_definition,
        $.extend_definition,
        $.macro_expression,
      ),
    macro_input_expr_with_parens: ($) => seq('(', repeat($.macro_tokens), ')'),
    macro_tokens: ($) => choice($.quote_token, $.macro_expression),

    assignment_operator: ($) =>
      token(
        choice(
          '=',
          '+=',
          '-=',
          '**=',
          '*=',
          '/=',
          '%=',
          '&=',
          '^=',
          '|=',
          '&&=',
          '||=',
          '<<=',
          '>>=',
        ),
      ),
    equality_operator: ($) => token(choice('!=', '==')),
    comparison_operator: ($) => token(choice('<', '>', '<=', '>=')),
    shifting_operator: ($) => token(choice('<<', '>>')),
    flow_operator: ($) => token(choice('|>', '>>=')),
    additive_operator: ($) => token(choice('+', '-')),
    exponent_operator: ($) => token('**'),
    multiplicative_operator: ($) => token(choice('*', '/', '%')),
    prefix_unary_operator: ($) => token(choice('-', '!')),

    overloaded_operators: ($) =>
      token(
        choice(
          '[]',
          '!',
          '+',
          '-',
          '**',
          '*',
          '/',
          '%',
          '<<',
          '>>',
          '<',
          '>',
          '<=',
          '>=',
          '==',
          '!=',
          '&',
          '^',
          '|',
        ),
      ),

    // Identifiers and literals
    identifier: ($) =>
      token(
        /`[_\p{XID_Start}][_\p{XID_Continue}]*`|[_\p{XID_Start}][_\p{XID_Continue}]*/u,
      ),
    _identifier_or_keyword: ($) =>
      choice(
        $.identifier,
        'abstract',
        'public',
        'private',
        'protected',
        'internal',
        'open',
        'redef',
        'sealed',
        'override',
        'get',
        'set',
      ),
    dollar_identifier: ($) => seq('$', $.identifier),

    // Comments
    comment: ($) => choice($.line_comment, $.delimited_comment),
    line_comment: ($) => prec(PREC.COMMENT, seq('//', /[^\r\n]*/)),
    delimited_comment: ($) =>
      prec(PREC.COMMENT, seq('/*', /[^*]*\*+([^/*][^*]*\*+)*/, '/')),

    // Delimiters
    QUOTE_OPEN: ($) => '"',
    QUOTE_CLOSE: ($) => '"',

    // Literals
    integer_literal: (_) =>
      token(
        seq(
          choice(/[0-9][0-9_]*/, /0x[0-9a-fA-F_]+/, /0b[01_]+/, /0o[0-7_]+/),
          optional(choice(...INTEGER_SUFFIX)),
        ),
      ),
    float_literal: ($) =>
      token(
        choice(
          seq(
            choice(
              seq(DECIMAL_LITERAL, DECIMAL_EXPONENT),
              seq(DECIMAL_FRACTION, optional(DECIMAL_EXPONENT)),
              seq(
                DECIMAL_LITERAL,
                DECIMAL_FRACTION,
                optional(DECIMAL_EXPONENT),
              ),
            ),
            optional(choice(...FLOAT_SUFFIX)),
          ),
          seq(
            HEXADECIMAL_PREFIX,
            choice(
              HEXADECIMAL_DIGITS,
              HEXADECIMAL_FRACTION,
              seq(HEXADECIMAL_DIGITS, HEXADECIMAL_FRACTION),
            ),
            HEXADECIMAL_EXPONENT,
          ),
        ),
      ),

    rune_literal: ($) => token(seq("r'", choice(SINGLE_CHAR, ESCAPE_SEQ), "'")),

    byte_literal: ($) =>
      token(seq("b'", choice(SINGLE_CHAR_BYTE, BYTE_ESCAPE_SEQ), "'")),
    byte_string_array_literal: ($) =>
      token(seq('b"', repeat(choice(SINGLE_CHAR_BYTE, BYTE_ESCAPE_SEQ)), '"')),
    j_string_literal: ($) =>
      token(seq('j"', repeat(choice(SINGLE_CHAR_BYTE, ESCAPE_SEQ)), '"')),
    triple_quote_close: ($) => seq(optional(/"{1,}/), '"""'),
    multi_line_raw_string_literal: ($) =>
      prec.left(
        seq(
          $.multi_line_raw_string_start,
          $.multi_line_raw_string_content,
          $.multi_line_raw_string_end,
        ),
      ),
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
