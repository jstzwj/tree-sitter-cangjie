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
  REL: 13, // <  <=  >  >=  instanceof
  RANGE: 14, // .. ..=
  SHIFT: 15, // <<  >>  >>>
  ADD: 16, // +  -
  MULT: 17, // *  /  %
  CAST: 18, // (Type)
  EXP: 19, // **
  NEG: 20, // +  -
  NOT: 21, // !
  QUESTION: 22, // ?
  INC: 23, // a++  a--
  ARRAY: 24, // [Index]
  OBJ_ACCESS: 25, // .
  PARENS: 26, // (Expression)
  CLASS_LITERAL: 27, // .

  PROPERTY_MODIFIER: 28, // public, private
  VARIABLE_MODIFIER: 29, // public, private
  INTERFACE_MODIFIER: 30, // public, private
  FUNCTION_MODIFIER: 31, // public, private
  CLASS_MODIFIER: 32, // public, private
};

const INTEGER_SUFFIX = ['i8', 'i16', 'i32', 'i64', 'u8', 'u16', 'u32', 'u64'];
const FLOAT_SUFFIX = ['f16', 'f32', 'f64'];

const SINGLE_CHAR_BYTE =
  /[\u0000-\u0009\u000B\u000C\u000E-\u0021\u0023-\u0026\u0028-\u005B\u005D-\u007F]/;
