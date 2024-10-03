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
module.exports = grammar({
  name: 'cangjie',
  extras: ($) => [/[\s\uFEFF\u2028\u2029\u2060\u200B]/, $.comment],
  word: ($) => $.identifier,
  conflicts: ($) => [
    [$.unnamed_parameter_list],
    [$.spawn_expression],
    [$.jump_expression],
    [$.class_body],
    [$.interface_body],
    [$.foreign_body],
    [$.upper_bounds],
    [$.class_init],
    [$.static_init],
    [$.ref_transfer_expression],
    [$.variable_declaration],
    [$.generic_constraints],
    [$.foreign_body, $.foreign_member_declaration],
    [$.atomic_expression, $.literal_constant],
    [$.arrow_parameters, $.tuple_type, $.left_aux_expression],
    [$.class_name, $.case_body, $.struct_name],
    [$.user_type, $.left_aux_expression, $.atomic_expression],
    [$.user_type, $.atomic_expression],
    [$.left_value_expression_without_wildcard, $.atomic_expression],
    [$.var_binding_pattern, $.enum_pattern],
    [$.user_type, $.var_binding_pattern, $.enum_pattern],
    [$.tuple_literal, $.unit_literal],
    [$.user_type, $.left_value_expression_without_wildcard],
    [$.tuple_literal, $.parenthesized_expression],
    [$.macro_expression],
    [$.multi_line_raw_string_content],
    [$.user_type],
    [$.wildcard_pattern, $.type_pattern],
    [$.user_type, $.var_binding_pattern, $.type_pattern, $.enum_pattern],
    [$.var_binding_pattern, $.type_pattern, $.enum_pattern],
    [$.enum_pattern],
    [$.function_definition],
    [$.class_non_static_member_modifier, $.struct_non_static_member_modifier],
    [$.do_while_expression],
    [$.unit_literal, $.tuple_pattern],
    [$.constant_pattern],
    [$.user_type, $.enum_pattern],
    [$.class_name, $.struct_name, $.var_binding_pattern, $.enum_pattern],
    [$.line_string_expression],
    [$.resource_specification],
    [$.multi_line_string_expression],
    [$.class_init, $.struct_init],
    [$.class_unnamed_init_param_list],
    [$.named_parameter_list],
    [$.struct_unnamed_init_param_list],
    [$.wildcard_pattern, $.exception_type_pattern],
    [$.operator_function_definition],
    [$.property_definition],
    [$.class_name, $.enum_pattern],
    [$.function_modifier_list],
    [$.struct_name, $.enum_pattern],
    [$.class_primary_init, $.this_super_expression],
    [
      $.left_value_expression_without_wildcard,
      $.postfix_expression,
      $.atomic_expression,
    ],
    [$.left_value_expression_without_wildcard],
    [$.char_lang_types, $.numeric_type_conv_expr],
    [
      $.arrow_parameters,
      $.tuple_type,
      $.parenthesized_type,
      $.left_aux_expression,
    ],
    [
      $.user_type,
      $.left_value_expression_without_wildcard,
      $.left_aux_expression,
    ],
    [
      $.user_type,
      $.left_value_expression_without_wildcard,
      $.left_aux_expression,
      $.atomic_expression,
    ],
    [$.left_aux_expression, $.atomic_expression],
    [$.left_aux_expression, $._expression_or_declaration],
    [$.left_aux_expression, $.tuple_literal],
    [$.left_aux_expression, $.expression_element],
    [$.left_aux_expression, $.jump_expression],
    [$.user_type, $.left_aux_expression],
    [$.left_aux_expression, $.prefix_unary_expression, $.postfix_expression],
    [$.left_aux_expression],
    [$.left_aux_expression, $.spread_element],
    [
      $.user_type,
      $.left_aux_expression,
      $.atomic_expression,
      $.lambda_parameter,
    ],
    [$.left_aux_expression, $.multiplicative_expression],
    [$.left_aux_expression, $.bitwise_conjunction_expression],
    [
      $.left_aux_expression,
      $.comparison_or_type_expression,
      $.postfix_expression,
    ],
    [$.left_aux_expression, $.bitwise_disjunction_expression],
    [$.left_aux_expression, $.coalescing_expression],
    [$.left_aux_expression, $.logic_disjunction_expression],
    [$.left_aux_expression, $.logic_conjunction_expression],
    [$.left_aux_expression, $.range_expression, $.postfix_expression],
    [$.left_aux_expression, $.bitwise_xor_expression],
    [
      $.left_aux_expression,
      $.equality_comparison_expression,
      $.postfix_expression,
    ],
    [$.left_aux_expression, $.shifting_expression],
    [$.left_aux_expression, $.additive_expression],
    [$.left_aux_expression, $.exponent_expression],
    [$.left_aux_expression, $.flow_expression],
    [$.assignment_expression, $.left_aux_expression, $.postfix_expression],
    [$.variable_declaration, $.left_aux_expression],
    [$.left_aux_expression, $.resource_specification],
    [$.tuple_type, $.parenthesized_type],
    [$.left_aux_expression, $.multiplicative_expression, $.postfix_expression],
    [
      $.left_aux_expression,
      $.bitwise_conjunction_expression,
      $.postfix_expression,
    ],
    [
      $.left_aux_expression,
      $.bitwise_disjunction_expression,
      $.postfix_expression,
    ],
    [$.left_aux_expression, $.bitwise_xor_expression, $.postfix_expression],
    [$.left_aux_expression, $.shifting_expression, $.postfix_expression],
    [$.left_aux_expression, $.additive_expression, $.postfix_expression],
    [$.left_aux_expression, $.exponent_expression, $.postfix_expression],
    [$.left_aux_expression, $.postfix_expression, $.jump_expression],
    [$.user_type, $._expression, $.left_aux_expression],
    [$._expression, $.literal_constant],
    [$.user_type, $._expression],
    [$.user_type, $._expression, $.left_aux_expression, $.lambda_parameter],
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
    [$.left_aux_expression, $.flow_expression, $.postfix_expression],
  ],
  rules: {
    source_file: ($) =>
      seq(
        optional($.preamble),
        repeat($.top_level_object),
        optional($.main_definition),
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

    // Top-level object definitions
    top_level_object: ($) =>
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
        $.identifier,
        optional($.type_parameters),
        optional(seq('upperbound', optional($.super_class_or_interfaces))),
        optional($.generic_constraints),
        $.class_body,
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
        choice($.identifier, 'thistype'),
        'upperbound',
        $.upper_bounds,
        repeat(
          seq(
            ',',
            choice($.identifier, 'thistype'),
            'upperbound',
            $.upper_bounds,
          ),
        ),
      ),
    upper_bounds: ($) => sepBy1('&', $._type),
    class_body: ($) =>
      seq(
        '{',
        repeat($._end),
        repeat($.class_member_declaration),
        optional($.class_primary_init),
        repeat($.class_member_declaration),
        repeat($._end),
        '}',
      ),

    class_member_declaration: ($) =>
      choice(
        $.class_init,
        $.static_init,
        $.variable_declaration,
        $.function_definition,
        $.operator_function_definition,
        $.macro_expression,
        $.property_definition,
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
        optional($.expression_or_declarations),
        '}',
        repeat($._end),
      ),
    class_primary_init: ($) =>
      seq(
        optional(choice($.class_non_static_member_modifier, 'const')),
        $.class_name,
        '(',
        $.class_primary_init_param_lists,
        ')',
        '{',
        optional(seq('super', $.call_suffix)),
        repeat($._end),
        optional($.expression_or_declarations),
        '}',
      ),

    class_name: ($) => $.identifier,
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
      choice('public', 'private', 'protected', 'internal'),

    // Interface definition
    interface_definition: ($) =>
      seq(
        optional($.interface_modifier_list),
        'interface',
        $.identifier,
        optional($.type_parameters),
        optional(seq('upperbound', $.super_interfaces)),
        optional($.generic_constraints),
        $.interface_body,
      ),
    interface_body: ($) =>
      seq(
        '{',
        repeat($._end),
        repeat($.interface_member_declaration),
        repeat($._end),
        '}',
      ),
    interface_member_declaration: ($) =>
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
        optional($.function_modifier_list),
        'func',
        $.identifier,
        optional($.type_parameters),
        $.function_parameters,
        optional(seq(':', $._type)),
        optional($.generic_constraints),
        optional($.block),
        repeat($._end),
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
        repeat($._end),
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
      seq(
        field('modifier', repeat($.variable_modifier)),
        choice('let', 'var', 'const'),
        field('name', $.patterns_maybe_irrefutable),
        choice(
          seq(
            optional(seq(':', field('type', $._type))),
            optional(seq('=', field('value', $._expression))),
          ),
          seq(':', field('type', $._type)),
        ),
        repeat($._end),
      ),
    variable_modifier: ($) =>
      choice('public', 'protected', 'internal', 'private'),

    // Enum Definition
    enum_definition: ($) =>
      seq(
        optional($.enum_modifier),
        'enum',
        $.identifier,
        optional(seq($.type_parameters)),
        optional(seq('upperbound', $.super_interfaces)),
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
        $.identifier,
        optional(seq($.type_parameters)),
        optional(seq('upperbound', $.super_interfaces)),
        optional($.generic_constraints),
        $.struct_body,
      ),
    struct_body: ($) =>
      seq(
        '{',
        repeat(
          choice($.struct_member_declaration, $.struct_primary_init, $._end),
        ),
        '}',
      ),
    struct_member_declaration: ($) =>
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
        optional($.expression_or_declarations),
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
      choice('public', 'protected', 'internal', 'private'),

    struct_non_static_member_modifier: ($) =>
      choice('public', 'protected', 'internal', 'private'),

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
        optional(seq('upperbound', $.super_interfaces)),
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
    extend_body: ($) => seq('{', repeat($.extend_member_declaration), '}'),
    extend_member_declaration: ($) =>
      choice(
        $.function_definition,
        $.operator_function_definition,
        $.macro_expression,
        $.property_definition,
      ),

    foreign_declaration: ($) =>
      seq('foreign', choice($.foreign_body, $.foreign_member_declaration)),

    foreign_body: ($) =>
      seq(
        '{',
        repeat($._end),
        repeat($.foreign_member_declaration),
        repeat($._end),
        '}',
      ),

    foreign_member_declaration: ($) =>
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
        repeat($._end),
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
        $.identifier,
        ':',
        $._type,
        optional($.property_body),
        repeat($._end),
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
      choice($.arrow_type, $.tuple_type, $.prefix_type, $.atomic_type),

    arrow_type: ($) => seq($.arrow_parameters, '->', $._type),

    arrow_parameters: ($) =>
      seq('(', optional(seq($._type, repeat(seq(',', $._type)))), ')'),

    tuple_type: ($) => seq('(', $._type, repeat(seq(',', $._type)), ')'),

    prefix_type: ($) => seq($.prefix_type_operator, $._type),

    prefix_type_operator: ($) => '?',

    atomic_type: ($) =>
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

    user_type: ($) =>
      seq(
        repeat(seq($.identifier, '.')),
        $.identifier,
        optional($.type_arguments),
      ),

    parenthesized_type: ($) => seq('(', $._type, ')'),

    type_arguments: ($) => seq('<', $._type, repeat(seq(',', $._type)), '>'),

    // Expression
    _expression: ($) =>
      choice(
        $.atomic_expression,
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
            $.left_value_expression_without_wildcard,
            field('operator', $.assignment_operator),
            $._expression,
          ),
          seq($.left_value_expression, field('operator', '='), $._expression),
          seq(
            $.tuple_left_value_expression,
            field('operator', '='),
            $._expression,
          ),
        ),
      ),

    tuple_left_value_expression: ($) =>
      seq(
        '(',
        seq($.left_value_expression, ','),
        repeat(seq($.left_value_expression, ',')),
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
          seq($.identifier, optional($.type_arguments)),
          $._type,
          $.this_super_expression,
          seq(
            $._expression,
            optional('?'),
            optional('.'),
            $.identifier,
            optional($.type_arguments),
          ),
          seq($._expression, optional('?'), $.call_suffix),
          seq($._expression, optional('?'), $.index_access),
        ),
      ),

    _assignable_suffix: ($) => choice($.field_access, $.index_access),

    field_access: ($) => seq(optional('.'), $.identifier),

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
            $._expression,
            field('operator', choice('<', '>', '<=', '>=')),
            $._expression,
          ),
          seq($._expression, field('operator', 'is'), $._type),
          seq($._expression, field('operator', 'as'), $._type),
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
          seq($._type, '.', $.identifier),
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
          seq(
            $.identifier,
            optional($.call_suffix),
            $.trailing_lambda_expression,
          ),
          seq($._expression, repeat1(seq('?', $.quest_seperated_items))),
        ),
      ),

    quest_seperated_items: ($) => prec.left(repeat1($.quest_seperated_item)),

    quest_seperated_item: ($) =>
      seq(
        $.item_after_quest,
        choice(
          $.call_suffix,
          seq(optional($.call_suffix), $.trailing_lambda_expression),
        ),
        $.index_access,
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
        '(',
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

    index_access: ($) => seq('[', choice($._expression, $.range_element), ']'),

    range_element: ($) =>
      prec.left(
        PREC.RANGE,
        choice(
          '..',
          seq(choice('..', '..='), $._expression),
          seq($._expression, '..'),
        ),
      ),

    atomic_expression: ($) =>
      choice(
        $.literal_constant,
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

    literal_constant: ($) =>
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
      seq(
        '"',
        repeat(choice($.line_string_expression, $._line_string_content)),
        '"',
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
        $.TRIPLE_QUOTE_OPEN,
        repeat(
          choice($.multi_line_string_expression, $.multi_line_string_content),
        ),
        $.TRIPLE_QUOTE_CLOSE,
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

    elements: ($) => repeat1(seq($.element, optional(seq(',', $.element)))),

    element: ($) => choice($.expression_element, $.spread_element),

    expression_element: ($) => $._expression,

    spread_element: ($) => seq('*', $._expression),

    tuple_literal: ($) => seq('(', repeat($._expression), ')'),

    unit_literal: ($) => seq('(', ')'),

    if_expression: ($) =>
      seq(
        'if',
        '(',
        optional(seq('let', $.deconstruct_pattern, '=>')),
        $._expression,
        ')',
        $.block,
        optional(seq('else', choice($.if_expression, $.block))),
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
      choice(
        seq('match', '(', $._expression, ')', '{', repeat($.match_case), '}'),
        seq(
          'match',
          '{',
          repeat(
            seq(
              'case',
              choice($._expression, '_'),
              '=>',
              $._expression_or_declaration,
              repeat(seq($._end, $._expression_or_declaration)),
            ),
          ),
          '}',
        ),
      ),

    match_case: ($) =>
      seq(
        'case',
        optional(seq($.pattern)),
        optional($.pattern_guard),
        '=>',
        $._expression_or_declaration,
        repeat(seq($._end, $._expression_or_declaration)),
      ),

    pattern_guard: ($) => seq('where', $._expression),

    pattern: ($) =>
      choice(
        $.constant_pattern,
        $.wildcard_pattern,
        $.var_binding_pattern,
        $.tuple_pattern,
        $.type_pattern,
        $.enum_pattern,
      ),

    constant_pattern: ($) =>
      seq($.literal_constant, optional(seq('|', optional($.literal_constant)))),

    wildcard_pattern: ($) => '_',

    var_binding_pattern: ($) => $.identifier,

    tuple_pattern: ($) =>
      seq('(', repeat(seq($.pattern, optional(seq(',', $.pattern)))), ')'),

    type_pattern: ($) =>
      seq(choice('_', $.identifier), optional(seq(':', $._type))),

    enum_pattern: ($) =>
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

    enum_pattern_parameters: ($) =>
      seq('(', repeat(seq($.pattern, optional(seq(',', $.pattern)))), ')'),

    loop_expression: ($) =>
      choice($.for_in_expression, $.while_expression, $.do_while_expression),

    for_in_expression: ($) =>
      seq(
        'for',
        optional(
          seq(
            '(',
            optional($.patterns_maybe_irrefutable),
            'in',
            $._expression,
            optional($.pattern_guard),
            ')',
          ),
        ),
        $.block,
      ),

    patterns_maybe_irrefutable: ($) =>
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
        optional(seq('let', $.deconstruct_pattern, 'backarrow')),
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
      choice(
        seq('throw', $._expression),
        seq('return', $._expression),
        prec(PREC.CLOSURE, 'return'),
        'continue',
        'break',
      ),
    numeric_type_conv_expr: ($) =>
      seq($.numeric_types, '(', $._expression, ')'),

    this_super_expression: ($) => choice('this', 'super'),

    lambda_expression: ($) =>
      seq(
        '{',
        optional($.lambda_parameters),
        optional(seq('=>', optional($.expression_or_declarations))),
        '}',
      ),

    trailing_lambda_expression: ($) =>
      seq(
        '{',
        optional(seq(optional($.lambda_parameters), '=>')),
        optional($.expression_or_declarations),
        '}',
      ),

    lambda_parameters: ($) =>
      repeat1(seq($.lambda_parameter, optional(seq(',', $.lambda_parameter)))),

    lambda_parameter: ($) =>
      seq(choice($.identifier, '_'), optional(seq(':', $._type))),

    spawn_expression: ($) =>
      seq(
        'spawn',
        optional(seq('(', $._expression, ')')),
        optional(seq($.trailing_lambda_expression)),
      ),

    synchronized_expression: ($) =>
      seq('synchronized', '(', $._expression, ')', $.block),

    parenthesized_expression: ($) => seq('(', $._expression, ')'),

    block: ($) => seq('{', optional($.expression_or_declarations), '}'),

    unsafe_expression: ($) => seq('unsafe', $.block),

    expression_or_declarations: ($) =>
      repeat1(seq($._expression_or_declaration, $._end)),

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
    prefix_unary_operator: ($) => token(choice('-', 'not')),

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
    line_comment: ($) => token(seq('//', /.*/)),
    delimited_comment: ($) =>
      token(seq('/*', /[^*]*\*+([^/*][^*]*\*+)*/, '*/')),

    // Delimiters
    QUOTE_OPEN: ($) => '"',
    QUOTE_CLOSE: ($) => '"',
    TRIPLE_QUOTE_OPEN: ($) => '"""',
    TRIPLE_QUOTE_CLOSE: ($) => '"""',

    // Literals
    integer_literal: (_) =>
      token(
        seq(
          choice(/[0-9][0-9_]*/, /0x[0-9a-fA-F_]+/, /0b[01_]+/, /0o[0-7_]+/),
          optional(choice(...INTEGER_SUFFIX)),
        ),
      ),
    _decimal_literal: ($) =>
      choice(
        seq(
          $._decimal_digit_with_out_zero,
          repeat(choice($._decimal_digit, '_')),
        ),
        $._decimal_digit,
      ), // /([1-9][0-9_]*|[0-9])/

    _decimal_digit_with_out_zero: ($) => token(/[1-9]/),
    _decimal_digit: ($) => token(/[0-9]/),

    _hexadecimal_literal: ($) =>
      seq('0', choice('x', 'X'), $._hexadecimal_digits),
    _hexadecimal_digits: ($) =>
      seq($._hexadecimal_digit, repeat(choice($._hexadecimal_digit, '_'))), // /[0-9a-fA-F][0-9a-fA-F_]*/
    _hexadecimal_digit: ($) => token(/[0-9a-fA-F]/),

    float_literal: ($) =>
      token(
        choice(
          seq(
            choice(
              /([1-9][0-9_]*|[0-9])[eE]-?[0-9][0-9_]*/,
              /\.[0-9][0-9_]*([eE]-?[0-9][0-9_]*)?/,
              /([1-9][0-9_]*|[0-9])\.[0-9][0-9_]*([eE]-?[0-9][0-9_]*)?/,
            ),
            optional(choice(...FLOAT_SUFFIX)),
          ),
          seq(
            /0[xX]/,
            /(([0-9a-fA-F][0-9a-fA-F_]*)|(\.[0-9a-fA-F][0-9a-fA-F_]*)|([0-9a-fA-F][0-9a-fA-F_]*\.[0-9a-fA-F][0-9a-fA-F_]*))/,
            /[pP]-?[0-9][0-9_]*/,
          ),
        ),
      ),
    /*
    float_literal_old: ($) =>
      choice(
        seq(
          choice(
            seq($._decimal_literal, $._decimal_exponent),
            seq($._decimal_fraction, optional($._decimal_exponent)),
            seq(
              $._decimal_literal,
              $._decimal_fraction,
              optional($._decimal_exponent),
            ),
          ),
          optional($._float_literal_suffix),
        ),
        seq(
          $._hexadecimalprefix,
          choice(
            $._hexadecimal_digits,
            $._hexadecimal_fraction,
            seq($._hexadecimal_digits, $._hexadecimal_fraction),
          ),
          $._hexadecimal_exponent,
        ),
      ),
    */
    _decimal_fraction: ($) => seq('.', $._decimal_fragment), // /\.[0-9][0-9_]*/
    _decimal_fragment: ($) =>
      seq($._decimal_digit, repeat(choice($._decimal_digit, '_'))), // /[0-9][0-9_]*/
    _decimal_exponent: ($) =>
      seq($._float_e, optional($._sign), $._decimal_fragment), // /[eE]-?[0-9][0-9_]*/

    _hexadecimal_fraction: ($) => seq('.', $._hexadecimal_digits), // /\.[0-9a-fA-F][0-9a-fA-F_]*/
    _hexadecimal_exponent: ($) =>
      seq($._float_p, optional($._sign), $._decimal_fragment), // /[pP]-?[0-9][0-9_]*/

    _float_e: ($) => choice('e', 'E'),
    _float_p: ($) => choice('p', 'P'),
    _sign: ($) => choice('-', ''),

    _hexadecimalprefix: ($) => seq('0', choice('x', 'X')), // /0[xX]/

    rune_literal: ($) => seq("'", choice($._single_char, $._escape_seq), "'"),
    _single_char: ($) => /[^'\\\r\n]/,
    _escape_seq: ($) => choice($.uni_character_literal, $.escaped_identifier),

    uni_character_literal: ($) =>
      choice(
        seq('\\', 'u', '{', $._hexadecimal_digit, '}'),
        seq(
          '\\',
          'u',
          '{',
          seq($._hexadecimal_digit, $._hexadecimal_digit),
          '}',
        ),
        seq(
          '\\',
          'u',
          '{',
          seq($._hexadecimal_digit, $._hexadecimal_digit, $._hexadecimal_digit),
          '}',
        ),
        seq(
          '\\',
          'u',
          '{',
          seq(
            $._hexadecimal_digit,
            $._hexadecimal_digit,
            $._hexadecimal_digit,
            $._hexadecimal_digit,
          ),
          '}',
        ),
        seq(
          '\\',
          'u',
          '{',
          seq(
            $._hexadecimal_digit,
            $._hexadecimal_digit,
            $._hexadecimal_digit,
            $._hexadecimal_digit,
            $._hexadecimal_digit,
          ),
          '}',
        ),
        seq(
          '\\',
          'u',
          '{',
          seq(
            $._hexadecimal_digit,
            $._hexadecimal_digit,
            $._hexadecimal_digit,
            $._hexadecimal_digit,
            $._hexadecimal_digit,
            $._hexadecimal_digit,
          ),
          '}',
        ),
        seq(
          '\\',
          'u',
          '{',
          seq(
            $._hexadecimal_digit,
            $._hexadecimal_digit,
            $._hexadecimal_digit,
            $._hexadecimal_digit,
            $._hexadecimal_digit,
            $._hexadecimal_digit,
            $._hexadecimal_digit,
          ),
          '}',
        ),
        seq(
          '\\',
          'u',
          '{',
          seq(
            $._hexadecimal_digit,
            $._hexadecimal_digit,
            $._hexadecimal_digit,
            $._hexadecimal_digit,
            $._hexadecimal_digit,
            $._hexadecimal_digit,
            $._hexadecimal_digit,
            $._hexadecimal_digit,
          ),
          '}',
        ),
      ),

    escaped_identifier: ($) =>
      seq('\\', choice('t', 'b', 'r', 'n', "'", '"', '\\', 'f', 'v', '0', '$')),

    byte_literal: ($) =>
      seq('b', "'", choice($.single_char_byte, $.byte_escape_seq), "'"),
    byte_escape_seq: ($) => $.hex_char_byte,
    hex_char_byte: ($) =>
      choice($.byte_escaped_identifier, $.hex_char_byte_alt),
    single_char_byte: ($) =>
      /[\u0000-\u0009\u000B\u000C\u000E-\u0021\u0023-\u0026\u0028-\u005B\u005D-\u007F]/,
    byte_escaped_identifier: ($) =>
      seq('\\', choice('t', 'b', 'r', 'n', "'", '"', '\\', 'f', 'v', '0')),
    hex_char_byte_alt: ($) => seq('\\', 'u', '{', $._hexadecimal_digit, '}'),
    byte_string_array_literal: ($) =>
      seq('b', '"', repeat(choice($.single_char_byte, $.byte_escape_seq)), '"'),
    j_string_literal: ($) =>
      seq('j', '"', repeat(choice($.single_char_byte, $._escape_seq)), '"'),
    _line_str_text: ($) =>
      choice(
        /[^\\\r\n]/, // Match any character except for backslash, carriage return, or newline
        $._escape_seq,
      ),
    triple_quote_close: ($) => seq(optional($.multi_line_string_quote), '"""'),

    multi_line_string_quote: ($) => repeat1('"'),
    multi_line_str_text: ($) => choice(/[^\\]/, $._escape_seq),
    multi_line_raw_string_literal: ($) => $.multi_line_raw_string_content,
    multi_line_raw_string_content: ($) =>
      choice(
        seq('#', repeat($.multi_line_raw_string_content), '#'),
        seq('#', '"', /.*/, '"', '#'),
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
