/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
    name: 'cangjie',
    extras: $ => [
        /[\s\uFEFF\u2028\u2029\u2060\u200B]/,
        $.comment,
    ],
    word: $ => $.identifier,
    rules: {
        source_file: ($) =>
            seq(
                optional($.preamble),
                repeat($.top_level_object),
                optional($.main_definition),
                optional($.NL),
            ),

        end: ($) => token(choice($.NL, ';')),

        // Preamble, package, and import definitions
        preamble: ($) => seq(optional($.package_header), repeat($.import_list)),
        package_header: ($) =>
            seq('package', optional($.NL), $.package_name_identifier, repeat1($.end)),
        package_name_identifier: ($) =>
            seq(
                $.identifier,
                repeat(seq(optional($.NL), '.', optional($.NL), $.identifier)),
            ),
        import_list: ($) =>
            seq(
                optional(seq('from', optional($.NL), $.identifier)),
                optional($.NL),
                'import',
                optional($.NL),
                $.import_all_or_specified,
                repeat(
                    seq(optional($.NL), ',', optional($.NL), $.import_all_or_specified),
                ),
                repeat1($.end),
            ),

        import_all_or_specified: ($) => choice($.import_all, $.import_specified),
        import_specified: ($) =>
            seq(
                repeat1(seq($.identifier, optional($.NL), '.', optional($.NL))),
                $.identifier,
            ),
        import_all: ($) =>
            seq(repeat1(seq($.identifier, optional($.NL), '.', optional($.NL))), '*'),
        import_alias: ($) => seq('as', optional($.NL), $.identifier),

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
                optional($.NL),
                $.identifier,
                optional($.type_parameters),
                optional(
                    seq(
                        optional($.NL),
                        'upperbound',
                        optional($.NL),
                        $.super_class_or_interfaces,
                    ),
                ),
                optional($.generic_constraints),
                optional($.NL),
                $.class_body,
            ),

        super_class_or_interfaces: ($) =>
            choice(
                seq(
                    $.super_class,
                    optional(
                        seq(optional($.NL), '&', optional($.NL), $.super_interfaces),
                    ),
                ),
                $.super_interfaces,
            ),
        class_modifier_list: ($) => repeat1($.class_modifier),
        class_modifier: ($) =>
            choice('public', 'protected', 'internal', 'private', 'abstract', 'open'),
        type_parameters: ($) =>
            seq(
                '<',
                optional($.NL),
                $.identifier,
                repeat(seq(optional($.NL), ',', optional($.NL), $.identifier)),
                optional($.NL),
                '>',
            ),
        super_class: ($) => $.class_type,
        class_type: ($) =>
            seq(
                repeat(seq($.identifier, optional($.NL), '.', optional($.NL))),
                $.identifier,
                optional($.type_parameters),
            ),
        super_interfaces: ($) =>
            seq(
                $.interface_type,
                repeat(seq(optional($.NL), ',', optional($.NL), $.interface_type)),
            ),
        interface_type: ($) => $.class_type,
        generic_constraints: ($) =>
            seq(
                'where',
                optional($.NL),
                choice($.identifier, 'thistype'),
                optional($.NL),
                'upperbound',
                optional($.NL),
                $.upper_bounds,
                repeat(
                    seq(
                        optional($.NL),
                        ',',
                        optional($.NL),
                        choice($.identifier, 'thistype'),
                        optional($.NL),
                        'upperbound',
                        optional($.NL),
                        $.upper_bounds,
                    ),
                ),
            ),
        upper_bounds: ($) =>
            seq($.type, repeat(seq(optional($.NL), '&', optional($.NL), $.type))),
        class_body: ($) =>
            seq(
                '{',
                repeat($.end),
                repeat($.class_member_declaration),
                optional($.NL),
                optional($.class_primary_init),
                optional($.NL),
                repeat($.class_member_declaration),
                repeat($.end),
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
                optional(
                    choice(
                        $.class_non_static_member_modifier,
                        seq('const', optional($.NL)),
                    ),
                ),
                'init',
                optional($.NL),
                $.function_parameters,
                optional($.NL),
                $.block,
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
            ),
        class_primary_init: ($) =>
            seq(
                optional(
                    choice(
                        $.class_non_static_member_modifier,
                        seq('const', optional($.NL)),
                    ),
                ),
                $.class_name,
                optional($.NL),
                '(',
                optional($.NL),
                $.class_primary_init_param_lists,
                optional($.NL),
                ')',
                optional($.NL),
                '{',
                optional($.NL),
                optional(seq('super', $.call_suffix)),
                repeat($.end),
                optional($.expression_or_declarations),
                optional($.NL),
                '}',
            ),

        class_name: ($) => $.identifier,
        class_primary_init_param_lists: ($) =>
            choice(
                seq(
                    $.unnamed_parameter_list,
                    optional(
                        seq(optional($.NL), ',', optional($.NL), $.named_parameter_list),
                    ),
                    optional(
                        seq(
                            optional($.NL),
                            ',',
                            optional($.NL),
                            $.class_named_init_param_list,
                        ),
                    ),
                ),
                seq(
                    $.unnamed_parameter_list,
                    optional(
                        seq(
                            optional($.NL),
                            ',',
                            optional($.NL),
                            $.class_unnamed_init_param_list,
                        ),
                    ),
                    optional(
                        seq(
                            optional($.NL),
                            ',',
                            optional($.NL),
                            $.class_named_init_param_list,
                        ),
                    ),
                ),
                seq(
                    $.class_unnamed_init_param_list,
                    optional(
                        seq(
                            optional($.NL),
                            ',',
                            optional($.NL),
                            $.class_named_init_param_list,
                        ),
                    ),
                ),
                seq(
                    $.named_parameter_list,
                    optional(
                        seq(
                            optional($.NL),
                            ',',
                            optional($.NL),
                            $.class_named_init_param_list,
                        ),
                    ),
                ),
                $.class_named_init_param_list,
            ),
        class_unnamed_init_param_list: ($) =>
            seq(
                $.class_unnamed_init_param,
                repeat(
                    seq(optional($.NL), ',', optional($.NL), $.class_unnamed_init_param),
                ),
            ),
        class_named_init_param_list: ($) =>
            seq(
                $.class_named_init_param,
                repeat(
                    seq(optional($.NL), ',', optional($.NL), $.class_named_init_param),
                ),
            ),
        class_unnamed_init_param: ($) =>
            seq(
                optional(seq($.class_non_static_member_modifier, optional($.NL))),
                choice('let', 'var'),
                optional($.NL),
                $.identifier,
                optional($.NL),
                ':',
                optional($.NL),
                $.type,
            ),
        class_named_init_param: ($) =>
            seq(
                optional(seq($.class_non_static_member_modifier, optional($.NL))),
                choice('let', 'var'),
                optional($.NL),
                $.identifier,
                optional($.NL),
                '!',
                optional($.NL),
                ':',
                optional($.NL),
                $.type,
                optional(seq(optional($.NL), '=', optional($.NL), $.expression)),
            ),

        class_non_static_member_modifier: ($) =>
            choice('public', 'private', 'protected', 'internal'),

        // Interface definition
        interface_definition: ($) =>
            seq(
                optional($.interface_modifier_list),
                'interface',
                optional($.NL),
                $.identifier,
                optional($.type_parameters),
                optional(
                    seq(optional($.NL), 'upperbound', optional($.NL), $.super_interfaces),
                ),
                optional($.generic_constraints),
                optional($.NL),
                $.interface_body,
            ),
        interface_body: ($) =>
            seq(
                '{',
                repeat($.end),
                repeat($.interface_member_declaration),
                repeat($.end),
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
            choice('public', 'protected', 'internal', 'private', 'open'),

        // Function definition
        function_definition: ($) =>
            seq(
                optional($.function_modifier_list),
                'func',
                optional($.NL),
                $.identifier,
                optional($.type_parameters),
                optional($.NL),
                $.function_parameters,
                optional(seq(optional($.NL), ':', optional($.NL), $.type)),
                optional($.generic_constraints),
                optional($.block),
            ),
        function_modifier_list: ($) => repeat1($.function_modifier),
        function_modifier: ($) =>
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

        operator_function_definition: ($) =>
            seq(
                optional($.function_modifier_list),
                optional($.NL),
                'operator',
                optional($.NL),
                'func',
                optional($.NL),
                $.overloaded_operators,
                optional($.type_parameters),
                optional($.NL),
                $.function_parameters,
                optional($.type),
                optional($.generic_constraints),
                optional($.block),
            ),

        function_parameters: ($) =>
            choice(
                seq(
                    '(',
                    optional($.unnamed_parameter_list),
                    optional(seq($.NL, ',', $.NL, $.named_parameter_list)),
                    optional($.NL),
                    ')',
                    optional($.NL),
                ),
                seq(
                    '(',
                    optional($.NL),
                    optional($.named_parameter_list),
                    ')',
                    optional($.NL),
                ),
            ),

        nondefault_parameter_list: ($) =>
            choice(
                seq(
                    $.unnamed_parameter,
                    optional(seq($.NL, ',', $.NL, $.unnamed_parameter)),
                    optional(seq($.NL, ',', $.NL, $.named_parameter)),
                ),
                seq(
                    $.named_parameter,
                    optional(seq($.NL, ',', $.NL, $.named_parameter)),
                ),
            ),

        unnamed_parameter_list: ($) =>
            seq(
                $.unnamed_parameter,
                optional(seq($.NL, ',', $.NL, $.unnamed_parameter)),
            ),

        unnamed_parameter: ($) =>
            seq(
                choice($.identifier, '_'),
                optional($.NL),
                ':',
                optional($.NL),
                $.type,
            ),

        named_parameter_list: ($) =>
            seq(
                choice($.named_parameter, $.default_parameter),
                optional(
                    seq($.NL, ',', $.NL, choice($.named_parameter, $.default_parameter)),
                ),
            ),

        named_parameter: ($) =>
            seq(
                $.identifier,
                optional($.NL),
                '!',
                optional($.NL),
                ':',
                optional($.NL),
                $.type,
            ),

        default_parameter: ($) =>
            seq(
                $.identifier,
                optional($.NL),
                '!',
                optional($.NL),
                ':',
                optional($.NL),
                $.type,
                optional($.NL),
                '=',
                optional($.NL),
                $.expression,
            ),

        // Variable Declaration
        variable_declaration: ($) =>
            seq(
                repeat($.variable_modifier),
                optional($.NL),
                choice('LET', 'VAR', 'CONST'),
                optional($.NL),
                $.patterns_maybe_irrefutable,
                choice(
                    seq(
                        optional($.NL),
                        optional(seq(':', optional($.NL), $.type)),
                        optional(seq(optional($.NL), '=', optional($.NL), $.expression)),
                    ),
                    seq(optional($.NL), ':', optional($.NL), $.type),
                ),
            ),
        variable_modifier: ($) =>
            choice('public', 'protected', 'internal', 'private'),

        // Enum Definition
        enum_definition: ($) =>
            seq(
                optional(seq($.enum_modifier, optional($.NL))),
                'enum',
                optional($.NL),
                $.identifier,
                optional(seq(optional($.NL), $.type_parameters)),
                optional(
                    seq(optional($.NL), 'UPPERBOUND', optional($.NL), $.super_interfaces),
                ),
                optional($.generic_constraints),
                optional($.NL),
                '{',
                optional($.enum_body),
                '}',
            ),
        enum_modifier: ($) => choice('public', 'protected', 'internal', 'private'),
        enum_body: ($) =>
            seq(
                optional(seq('|', optional($.NL))),
                $.case_body,
                repeat(seq(optional($.NL), '|', optional($.NL), $.case_body)),
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
                optional(
                    seq(
                        optional($.NL),
                        '(',
                        optional($.NL),
                        $.type,
                        repeat(seq(optional($.NL), ',', optional($.NL), $.type)),
                        optional($.NL),
                        ')',
                    ),
                ),
            ),

        // Struct Definition
        struct_definition: ($) =>
            seq(
                optional(seq($.struct_modifier, optional($.NL))),
                'struct',
                optional($.NL),
                $.identifier,
                optional(seq(optional($.NL), $.type_parameters)),
                optional(
                    seq(optional($.NL), 'upperbound', optional($.NL), $.super_interfaces),
                ),
                optional($.generic_constraints),
                optional($.NL),
                $.struct_body,
            ),
        struct_body: ($) =>
            seq(
                '{',
                repeat(
                    choice($.struct_member_declaration, $.struct_primary_init, $.end),
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
                optional(
                    seq(
                        choice($.struct_non_static_member_modifier, 'const'),
                        optional($.NL),
                    ),
                ),
                'init',
                optional($.NL),
                $.function_parameters,
                $.block,
            ),
        struct_primary_init: ($) =>
            seq(
                optional(
                    seq(
                        choice($.struct_non_static_member_modifier, 'const'),
                        optional($.NL),
                    ),
                ),
                $.struct_name,
                optional($.NL),
                '(',
                optional($.NL),
                optional($.struct_primary_init_param_lists),
                optional($.NL),
                ')',
                optional($.NL),
                '{',
                optional($.expression_or_declarations),
                optional($.NL),
                '}',
            ),
        struct_name: ($) => $.identifier,

        struct_primary_init_param_lists: ($) =>
            choice(
                seq(
                    $.unnamed_parameter_list,
                    optional(seq($.NL, ',', $.NL, $.named_parameter_list)),
                    optional(seq($.NL, ',', $.NL, $.struct_named_init_param_list)),
                ),
                seq(
                    $.unnamed_parameter_list,
                    optional(seq($.NL, ',', $.NL, $.struct_unnamed_init_param_list)),
                    optional(seq($.NL, ',', $.NL, $.struct_named_init_param_list)),
                ),
                seq(
                    $.struct_unnamed_init_param_list,
                    optional(seq($.NL, ',', $.NL, $.struct_named_init_param_list)),
                ),
                seq(
                    $.named_parameter_list,
                    optional(seq($.NL, ',', $.NL, $.struct_named_init_param_list)),
                ),
                $.struct_named_init_param_list,
            ),

        struct_unnamed_init_param_list: ($) =>
            seq(
                $.struct_unnamed_init_param,
                repeat(seq($.NL, ',', $.NL, $.struct_unnamed_init_param)),
            ),

        struct_named_init_param_list: ($) =>
            seq(
                $.struct_named_init_param,
                repeat(seq($.NL, ',', $.NL, $.struct_named_init_param)),
            ),

        struct_unnamed_init_param: ($) =>
            seq(
                optional($.struct_non_static_member_modifier),
                optional($.NL),
                choice('let', 'var'),
                optional($.NL),
                $.identifier,
                optional($.NL),
                ':',
                optional($.NL),
                $.type,
            ),

        struct_named_init_param: ($) =>
            seq(
                optional($.struct_non_static_member_modifier),
                optional($.NL),
                choice('let', 'var'),
                optional($.NL),
                $.identifier,
                optional($.NL),
                'not',
                optional($.NL),
                ':',
                optional($.NL),
                $.type,
                optional(seq($.NL, '=', optional($.NL), $.expression)),
            ),

        struct_modifier: ($) =>
            choice('public', 'protected', 'internal', 'private'),

        struct_non_static_member_modifier: ($) =>
            choice('public', 'protected', 'internal', 'private'),

        // Type Alias
        type_alias: ($) =>
            seq(
                optional(seq($.type_modifier, optional($.NL))),
                'TYPE_ALIAS',
                optional($.NL),
                $.identifier,
                optional($.NL),
                optional($.type_parameters),
                optional($.NL),
                '=',
                optional($.NL),
                $.type,
                optional($.end),
            ),
        type_modifier: ($) => choice('public', 'protected', 'internal', 'private'),

        // Extend Definition
        extend_definition: ($) =>
            seq(
                'extend',
                optional($.NL),
                $.extend_type,
                optional(
                    seq(optional($.NL), 'upperbound', optional($.NL), $.super_interfaces),
                ),
                optional($.generic_constraints),
                optional($.NL),
                $.extend_body,
            ),
        extend_type: ($) =>
            choice(
                optional($.type_parameters),
                seq(
                    repeat(seq($.identifier, optional($.NL), '.')),
                    $.identifier,
                    optional(seq(optional($.NL), $.type_arguments)),
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
        extend_body: ($) => seq('{', repeat($.extend_member_declaration), '}'),
        extend_member_declaration: ($) =>
            choice(
                $.function_definition,
                $.operator_function_definition,
                $.macro_expression,
                $.property_definition,
            ),

        foreign_declaration: ($) =>
            seq(
                'foreign',
                $.NL,
                choice($.foreign_body, $.foreign_member_declaration),
            ),

        foreign_body: ($) =>
            seq(
                '{',
                repeat($.end),
                repeat($.foreign_member_declaration),
                repeat($.end),
                '}',
            ),

        foreign_member_declaration: ($) =>
            choice(
                $.class_definition,
                $.interface_definition,
                $.function_definition,
                $.macro_expression,
                $.variable_declaration,
                repeat($.end), // Allowing end after each member declaration
            ),

        annotation_list: ($) => repeat1($.annotation),

        annotation: ($) =>
            seq(
                '@',
                repeat(seq($.identifier, $.NL, '.')),
                $.identifier,
                optional(seq('[', $.annotation_argument_list, ']')),
            ),

        annotation_argument_list: ($) =>
            seq(
                $.annotation_argument,
                repeat(seq($.NL, ',', $.NL, $.annotation_argument)),
            ),

        annotation_argument: ($) =>
            choice(seq($.identifier, $.NL, ':', $.expression), $.expression),

        macro_definition: ($) =>
            seq(
                'public',
                $.NL,
                'macro',
                $.NL,
                $.identifier,
                $.NL,
                choice($.macro_without_attr_param, $.macro_with_attr_param),
                $.NL,
                optional(seq(':', $.NL, $.identifier)),
                optional(seq('=', $.NL, $.expression)),
            ),

        macro_without_attr_param: ($) =>
            seq('(', $.NL, $.macro_input_decl, $.NL, ')'),

        macro_with_attr_param: ($) =>
            seq(
                '(',
                $.NL,
                $.macro_attr_decl,
                $.NL,
                ',',
                $.macro_input_decl,
                $.NL,
                ')',
            ),

        macro_input_decl: ($) => seq($.identifier, $.NL, ':', $.identifier),

        macro_attr_decl: ($) => seq($.identifier, $.NL, ':', $.identifier),

        property_definition: ($) =>
            seq(
                repeat($.property_modifier),
                $.NL,
                'prop',
                $.NL,
                $.identifier,
                $.NL,
                ':',
                $.NL,
                $.type,
                $.NL,
                optional($.property_body),
            ),

        property_body: ($) =>
            seq('{', repeat($.end), repeat1($.property_member_declaration), '}'),

        property_member_declaration: ($) =>
            choice(
                seq('get', $.NL, '(', ')', $.NL, $.block),
                seq('set', $.NL, '(', $.identifier, ')', $.NL, $.block),
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
                'main', // Matches the keyword 'main'
                optional($.NL), // Matches newlines if present
                $.function_parameters, // Matches function parameters
                optional(seq(optional($.NL), ':', optional($.NL), $.type)), // Optionally matches a colon followed by the type
                optional($.NL), // Matches newlines if present
                $.block, // Matches the block of the function
            ),

        type: ($) =>
            choice($.arrow_type, $.tuple_type, $.prefix_type, $.atomic_type),

        arrow_type: ($) =>
            seq($.arrow_parameters, optional($.NL), '->', optional($.NL), $.type),

        arrow_parameters: ($) =>
            seq(
                '(',
                optional($.NL),
                optional(
                    seq($.type, repeat(seq(optional($.NL), ',', optional($.NL), $.type))),
                ),
                optional($.NL),
                ')',
            ),

        tuple_type: ($) =>
            seq(
                '(',
                optional($.NL),
                $.type,
                repeat(seq(optional($.NL), ',', optional($.NL), $.type)),
                optional($.NL),
                ')',
            ),

        prefix_type: ($) => seq($.prefix_type_operator, $.type),

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
                repeat(seq($.identifier, optional($.NL), '.')),
                $.identifier,
                optional($.type_arguments),
            ),

        parenthesized_type: ($) =>
            seq('(', optional($.NL), $.type, optional($.NL), ')'),

        type_arguments: ($) =>
            seq(
                '<',
                optional($.NL),
                $.type,
                repeat(seq(optional($.NL), ',', optional($.NL), $.type)),
                optional($.NL),
                '>',
            ),

        // Expression
        expression: ($) =>
            choice(
                $.assignment_expression,
                $.flow_expression,
                $.tuple_literal,
                $.if_expression,
                $.match_expression,
                $.loop_expression,
                $.try_expression,
                $.lambda_expression,
                $.literal_constant,
                $.parenthesized_expression,
                $.block,
            ),

        assignment_expression: ($) =>
            choice(
                seq(
                    $.left_value_expression_without_wildcard,
                    optional($.NL),
                    $.assignment_operator,
                    optional($.NL),
                    $.flow_expression,
                ),
                seq(
                    $.left_value_expression,
                    optional($.NL),
                    '=',
                    optional($.NL),
                    $.flow_expression,
                ),
                seq(
                    $.tuple_left_value_expression,
                    optional($.NL),
                    '=',
                    optional($.NL),
                    $.flow_expression,
                ),
                $.flow_expression,
            ),

        tuple_left_value_expression: ($) =>
            seq(
                '(',
                optional($.NL),
                seq($.left_value_expression, optional($.NL), ',', optional($.NL)),
                repeat(
                    seq($.left_value_expression, optional($.NL), ',', optional($.NL)),
                ),
                optional(','),
                optional($.NL),
                ')',
            ),

        left_value_expression: ($) =>
            choice($.left_value_expression_without_wildcard, '*'),

        left_value_expression_without_wildcard: ($) =>
            choice(
                $.identifier,
                seq(
                    $.left_aux_expression,
                    optional('?'),
                    optional($.NL),
                    $.assignable_suffix,
                ),
            ),

        left_aux_expression: ($) =>
            choice(
                $.identifier,
                seq($.type, optional($.type_arguments)),
                $.this_super_expression,
                seq(
                    $.left_aux_expression,
                    optional('?'),
                    optional($.NL),
                    optional('.'),
                    optional($.NL),
                    $.identifier,
                    optional($.type_arguments),
                ),
                seq($.left_aux_expression, optional('?'), $.call_suffix),
                seq($.left_aux_expression, optional('?'), $.index_access),
            ),

        assignable_suffix: ($) => choice($.field_access, $.index_access),

        field_access: ($) =>
            seq(optional($.NL), optional('.'), optional($.NL), $.identifier),

        flow_expression: ($) =>
            seq(
                $.coalescing_expression,
                repeat(
                    seq(
                        optional($.NL),
                        $.flow_operator,
                        optional($.NL),
                        $.coalescing_expression,
                    ),
                ),
            ),

        coalescing_expression: ($) =>
            seq(
                $.logic_disjunction_expression,
                repeat(
                    seq(
                        optional($.NL),
                        '??',
                        optional($.NL),
                        $.logic_disjunction_expression,
                    ),
                ),
            ),

        logic_disjunction_expression: ($) =>
            seq(
                $.logic_conjunction_expression,
                repeat(
                    seq(
                        optional($.NL),
                        '||',
                        optional($.NL),
                        $.logic_conjunction_expression,
                    ),
                ),
            ),

        logic_conjunction_expression: ($) =>
            seq(
                $.range_expression,
                repeat(seq(optional($.NL), '&&', optional($.NL), $.range_expression)),
            ),

        range_expression: ($) =>
            choice(
                seq(
                    $.bitwise_disjunction_expression,
                    optional($.NL),
                    choice('..', '..='),
                    optional($.NL),
                    $.bitwise_disjunction_expression,
                ),
                $.bitwise_disjunction_expression,
            ),

        bitwise_disjunction_expression: ($) =>
            seq(
                $.bitwise_xor_expression,
                repeat(
                    seq(optional($.NL), '|', optional($.NL), $.bitwise_xor_expression),
                ),
            ),

        bitwise_xor_expression: ($) =>
            seq(
                $.bitwise_conjunction_expression,
                repeat(
                    seq(
                        optional($.NL),
                        '^',
                        optional($.NL),
                        $.bitwise_conjunction_expression,
                    ),
                ),
            ),

        bitwise_conjunction_expression: ($) =>
            seq(
                $.equality_comparison_expression,
                repeat(
                    seq(
                        optional($.NL),
                        '&',
                        optional($.NL),
                        $.equality_comparison_expression,
                    ),
                ),
            ),

        equality_comparison_expression: ($) =>
            choice(
                seq(
                    $.comparison_or_type_expression,
                    optional($.NL),
                    choice('==', '!='),
                    optional($.NL),
                    $.comparison_or_type_expression,
                ),
                $.comparison_or_type_expression,
            ),

        comparison_or_type_expression: ($) =>
            choice(
                seq(
                    $.shifting_expression,
                    optional($.NL),
                    choice('<', '>', '<=', '>='),
                    optional($.NL),
                    $.shifting_expression,
                ),
                seq(
                    $.shifting_expression,
                    optional($.NL),
                    'is',
                    optional($.NL),
                    $.type,
                ),
                seq(
                    $.shifting_expression,
                    optional($.NL),
                    'as',
                    optional($.NL),
                    $.type,
                ),
                $.shifting_expression,
            ),

        shifting_expression: ($) =>
            seq(
                $.additive_expression,
                repeat(
                    seq(
                        optional($.NL),
                        choice('<<', '>>'),
                        optional($.NL),
                        $.additive_expression,
                    ),
                ),
            ),

        additive_expression: ($) =>
            seq(
                $.multiplicative_expression,
                repeat(
                    seq(
                        optional($.NL),
                        choice('+', '-'),
                        optional($.NL),
                        $.multiplicative_expression,
                    ),
                ),
            ),

        multiplicative_expression: ($) =>
            seq(
                $.exponent_expression,
                repeat(
                    seq(
                        optional($.NL),
                        choice('*', '/', '%'),
                        optional($.NL),
                        $.exponent_expression,
                    ),
                ),
            ),

        exponent_expression: ($) =>
            seq(
                $.prefix_unary_expression,
                repeat(
                    seq(optional($.NL), '**', optional($.NL), $.prefix_unary_expression),
                ),
            ),

        prefix_unary_expression: ($) =>
            seq(repeat($.prefix_unary_operator), $.inc_and_dec_expression),

        inc_and_dec_expression: ($) =>
            seq($.postfix_expression, optional(choice('++', '--'))),

        postfix_expression: ($) =>
            choice(
                $.atomic_expression,
                seq($.type, optional($.NL), '.', optional($.NL), $.identifier),
                seq(
                    $.postfix_expression,
                    optional($.NL),
                    '.',
                    optional($.NL),
                    $.identifier,
                    optional($.type_arguments),
                ),
                seq($.postfix_expression, $.call_suffix),
                seq($.postfix_expression, $.index_access),
                seq(
                    $.postfix_expression,
                    optional($.NL),
                    '.',
                    optional($.NL),
                    $.identifier,
                    optional($.call_suffix),
                    $.trailing_lambda_expression,
                ),
                seq(
                    $.identifier,
                    optional($.call_suffix),
                    $.trailing_lambda_expression,
                ),
                seq($.postfix_expression, repeat(seq('?', $.quest_seperated_items))),
            ),

        quest_seperated_items: ($) => repeat1($.quest_seperated_item),

        quest_seperated_item: ($) =>
            choice(
                seq('.', $.identifier, optional($.type_arguments)),
                $.call_suffix,
                $.index_access,
                $.trailing_lambda_expression,
            ),

        call_suffix: ($) =>
            seq(
                '(',
                optional($.NL),
                optional(
                    seq(
                        $.value_argument,
                        repeat(seq(optional($.NL), ',', optional($.NL), $.value_argument)),
                    ),
                ),
                optional($.NL),
                ')',
            ),

        value_argument: ($) =>
            choice(
                seq($.identifier, optional($.NL), ':', optional($.NL), $.expression),
                $.expression,
                $.ref_transfer_expression,
            ),

        ref_transfer_expression: ($) =>
            seq('inout', optional(seq($.expression, '.', $.identifier))),

        index_access: ($) =>
            seq(
                '[',
                optional($.NL),
                choice($.expression, $.range_element),
                optional($.NL),
                ']',
            ),

        range_element: ($) =>
            choice(
                '..',
                seq(choice('..', '..='), optional($.NL), $.expression),
                seq($.expression, optional($.NL), '..'),
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

        boolean_literal: ($) => choice('true', 'false'),

        string_literal: ($) =>
            choice(
                $.line_string_literal,
                $.multi_line_string_literal,
                $.multi_line_raw_string_literal,
            ),

        line_string_content: ($) => $.line_str_text,

        line_string_literal: ($) =>
            seq(
                '"',
                repeat(choice($.line_string_expression, $.line_string_content)),
                '"',
            ),

        line_string_expression: ($) =>
            seq(
                '${',
                repeat(';'),
                repeat($.expression_or_declaration),
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
                repeat($.end),
                repeat($.expression_or_declaration),
                repeat($.end),
                '}',
            ),

        collection_literal: ($) => $.array_literal,

        array_literal: ($) =>
            seq('[', optional(seq($.NL, $.elements)), $.NL, ']'),

        elements: ($) =>
            repeat(seq($.element, optional(seq($.NL, ',', $.NL, $.element)))),

        element: ($) => choice($.expression_element, $.spread_element),

        expression_element: ($) => $.expression,

        spread_element: ($) => seq('*', $.expression),

        tuple_literal: ($) =>
            seq('(', optional($.NL), repeat($.expression), $.NL, ')'),

        unit_literal: ($) => seq('(', optional($.NL), ')'),

        if_expression: ($) =>
            seq(
                'if',
                repeat($.NL),
                '(',
                repeat($.NL),
                optional(
                    seq(
                        'let',
                        repeat($.NL),
                        $.deconstruct_pattern,
                        repeat($.NL),
                        '=>',
                        repeat($.NL),
                    ),
                ),
                $.expression,
                repeat($.NL),
                ')',
                repeat($.NL),
                $.block,
                optional(
                    seq(
                        repeat($.NL),
                        'else',
                        repeat($.NL),
                        choice($.if_expression, $.block),
                    ),
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
            choice(
                seq(
                    'match',
                    $.NL,
                    repeat($.NL),
                    '(',
                    $.NL,
                    $.expression,
                    $.NL,
                    ')',
                    $.NL,
                    '{',
                    $.NL,
                    repeat($.match_case),
                    $.NL,
                    '}',
                ),
                seq(
                    'match',
                    $.NL,
                    '{',
                    $.NL,
                    repeat(
                        seq(
                            'case',
                            $.NL,
                            choice($.expression, '_'),
                            $.NL,
                            '=>',
                            $.NL,
                            $.expression_or_declaration,
                            repeat(seq($.end, $.expression_or_declaration)),
                        ),
                    ),
                    $.NL,
                    '}',
                ),
            ),

        match_case: ($) =>
            seq(
                'case',
                optional(seq($.NL, $.pattern)),
                optional(seq($.pattern_guard, $.NL)),
                '=>',
                $.expression_or_declaration,
                repeat(seq($.end, $.expression_or_declaration)),
            ),

        pattern_guard: ($) => seq('where', optional($.NL), $.expression),

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
            seq(
                $.literal_constant,
                optional(seq($.NL, '|', optional($.literal_constant))),
            ),

        wildcard_pattern: ($) => '_',

        var_binding_pattern: ($) => $.identifier,

        tuple_pattern: ($) =>
            seq(
                '(',
                optional($.NL),
                repeat(seq($.pattern, optional(seq($.NL, ',', $.NL, $.pattern)))),
                $.NL,
                ')',
            ),

        type_pattern: ($) =>
            seq(choice('_', $.identifier), optional(seq($.NL, ':', $.NL, $.type))),

        enum_pattern: ($) =>
            seq(
                optional(seq($.user_type, '.')),
                $.identifier,
                optional($.enum_pattern_parameters),
                optional(
                    seq(
                        $.NL,
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
            seq(
                '(',
                optional($.NL),
                repeat(seq($.pattern, optional(seq($.NL, ',', $.NL, $.pattern)))),
                $.NL,
                ')',
            ),

        loop_expression: ($) =>
            choice($.for_in_expression, $.while_expression, $.do_while_expression),

        for_in_expression: ($) =>
            seq(
                'for',
                optional(
                    seq(
                        $.NL,
                        '(',
                        optional($.patterns_maybe_irrefutable),
                        'in',
                        $.expression,
                        optional($.pattern_guard),
                        $.NL,
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
                $.NL,
                '(',
                $.NL,
                optional(
                    seq('let', $.NL, $.deconstruct_pattern, $.NL, 'backarrow', $.NL),
                ),
                $.expression,
                $.NL,
                ')',
                $.NL,
                $.block,
            ),

        do_while_expression: ($) =>
            seq(
                'do',
                $.block,
                'while',
                optional(seq($.NL, '(', $.expression, ')')),
            ),

        try_expression: ($) =>
            choice(
                seq('try', $.block, 'finally', $.block),
                seq(
                    'try',
                    $.block,
                    repeat(
                        seq('catch', seq('(', $.catch_pattern, ')', $.block)),
                    ),
                    optional(seq('finally', $.block)),
                ),
                seq(
                    'try',
                    seq('(', $.resource_specifications, ')'),
                    $.block,
                    repeat(
                        seq('catch', seq('(', $.catch_pattern, ')', $.block)),
                    ),
                    optional(seq('finally', $.block)),
                ),
            ),

        catch_pattern: ($) => choice($.wildcard_pattern, $.exception_type_pattern),

        exception_type_pattern: ($) =>
            seq(
                choice('_', $.identifier),
                optional(seq($.NL, ':', $.NL, $.type)),
                optional(seq($.NL, '|', optional($.type))),
            ),

        resource_specifications: ($) =>
            repeat(
                seq(
                    $.resource_specification,
                    optional(seq($.NL, ',', $.NL, $.resource_specification)),
                ),
            ),

        resource_specification: ($) =>
            seq(
                $.identifier,
                optional(seq($.NL, ':', optional($.class_type))),
                optional(seq($.NL, '=', $.expression)),
            ),

        jump_expression: ($) =>
            choice(
                seq('throw', $.expression),
                seq('return', optional($.expression)),
                'continue',
                'break',
            ),

        numeric_type_conv_expr: ($) =>
            seq($.numeric_types, '(', optional($.NL), $.expression, ')'),

        this_super_expression: ($) => choice('this', 'super'),

        lambda_expression: ($) =>
            seq(
                '{',
                optional($.NL),
                optional($.lambda_parameters),
                optional(seq('=>', $.expression_or_declarations)),
                '}',
            ),

        trailing_lambda_expression: ($) =>
            seq(
                '{',
                optional($.NL),
                optional(seq($.lambda_parameters, '=>')),
                optional($.expression_or_declarations),
                '}',
            ),

        lambda_parameters: ($) =>
            repeat(
                seq($.lambda_parameter, optional(seq($.NL, ',', $.lambda_parameter))),
            ),

        lambda_parameter: ($) =>
            seq(choice($.identifier, '_'), optional(seq($.NL, ':', $.type))),

        spawn_expression: ($) =>
            seq(
                'spawn',
                optional(seq('(', $.expression, ')')),
                optional(seq($.NL, $.trailing_lambda_expression)),
            ),

        synchronized_expression: ($) =>
            seq(
                'synchronized',
                '(',
                optional($.NL),
                $.expression,
                ')',
                $.block,
            ),

        parenthesized_expression: ($) =>
            seq('(', optional($.NL), $.expression, ')'),

        block: ($) => seq('{', $.expression_or_declarations, '}'),

        unsafe_expression: ($) => seq('unsafe', optional($.NL), $.block),

        expression_or_declarations: ($) =>
            seq(
                repeat($.end),
                optional(
                    repeat(
                        seq(
                            $.expression_or_declaration,
                            optional(seq($.end, $.expression_or_declaration)),
                        ),
                    ),
                ),
            ),

        expression_or_declaration: ($) =>
            choice($.expression, $.var_or_func_declaration),

        var_or_func_declaration: ($) =>
            choice($.function_definition, $.variable_declaration),

        quote_expression: ($) => seq('quote', $.quote_expr),

        quote_expr: ($) =>
            seq('(', optional($.NL), $.quote_parameters, ')'),

        quote_parameters: ($) =>
            repeat(choice($.quote_token, $.quote_interpolate, $.macro_expression)),

        // TODO
        quote_token: ($) =>
            choice(
                '.',
                ',',
                $.identifier,
                $.dollar_identifier,
            ),

        quote_interpolate: ($) => seq('$', $.quote_expression),

        macro_expression: ($) =>
            seq(
                '@',
                $.identifier,
                optional($.macro_attr_expr),
                $.NL,
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
        macro_tokens: ($) => repeat(choice($.quote_token, $.macro_expression)),

        assignment_operator: ($) =>
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
        equality_operator: ($) => choice('!=', '=='),
        comparison_operator: ($) => choice('<', '>', '<=', '>='),
        shifting_operator: ($) => choice('<<', '>>'),
        flow_operator: ($) => choice('|>', '>>='),
        additive_operator: ($) => choice('+', '-'),
        exponent_operator: ($) => '**',
        multiplicative_operator: ($) => choice('*', '/', '%'),
        prefix_unary_operator: ($) => choice('-', 'not'),

        overloaded_operators: ($) =>
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
        // Lexer
        NL: ($) => choice('\n', '\r\n'),

        // Identifiers and literals
        ident: ($) => /[_\p{XID_Start}][_\p{XID_Continue}]*/u,
        raw_ident: ($) => /`[_\p{XID_Start}][_\p{XID_Continue}]*`/u,
        identifier: ($) => token(choice($.ident, $.raw_ident)),
        dollar_identifier: ($) => seq('$', choice($.ident, $.raw_ident)),

        // Comments
        comment: ($) => choice($.line_comment, $.delimited_comment),
        line_comment: ($) => token(seq('//', /.*/)),
        delimited_comment: ($) =>
            token(seq('/*', /[^*]*\*+([^/*][^*]*\*+)*/, '*/')),

        // Whitespace
        _whitespace: ($) => token(/[ \t\f]+/),

        // Symbols
        // SEMI: ($) => ';',
        // DOT: ($) => '.',
        // COMMA: ($) => ',',
        // LPAREN: ($) => '(',
        // RPAREN: ($) => ')',
        // LSQUARE: ($) => '[',
        // RSQUARE: ($) => ']',
        // LCURL: ($) => '{',
        // RCURL: ($) => '}',
        // ADD: ($) => '+',
        // SUB: ($) => '-',
        // MUL: ($) => '*',
        // DIV: ($) => '/',
        // EXP: ($) => '**',
        // MOD: ($) => '%',
        // ASSIGN: ($) => '=',

        // Operators
        // EQUAL: ($) => '==',
        // NOTEQUAL: ($) => '!=',
        // LT: ($) => '<',
        // LE: ($) => '<=',
        // GT: ($) => '>',
        // GE: ($) => '>=',
        // AND: ($) => '&&',
        // OR: ($) => '||',
        // NOT: ($) => '!',

        escape_sequence: ($) =>
            token(
                seq(
                    '\\',
                    choice(
                        'n',
                        'r',
                        't',
                        'b',
                        'f',
                        '\\',
                        '"',
                        "'",
                        'u{',
                        /[0-9a-fA-F]+/,
                        '}',
                    ),
                ),
            ),

        // Delimiters
        QUOTE_OPEN: ($) => '"',
        QUOTE_CLOSE: ($) => '"',
        TRIPLE_QUOTE_OPEN: ($) => '"""',
        TRIPLE_QUOTE_CLOSE: ($) => '"""',

        // Literals
        integer_literal_suffix: ($) =>
            choice('i8', 'i16', 'i32', 'i64', 'u8', 'u16', 'u32', 'u64'),

        integer_literal: ($) =>
            choice(
                seq($.binary_literal, optional($.integer_literal_suffix)),
                seq($.octal_literal, optional($.integer_literal_suffix)),
                seq($.decimal_literal, optional($.integer_literal_suffix)),
                seq($.hexadecimal_literal, optional($.integer_literal_suffix)),
            ),

        binary_literal: ($) =>
            seq('0', choice('b', 'B'), $.bin_digit, repeat(choice($.bin_digit, '_'))),
        bin_digit: ($) => /[01]/,

        octal_literal: ($) =>
            seq(
                '0',
                choice('o', 'O'),
                $.octal_digit,
                repeat(choice($.octal_digit, '_')),
            ),
        octal_digit: ($) => /[0-7]/,

        decimal_literal: ($) =>
            choice(
                seq(
                    $.decimal_digit_with_out_zero,
                    repeat(choice($.decimal_digit, '_')),
                ),
                $.decimal_digit,
            ),

        decimal_digit_with_out_zero: ($) => /[1-9]/,
        decimal_digit: ($) => /[0-9]/,

        hexadecimal_literal: ($) =>
            seq('0', choice('x', 'X'), $.hexadecimal_digits),
        hexadecimal_digits: ($) =>
            seq($.hexadecimal_digit, repeat(choice($.hexadecimal_digit, '_'))),
        hexadecimal_digit: ($) => /[0-9a-fA-F]/,

        float_literal_suffix: ($) => choice('f16', 'f32', 'f64'),

        float_literal: ($) =>
            choice(
                seq($.decimal_literal, optional($.decimal_exponent)),
                seq($.decimal_fraction, optional($.decimal_exponent)),
                seq(
                    $.decimal_literal,
                    $.decimal_fraction,
                    optional($.decimal_exponent),
                ),
                seq(
                    $.hexadecimalprefix,
                    choice(
                        $.hexadecimal_digits,
                        $.hexadecimal_fraction,
                        seq($.hexadecimal_digits, $.hexadecimal_fraction),
                    ),
                    $.hexadecimal_exponent,
                ),
            ),

        decimal_fraction: ($) => seq('.', $.decimal_fragment),
        decimal_fragment: ($) => seq($.decimal_digit, repeat(choice($.decimal_digit, '_'))),
        decimal_exponent: ($) =>
            seq($.float_e, optional($.sign), $.decimal_fragment),

        hexadecimal_fraction: ($) => seq('.', $.hexadecimal_digits),
        hexadecimal_exponent: ($) =>
            seq($.float_p, optional($.sign), $.decimal_fragment),

        float_e: ($) => choice('e', 'E'),
        float_p: ($) => choice('p', 'P'),
        sign: ($) => choice('-', ''),

        hexadecimalprefix: ($) => seq('0', choice('x', 'X')),

        rune_literal: ($) => seq("'", choice($.single_char, $.escape_seq), "'"),
        single_char: ($) => /[^'\\\r\n]/,
        escape_seq: ($) => choice($.uni_character_literal, $.escaped_identifier),

        uni_character_literal: ($) =>
            choice(
                seq('\\', 'u', '{', $.hexadecimal_digit, '}'),
                seq('\\', 'u', '{', seq($.hexadecimal_digit, $.hexadecimal_digit), '}'),
                seq(
                    '\\',
                    'u',
                    '{',
                    seq($.hexadecimal_digit, $.hexadecimal_digit, $.hexadecimal_digit),
                    '}',
                ),
                seq(
                    '\\',
                    'u',
                    '{',
                    seq(
                        $.hexadecimal_digit,
                        $.hexadecimal_digit,
                        $.hexadecimal_digit,
                        $.hexadecimal_digit,
                    ),
                    '}',
                ),
                seq(
                    '\\',
                    'u',
                    '{',
                    seq(
                        $.hexadecimal_digit,
                        $.hexadecimal_digit,
                        $.hexadecimal_digit,
                        $.hexadecimal_digit,
                        $.hexadecimal_digit,
                    ),
                    '}',
                ),
                seq(
                    '\\',
                    'u',
                    '{',
                    seq(
                        $.hexadecimal_digit,
                        $.hexadecimal_digit,
                        $.hexadecimal_digit,
                        $.hexadecimal_digit,
                        $.hexadecimal_digit,
                        $.hexadecimal_digit,
                    ),
                    '}',
                ),
                seq(
                    '\\',
                    'u',
                    '{',
                    seq(
                        $.hexadecimal_digit,
                        $.hexadecimal_digit,
                        $.hexadecimal_digit,
                        $.hexadecimal_digit,
                        $.hexadecimal_digit,
                        $.hexadecimal_digit,
                        $.hexadecimal_digit,
                    ),
                    '}',
                ),
                seq(
                    '\\',
                    'u',
                    '{',
                    seq(
                        $.hexadecimal_digit,
                        $.hexadecimal_digit,
                        $.hexadecimal_digit,
                        $.hexadecimal_digit,
                        $.hexadecimal_digit,
                        $.hexadecimal_digit,
                        $.hexadecimal_digit,
                        $.hexadecimal_digit,
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
        hex_char_byte_alt: ($) => seq('\\', 'u', '{', $.hexadecimal_digit, '}'),
        byte_string_array_literal: ($) =>
            seq('b', '"', repeat(choice($.single_char_byte, $.byte_escape_seq)), '"'),
        j_string_literal: ($) =>
            seq('j', '"', repeat(choice($.single_char_byte, $.escape_seq)), '"'),
        line_str_text: $ => choice(
            /[^\\\r\n]/, // Match any character except for backslash, carriage return, or newline
            $.escape_seq
        ),
        triple_quote_close: $ => seq(optional($.multi_line_string_quote), '"""'),

        multi_line_string_quote: ($) => repeat1('"'),
        multi_line_str_text: ($) => choice(/[^\\]/, $.escape_seq),
        multi_line_raw_string_literal: ($) => $.multi_line_raw_string_content,
        multi_line_raw_string_content: ($) =>
            seq('#', repeat($.multi_line_raw_string_content), '#') ||
            seq('#', '"', /.*/, '"', '#'),
    },
});