const SINGLE_CHAR = /[^'\\\r\n]/;
const UNI_CHARACTER_LITERAL = /\\u\{[0-9a-fA-F]{1,8}\}/;
const ESCAPED_IDENTIFIER = /\\[tbrn'"\\fv0$]/;
const ESCAPE_SEQ = choice(UNI_CHARACTER_LITERAL, ESCAPED_IDENTIFIER);

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
  extras: ($) => [
    /[\s]/,
    /[\n]/,
    /[\r\n]/,
    $.line_comment,
    $.delimited_comment,
  ],
  word: ($) => $.identifier,
  conflicts: ($) => [
    [$.source_file],
    [$.block],
    [$._atomic_expression],
    [$.quest_seperated_item],
    [$.item_after_quest],
    [$.foreign_body],
    [$.class_body],
    [$.interface_body],
    [$.function_definition],
    [$.class_unnamed_init_param_list],
    [$.named_parameter_list],
    [$.class_init],
    [$.struct_unnamed_init_param_list],
    [$.unnamed_parameter_list],
    [$.operator_function_definition],
    [$.property_definition],
    [$.resource_specification],
    [$.static_init],
    [$.match_case],
    [$.match_body],
    [$.if_expression],
    [$.line_string_expression],
    [$.multi_line_string_expression],
    [$._expression_or_declarations],
    [$.do_while_expression],
    [$._atomic_expression, $._literal_constant],
    [$.unit_literal, $.tuple_pattern],
    [$.unnamed_tuple_type, $.parenthesized_type],
    [$.unnamed_parameter, $.tuple_type],
    [$.var_binding_pattern, $.enum_pattern],
    [$.wildcard_pattern, $.type_pattern],
    [$.var_binding_pattern, $.type_pattern, $.enum_pattern],
    [$.function_modifier_list],
    [$.foreign_body, $._foreign_member_declaration],
    [$.class_non_static_member_modifier, $.struct_non_static_member_modifier],
    [$.tuple_type, $.user_type, $.left_value_expression_without_wildcard, $.left_aux_expression, $._atomic_expression],
    [$.wildcard_pattern, $.exception_type_pattern],
    [$.tuple_literal, $.parenthesized_expression],
    [$.left_aux_expression, $.prefix_unary_expression, $.postfix_expression],
    [$.struct_name, $.enum_pattern],
    [$.class_init, $.struct_init],
    [$.tuple_type, $.parenthesized_type],
    [$.left_aux_expression, $.multiplicative_expression, $.postfix_expression],
    [
      $.left_aux_expression,
      $.bitwise_conjunction_expression,
      $.postfix_expression,
    ],
    [$.user_type, $.var_binding_pattern, $.enum_pattern],
    [$.class_primary_init, $.this_super_expression],
    [$.user_type, $.enum_pattern],
    [$.upper_bounds],
    [$.generic_constraints],
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
    [$._atomic_expression, $.lambda_parameter],
    [$.user_type, $._expression],
    [$.user_type, $.left_aux_expression],
    [$.left_aux_expression, $.resource_specification],
    [$.class_primary_init, $.case_body, $.struct_name],
    [
      $.class_primary_init,
      $.struct_name,
      $.var_binding_pattern,
      $.enum_pattern,
    ],
    [$.unnamed_parameter, $.type_pattern],
    [$.left_aux_expression, $.shifting_expression, $.postfix_expression],
    [$.left_aux_expression, $.additive_expression, $.postfix_expression],
    [$.left_aux_expression, $.exponent_expression, $.postfix_expression],
    [$.left_aux_expression, $.flow_expression, $.postfix_expression],
    [$.user_type, $._atomic_expression],
  ],
  rules: {
    source_file: ($) =>
      seq(
        optional($.preamble),
        repeat($._top_level_object),
        optional($.main_definition),
        repeat($._top_level_object),
      ),

    _end: ($) => token(choice(';', '\n', '\r\n')),

    // Preamble, package, and import definitions
    preamble: ($) =>
      choice(
        $.package_header,
        seq(optional($.package_header), repeat1($.import_list)),
      ),
    package_header: ($) =>
      seq('package', $.package_name_identifier, optional($._end)),
    package_name_identifier: ($) => sepBy1('.', $.identifier),
    import_list: ($) =>
      seq(
        optional(seq('from', $.identifier)),
        'import',
        sepBy1(',', $.import_part),
        optional($._end),
      ),
    import_part: ($) => sepBy1('.', choice('*', $.identifier)),
    import_alias: ($) => seq('as', $.identifier),

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
        optional($.class_modifier_list),
        'class',
        field('name', $.identifier),
        field('type_parameters', optional($.type_parameters)),
        optional(seq('<:', optional($.super_class_or_interfaces))),
        optional($.generic_constraints),
        field('body', $.class_body),
      ),

    super_class_or_interfaces: ($) => sepBy1('&', $.super_interfaces),
    class_modifier_list: ($) => repeat1($.class_modifier),
    class_modifier: ($) =>
      prec.left(
        PREC.CLASS_MODIFIER,
        choice(
          'public',
          'protected',
          'internal',
          'private',
          'abstract',
          'open',
        ),
      ),
    type_parameters: ($) => seq('<', sepBy1(',', $.identifier), '>'),
    class_type: ($) =>
      seq(sepBy1('.', $.identifier), optional($.type_parameters)),
    super_interfaces: ($) => sepBy1(',', $.class_type),
    generic_constraints: ($) =>
      seq(
        'where',
        choice($.identifier, 'This'),
        '<:',
        $.upper_bounds,
        repeat(seq(',', choice($.identifier, 'This'), '<:', $.upper_bounds)),
      ),
    upper_bounds: ($) => sepBy1('&', $._type),
    class_body: ($) =>
      seq(
        '{',
        repeat($._end),
        sepBy(repeat1($._end), $._class_member_declaration),
        repeat($._end),
        optional($.class_primary_init),
        repeat($._end),
        sepBy(repeat1($._end), $._class_member_declaration),
        repeat($._end),
        '}',
      ),

    _class_member_declaration: ($) =>
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
    class_init: ($) =>
      seq(
        optional(choice($.class_non_static_member_modifier, 'const')),
        'init',
        $.function_parameters,
        $.block,
        repeat($._end),
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
        repeat($._end),
      ),
    class_primary_init: ($) =>
      seq(
        optional(choice($.class_non_static_member_modifier, 'const')),
        field('name', $.identifier),
        '(',
        $.class_primary_init_param_lists,
        ')',
        '{',
        optional(seq('super', $.call_suffix)),
        repeat($._end),
        optional($._expression_or_declarations),
        '}',
      ),

    class_primary_init_param_lists: ($) =>
      choice(
        seq(
          $.unnamed_parameter_list,
          optional(seq(',', $.named_parameter_list)),
          optional(seq(',', $.class_named_init_param_list)),
        ),
        seq(
          $.unnamed_parameter_list,
          optional(seq(',', $.class_unnamed_init_param_list)),
          optional(seq(',', $.class_named_init_param_list)),
        ),
        seq(
          $.class_unnamed_init_param_list,
          optional(seq(',', $.class_named_init_param_list)),
        ),
        seq(
          $.named_parameter_list,
          optional(seq(',', $.class_named_init_param_list)),
        ),
        $.class_named_init_param_list,
      ),
    class_unnamed_init_param_list: ($) =>
      seq(
        $.class_unnamed_init_param,
        repeat(seq(',', $.class_unnamed_init_param)),
      ),
    class_named_init_param_list: ($) => sepBy1(',', $.class_named_init_param),
    class_unnamed_init_param: ($) =>
      seq(
        optional($.class_non_static_member_modifier),
        choice('let', 'var'),
        $.identifier,
        ':',
        $._type,
      ),
    class_named_init_param: ($) =>
      seq(
        optional($.class_non_static_member_modifier),
        choice('let', 'var'),
        $.identifier,
        '!',
        ':',
        $._type,
        optional(seq('=', $._expression)),
      ),

    class_non_static_member_modifier: ($) =>
      prec.left(
        PREC.CLASS_MODIFIER,
        choice('public', 'private', 'protected', 'internal'),
      ),

    class_finalizer: ($) => seq('~', 'init', '(', ')', $.block),

    // Interface definition
    interface_definition: ($) =>
      seq(
        optional($.interface_modifier_list),
        'interface',
        $.identifier,
        optional($.type_parameters),
        optional(seq('<:', $.super_interfaces)),
        optional($.generic_constraints),
        $.interface_body,
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
      choice(
        $.function_definition,
        $.operator_function_definition,
        $.macro_expression,
        $.property_definition,
      ),
    interface_modifier_list: ($) => repeat1($.interface_modifier),
    interface_modifier: ($) =>
      prec.left(
        PREC.INTERFACE_MODIFIER,
        choice('public', 'protected', 'internal', 'private', 'open'),
      ),

    // Function definition
    function_definition: ($) =>
      seq(
        field('modifier', optional($.function_modifier_list)),
        'func',
        field('name', $.identifier),
        field('type_parameters', optional($.type_parameters)),
        field('parameters', $.function_parameters),
        optional(seq(':', field('return_type', $._type))),
        optional($.generic_constraints),
        field('body', optional($.block)),
      ),
    function_modifier_list: ($) => repeat1($.function_modifier),
    function_modifier: ($) =>
      prec.left(
        PREC.FUNCTION_MODIFIER,
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
        optional($.function_modifier_list),
        'operator',
        'func',
        $.overloaded_operators,
        optional($.type_parameters),
        $.function_parameters,
        optional($._type),
        optional($.generic_constraints),
        optional($.block),
      ),

    function_parameters: ($) =>
      choice(
        seq(
          '(',
          optional($.unnamed_parameter_list),
          optional(seq(',', $.named_parameter_list)),
          ')',
        ),
        seq('(', optional($.named_parameter_list), ')'),
      ),

    nondefault_parameter_list: ($) =>
      choice(
        seq(
          $.unnamed_parameter,
          optional(seq(',', $.unnamed_parameter)),
          optional(seq(',', $.named_parameter)),
        ),
        seq($.named_parameter, optional(seq(',', $.named_parameter))),
      ),

    unnamed_parameter_list: ($) => sepBy1(',', $.unnamed_parameter),

    unnamed_parameter: ($) => seq(choice($.identifier, '_'), ':', $._type),

    named_parameter_list: ($) =>
      sepBy1(',', choice($.named_parameter, $.default_parameter)),

    named_parameter: ($) => seq($.identifier, '!', ':', $._type),

    default_parameter: ($) =>
      seq($.identifier, '!', ':', $._type, '=', $._expression),

    // Variable Declaration
    variable_declaration: ($) =>
      prec.left(
        seq(
          field('modifier', repeat($.variable_modifier)),
          choice('let', 'var', 'const'),
          field('name', $._patterns_maybe_irrefutable),
          choice(
            seq(
              optional(seq(':', field('type', $._type))),
              optional(seq('=', field('value', $._expression))),
            ),
            seq(':', field('type', $._type)),
          ),
        ),
      ),
    variable_modifier: ($) =>
      choice('public', 'protected', 'internal', 'private', 'static'),

    // Enum Definition
    enum_definition: ($) =>
      seq(
        optional($.enum_modifier),
        'enum',
        field('name', $.identifier),
        optional(seq($.type_parameters)),
        optional(seq('<:', $.super_interfaces)),
        optional($.generic_constraints),
        '{',
        optional($.enum_body),
        '}',
      ),
    enum_modifier: ($) => choice('public', 'protected', 'internal', 'private'),
    enum_body: ($) =>
      seq(
        optional('|'),
        $.case_body,
        repeat(seq('|', $.case_body)),
        repeat(
          choice(
            $.function_definition,
            $.operator_function_definition,
            $.property_definition,
            $.macro_expression,
          ),
        ),
      ),
    case_body: ($) =>
      seq(
        $.identifier,
        optional(seq('(', $._type, repeat(seq(',', $._type)), ')')),
      ),

    // Struct Definition
    struct_definition: ($) =>
      seq(
        optional($.struct_modifier),
        'struct',
        field('name', $.identifier),
        field('type_parameters', optional(seq($.type_parameters))),
        optional(seq('<:', $.super_interfaces)),
        optional($.generic_constraints),
        field('body', $.struct_body),
      ),
    struct_body: ($) =>
      seq(
        '{',
        repeat(
          choice($._struct_member_declaration, $.struct_primary_init, $._end),
        ),
        '}',
      ),
    _struct_member_declaration: ($) =>
      choice(
        $.struct_init,
        $.static_init,
        $.variable_declaration,
        $.function_definition,
        $.operator_function_definition,
        $.macro_expression,
        $.property_definition,
      ),
    struct_init: ($) =>
      seq(
        optional(seq(choice($.struct_non_static_member_modifier, 'const'))),
        'init',
        $.function_parameters,
        $.block,
      ),
    struct_primary_init: ($) =>
      seq(
        optional(seq(choice($.struct_non_static_member_modifier, 'const'))),
        $.struct_name,
        '(',
        optional($.struct_primary_init_param_lists),
        ')',
        '{',
        optional($._expression_or_declarations),
        '}',
      ),
    struct_name: ($) => $.identifier,

    struct_primary_init_param_lists: ($) =>
      choice(
        seq(
          $.unnamed_parameter_list,
          optional(seq(',', $.named_parameter_list)),
          optional(seq(',', $.struct_named_init_param_list)),
        ),
        seq(
          $.unnamed_parameter_list,
          optional(seq(',', $.struct_unnamed_init_param_list)),
          optional(seq(',', $.struct_named_init_param_list)),
        ),
        seq(
          $.struct_unnamed_init_param_list,
          optional(seq(',', $.struct_named_init_param_list)),
        ),
        seq(
          $.named_parameter_list,
          optional(seq(',', $.struct_named_init_param_list)),
        ),
        $.struct_named_init_param_list,
      ),

    struct_unnamed_init_param_list: ($) =>
      seq(
        $.struct_unnamed_init_param,
        repeat(seq(',', $.struct_unnamed_init_param)),
      ),

    struct_named_init_param_list: ($) =>
      seq(
        $.struct_named_init_param,
        repeat(seq(',', $.struct_named_init_param)),
      ),

    struct_unnamed_init_param: ($) =>
      seq(
        optional($.struct_non_static_member_modifier),
        choice('let', 'var'),
        $.identifier,
        ':',
        $._type,
      ),

    struct_named_init_param: ($) =>
      seq(
        optional($.struct_non_static_member_modifier),
        choice('let', 'var'),
        $.identifier,
        'not',
        ':',
        $._type,
        optional(seq('=', $._expression)),
      ),

    struct_modifier: ($) =>
      prec.left(
        PREC.CLASS_MODIFIER,
        choice('public', 'protected', 'internal', 'private'),
      ),

    struct_non_static_member_modifier: ($) =>
      prec.left(
        PREC.CLASS_MODIFIER,
        choice('public', 'protected', 'internal', 'private'),
      ),

    // Type Alias
    type_alias: ($) =>
      seq(
        optional($.type_modifier),
        'type',
        $.identifier,
        optional($.type_parameters),
        '=',
        $._type,
        optional($._end),
      ),
    type_modifier: ($) => choice('public', 'protected', 'internal', 'private'),

    // Extend Definition
    extend_definition: ($) =>
      seq(
        'extend',
        optional($.extend_type),
        optional(seq('<:', $.super_interfaces)),
        optional($.generic_constraints),
        $.extend_body,
      ),
    extend_type: ($) =>
      choice(
        $.type_parameters,
        seq(sepBy1('.', $.identifier), optional($.type_arguments)),
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
    extend_body: ($) => seq('{', repeat($._extend_member_declaration), '}'),
    _extend_member_declaration: ($) =>
      choice(
        $.function_definition,
        $.operator_function_definition,
        $.macro_expression,
        $.property_definition,
      ),

    foreign_declaration: ($) =>
      seq('foreign', choice($.foreign_body, $._foreign_member_declaration)),

    foreign_body: ($) =>
      seq(
        '{',
        repeat($._end),
        repeat($._foreign_member_declaration),
        repeat($._end),
        '}',
      ),

    _foreign_member_declaration: ($) =>
      choice(
        $.class_definition,
        $.interface_definition,
        $.function_definition,
        $.macro_expression,
        $.variable_declaration,
        $._end, // Allowing end after each member declaration
      ),

    annotation_list: ($) => repeat1($.annotation),

    annotation: ($) =>
      seq(
        '@',
        repeat(seq($.identifier, '.')),
        $.identifier,
        optional(seq('[', $.annotation_argument_list, ']')),
      ),

    annotation_argument_list: ($) =>
      seq($.annotation_argument, repeat(seq(',', $.annotation_argument))),

    annotation_argument: ($) =>
      choice(seq($.identifier, ':', $._expression), $._expression),

    macro_definition: ($) =>
      seq(
        'public',
        'macro',
        $.identifier,
        choice($.macro_without_attr_param, $.macro_with_attr_param),
        optional(seq(':', $.identifier)),
        optional(seq('=', $._expression)),
      ),

    macro_without_attr_param: ($) => seq('(', $.macro_input_decl, ')'),

    macro_with_attr_param: ($) =>
      seq('(', $.macro_attr_decl, ',', $.macro_input_decl, ')'),

    macro_input_decl: ($) => seq($.identifier, ':', $.identifier),

    macro_attr_decl: ($) => seq($.identifier, ':', $.identifier),

    property_definition: ($) =>
      seq(
        repeat($.property_modifier),
        'prop',
        field('name' ,$.identifier),
        ':',
        field('type', $._type),
        optional($.property_body),
      ),

    property_body: ($) =>
      seq('{', repeat($._end), repeat1($.property_member_declaration), '}'),

    property_member_declaration: ($) =>
      choice(
        seq('get', '(', ')', $.block),
        seq('set', '(', $.identifier, ')', $.block),
      ),

    property_modifier: ($) =>
      prec.left(
        PREC.PROPERTY_MODIFIER,
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
      ),
    // Main Definition
    main_definition: ($) =>
      seq(
        'main', // Matches the keyword 'main' // Matches newlines if present
        $.function_parameters, // Matches function parameters
        optional(seq(':', $._type)), // Optionally matches a colon followed by the type // Matches newlines if present
        $.block, // Matches the block of the function
      ),

    // Type
    _type: ($) =>
      choice($.arrow_type, $.tuple_type, $.prefix_type, $._atomic_type),

    arrow_type: ($) => seq($.arrow_parameters, '->', $._type),

    arrow_parameters: ($) =>
      choice(
        $.unnamed_arrow_parameters,
        $.named_arrow_parameters,
      ),
    unnamed_arrow_parameters: ($) => seq('(', sepBy(',', $._type), ')'),
    named_arrow_parameters: ($) => seq('(', sepBy1(',', seq(choice('_', $.identifier), ':', $._type)), ')'),

    tuple_type: ($) =>
      choice(
        $.unnamed_tuple_type,
        $.named_tuple_type,
      ),
    unnamed_tuple_type: ($) => seq('(', sepBy1(',', $._type), ')'),
    named_tuple_type: ($) => seq('(', sepBy1(',', seq(choice('_', $.identifier), ':', $._type)), ')'),

    prefix_type: ($) => seq($.prefix_type_operator, $._type),

    prefix_type_operator: ($) => token('?'),

    _atomic_type: ($) =>
      choice($.char_lang_types, $.user_type, $.parenthesized_type),

    char_lang_types: ($) =>
      choice(
        $.numeric_types,
        'rune',
        'boolean',
        'nothing',
        'unit',
        'this_type',
      ),

    numeric_types: ($) =>
      token(
        choice(
          'int8',
          'int16',
          'int32',
          'int64',
          'int_native',
          'uint8',
          'uint16',
          'uint32',
          'uint64',
          'uint_native',
          'float16',
          'float32',
          'float64',
        ),
      ),

    user_type: ($) =>
      prec.left(
        seq(
          repeat(seq($.identifier, '.')),
          $.identifier,
          optional($.type_arguments),
        ),
      ),

    parenthesized_type: ($) => seq('(', $._type, ')'),

    type_arguments: ($) =>
      prec.left(PREC.PARENS, seq('<', $._type, repeat(seq(',', $._type)), '>')),

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
      ),

    assignment_expression: ($) =>
      prec.right(
        PREC.ASSIGN,
        choice(
          seq(
            field('left', $.left_value_expression_without_wildcard),
            field('operator', $.assignment_operator),
            field('right', $._expression),
          ),
          seq(
            field('left', $.left_value_expression),
            field('operator', '='),
            field('right', $._expression),
          ),
          seq(
            field('left', $.tuple_left_value_expression),
            field('operator', '='),
            field('right', $._expression),
          ),
        ),
      ),

    tuple_left_value_expression: ($) =>
      seq(
        '(',
        choice($.left_value_expression, $.tuple_left_value_expression),
        repeat(
          seq(
            ',',
            choice($.left_value_expression, $.tuple_left_value_expression),
          ),
        ),
        optional(','),
        ')',
      ),

    left_value_expression: ($) =>
      choice($.left_value_expression_without_wildcard, '_'),

    left_value_expression_without_wildcard: ($) =>
      prec.left(
        PREC.DECL,
        choice(
          $.identifier,
          $.left_aux_expression,
          seq($.left_aux_expression, optional('?'), $._assignable_suffix),
        ),
      ),

    left_aux_expression: ($) =>
      prec.left(
        PREC.DECL,
        choice(
          // seq($.identifier, optional($.type_arguments)),
          $._type,
          $.this_super_expression,
          seq(
            $._expression,
            optional('?'),
            '.',
            $.identifier,
            optional($.type_arguments),
          ),
          seq($._expression, optional('?'), $.call_suffix),
          seq($._expression, optional('?'), $.index_access),
        ),
      ),

    _assignable_suffix: ($) => choice($.field_access, $.index_access),

    field_access: ($) => seq('.', $.identifier),

    flow_expression: ($) =>
      prec.left(
        PREC.FLOW,
        seq(
          field('left', $._expression),
          field('operator', $.flow_operator),
          field('right', $._expression),
        ),
      ),

    coalescing_expression: ($) =>
      prec.left(
        PREC.COALESCING,
        seq(
          field('left', $._expression),
          field('operator', '??'),
          field('right', $._expression),
        ),
      ),

    logic_disjunction_expression: ($) =>
      prec.left(
        PREC.OR,
        seq(
          field('left', $._expression),
          field('operator', '||'),
          field('right', $._expression),
        ),
      ),

    logic_conjunction_expression: ($) =>
      prec.left(
        PREC.AND,
        seq(
          field('left', $._expression),
          field('operator', '&&'),
          field('right', $._expression),
        ),
      ),

    range_expression: ($) =>
      prec.left(
        PREC.RANGE,
        seq(
          field('left', $._expression),
          field('operator', choice('..', '..=')),
          field('right', $._expression),
        ),
      ),

    bitwise_disjunction_expression: ($) =>
      prec.left(
        PREC.BIT_OR,
        seq(
          field('left', $._expression),
          field('operator', '|'),
          field('right', $._expression),
        ),
      ),

    bitwise_xor_expression: ($) =>
      prec.left(
        PREC.BIT_XOR,
        seq(
          field('left', $._expression),
          field('operator', '^'),
          field('right', $._expression),
        ),
      ),

    bitwise_conjunction_expression: ($) =>
      prec.left(
        PREC.BIT_AND,
        seq(
          field('left', $._expression),
          field('operator', '&'),
          field('right', $._expression),
        ),
      ),

    equality_comparison_expression: ($) =>
      prec.left(
        PREC.EQUALITY,
        seq(
          $._expression,
          field('operator', choice('==', '!=')),
          $._expression,
        ),
      ),

    comparison_or_type_expression: ($) =>
      prec.left(
        PREC.REL,
        choice(
          seq(
            field('left', $._expression),
            field('operator', choice('<', '>', '<=', '>=')),
            field('right', $._expression),
          ),
          seq(
            field('left', $._expression),
            field('operator', 'is'),
            field('right', $._type),
          ),
          seq(
            field('left', $._expression),
            field('operator', 'as'),
            field('right', $._type),
          ),
        ),
      ),

    shifting_expression: ($) =>
      prec.left(
        PREC.SHIFT,
        seq(
          field('left', $._expression),
          field('operator', choice('<<', '>>')),
          field('right', $._expression),
        ),
      ),

    additive_expression: ($) =>
      prec.left(
        PREC.ADD,
        seq(
          field('left', $._expression),
          field('operator', choice('+', '-')),
          field('right', $._expression),
        ),
      ),

    multiplicative_expression: ($) =>
      prec.left(
        PREC.MULT,
        seq(
          field('left', $._expression),
          field('operator', choice('*', '/', '%')),
          field('right', $._expression),
        ),
      ),

    exponent_expression: ($) =>
      prec.left(
        PREC.EXP,
        seq(
          field('left', $._expression),
          field('operator', '**'),
          field('right', $._expression),
        ),
      ),

    prefix_unary_expression: ($) =>
      prec.left(PREC.NEG, seq($.prefix_unary_operator, $._expression)),

    inc_and_dec_expression: ($) =>
      prec.left(PREC.INC, seq($._expression, choice('++', '--'))),

    postfix_expression: ($) =>
      prec.left(
        PREC.ARRAY,
        choice(
          // seq($._type, '.', $.identifier),
          seq($._expression, '.', $.identifier, optional($.type_arguments)),
          seq($._expression, $.call_suffix),
          seq($._expression, $.index_access),
          seq(
            $._expression,
            '.',
            $.identifier,
            optional($.call_suffix),
            $.trailing_lambda_expression,
          ),
          // prec(-1, seq(
          //   $.identifier,
          //   optional($.call_suffix),
          //   $.trailing_lambda_expression,
          // )),
          seq($._expression, repeat1(seq('?', $.quest_seperated_items))),
        ),
      ),

    quest_seperated_items: ($) => prec.left(repeat1($.quest_seperated_item)),

    quest_seperated_item: ($) =>
      seq(
        $.item_after_quest,
        optional(choice(
          $.call_suffix,
          seq(optional($.call_suffix), $.trailing_lambda_expression),
          $.index_access,
        )),
      ),
    item_after_quest: ($) =>
      choice(
        seq('.', $.identifier, optional($.type_arguments)),
        $.call_suffix,
        $.index_access,
        $.trailing_lambda_expression,
      ),

    call_suffix: ($) =>
      seq(
        token.immediate('('),
        optional(seq($.value_argument, repeat(seq(',', $.value_argument)))),
        ')',
      ),

    value_argument: ($) =>
      choice(
        seq($.identifier, ':', $._expression),
        $._expression,
        $.ref_transfer_expression,
      ),

    ref_transfer_expression: ($) =>
      seq('inout', optional(seq($._expression, '.', $.identifier))),

    index_access: ($) =>
      seq(token.immediate('['), choice($._expression, $.range_element), ']'),

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
      choice(
        $._literal_constant,
        $.collection_literal,
        $.tuple_literal,
        seq($.identifier, optional($.type_arguments)),
        $.unit_literal,
        $.if_expression,
        $.match_expression,
        $.loop_expression,
        $.try_expression,
        $.jump_expression,
        $.numeric_type_conv_expr,
        $.this_super_expression,
        $.spawn_expression,
        $.synchronized_expression,
        $.parenthesized_expression,
        $.lambda_expression,
        $.quote_expression,
        $.macro_expression,
        $.unsafe_expression,
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

    _line_string_content: ($) => $._line_str_text,

    line_string_literal: ($) =>
      choice(
        seq(
          '"',
          repeat(choice($.line_string_expression, $._line_string_content)),
          '"',
        ),
        seq(
          "'",
          repeat(choice($.line_string_expression, $._line_string_content)),
          "'",
        ),
      ),

    line_string_expression: ($) =>
      seq(
        '${',
        repeat(';'),
        repeat($._expression_or_declaration),
        repeat(';'),
        '}',
      ),

    multi_line_string_content: ($) => $.multi_line_str_text,

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
        repeat($._end),
        repeat($._expression_or_declaration),
        repeat($._end),
        '}',
      ),

    collection_literal: ($) => $.array_literal,

    array_literal: ($) => seq('[', optional(seq($.elements)), ']'),

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
        repeat($._end),
        optional(seq('else', field('alternative', choice($.if_expression, $.block)))),
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
        PREC.COMMENT,
        choice(
          seq(
            'match',
            repeat($._end),
            '(',
            field('value', $._expression),
            ')',
            repeat($._end),
            $.match_body,
          ),
        ),
      ),

    match_body: ($) =>
      seq('{', repeat($._end), repeat($.match_case), repeat($._end), '}'),

    match_case: ($) =>
      seq(
        'case',
        optional(seq($._pattern)),
        optional($.pattern_guard),
        '=>',
        $._expression_or_declaration,
        repeat(seq(repeat($._end), $._expression_or_declaration)),
        repeat($._end),
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
          optional(seq('|', optional($._literal_constant))),
        ),
      ),

    wildcard_pattern: ($) => token('_'),

    var_binding_pattern: ($) => $.identifier,

    tuple_pattern: ($) =>
      seq('(', repeat(seq($._pattern, optional(seq(',', $._pattern)))), ')'),

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

    loop_expression: ($) =>
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
        $.block,
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
        $.block,
      ),

    do_while_expression: ($) =>
      seq('do', $.block, 'while', optional(seq('(', $._expression, ')'))),

    try_expression: ($) =>
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
      seq(
        $.identifier,
        optional(seq(':', optional($.class_type))),
        optional(seq('=', $._expression)),
      ),

    jump_expression: ($) =>
      prec.left(
        PREC.COMMENT,
        choice(
          seq('throw', $._expression),
          seq('return', $._expression),
          prec(PREC.CLOSURE, 'return'),
          'continue',
          'break',
        ),
      ),
    numeric_type_conv_expr: ($) =>
      seq($.numeric_types, '(', $._expression, ')'),

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
      seq(
        '{',
        optional(seq(optional($.lambda_parameters), '=>')),
        optional($._expression_or_declarations),
        '}',
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
          optional(seq($.trailing_lambda_expression)),
        ),
      ),

    synchronized_expression: ($) =>
      seq('synchronized', '(', $._expression, ')', $.block),

    parenthesized_expression: ($) =>
      prec.left(PREC.PARENS, seq('(', $._expression, ')')),

    block: ($) => seq('{', optional($._expression_or_declarations), '}'),

    unsafe_expression: ($) => seq('unsafe', $.block),

    _expression_or_declarations: ($) =>
      seq(
        repeat($._end),
        sepBy1(repeat1($._end), $._expression_or_declaration),
        repeat($._end),
      ),

    _expression_or_declaration: ($) =>
      choice($._expression, $._var_or_func_declaration),

    _var_or_func_declaration: ($) =>
      choice($.function_definition, $.variable_declaration),

    quote_expression: ($) => seq('quote', $.quote_expr),

    quote_expr: ($) => seq('(', optional($.quote_parameters), ')'),

    quote_parameters: ($) =>
      repeat1(choice($.quote_token, $.quote_interpolate, $.macro_expression)),

    // TODO
    quote_token: ($) => choice('.', ',', $.identifier, $.dollar_identifier),

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
          'not',
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
    dollar_identifier: ($) => seq('$', $.identifier),

    // Comments
    comment: ($) => choice($.line_comment, $.delimited_comment),
    line_comment: ($) => token(prec(PREC.COMMENT, seq('//', /.*/))),
    delimited_comment: ($) =>
      token(prec(PREC.COMMENT, seq('/*', /[^*]*\*+([^/*][^*]*\*+)*/, '/'))),

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
    _line_str_text: ($) =>
      choice(
        /[^\\\r\n]/, // Match any character except for backslash, carriage return, or newline
        ESCAPE_SEQ,
      ),
    triple_quote_close: ($) => seq(optional(/"{1,}/), '"""'),
    multi_line_str_text: ($) => choice(/[^\\]/, ESCAPE_SEQ),
    // TODO: multi_line_raw_string_literal
    multi_line_raw_string_literal: ($) => $.multi_line_raw_string_content,
    multi_line_raw_string_content: ($) =>
      prec.left(
        choice(
          seq('#', $.multi_line_raw_string_content, '#'),
          seq('#"', optional(/[^#].*?[^#]|./), '"#'),
          seq("#'", optional(/[^#].*?[^#]|./), "'#"),
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
