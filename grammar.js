/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
    name: 'cangjie',

    rules: {
        source_file: $ => seq(optional($.preamble), repeat($.top_level_object), optional($.main_definition), optional($.NL)),

        // Preamble, package, and import definitions
        preamble: $ => seq(optional($.package_header), repeat($.import_list)),
        package_header: $ => seq('package', optional($.NL), $.package_name_identifier, repeat1($.end)),
        package_name_identifier: $ => seq($.identifier, repeat(seq(optional($.NL), '.', optional($.NL), $.identifier))),
        import_list: $ => seq(optional(seq('from', optional($.NL), $.identifier)), optional($.NL), 'import', optional($.NL), $.import_all_or_specified, repeat(seq(optional($.NL), ',', optional($.NL), $.import_all_or_specified)), repeat1($.end)),

        import_all_or_specified: $ => choice($.import_all, $.import_specified),
        import_specified: $ => seq(repeat1(seq($.identifier, optional($.NL), '.', optional($.NL))), $.identifier),
        import_all: $ => seq(repeat1(seq($.identifier, optional($.NL), '.', optional($.NL))), '*'),
        import_alias: $ => seq('as', optional($.NL), $.identifier),

        // Top-level object definitions
        top_level_object: $ => choice($.class_definition, $.interface_definition, $.function_definition, $.variable_declaration, $.enum_definition, $.struct_definition, $.type_alias, $.extend_definition, $.foreign_declaration, $.macro_definition, $.macro_expression),

        // Class definition
        class_definition: $ => seq(optional($.class_modifier_list), 'class', optional($.NL), $.identifier, optional($.type_parameters), optional(seq(optional($.NL), 'upperbound', optional($.NL), $.super_class_or_interfaces)), optional($.generic_constraints), optional($.NL), $.class_body),

        super_class_or_interfaces: $ => choice(seq($.super_class, optional(seq(optional($.NL), '&', optional($.NL), $.super_interfaces))), $.super_interfaces),
        class_modifier_list: $ => repeat1($.class_modifier),
        class_modifier: $ => choice('public', 'protected', 'internal', 'private', 'abstract', 'open'),
        type_parameters: $ => seq('<', optional($.NL), $.identifier, repeat(seq(optional($.NL), ',', optional($.NL), $.identifier)), optional($.NL), '>'),
        super_class: $ => $.class_type,
        class_type: $ => seq(repeat(seq($.identifier, optional($.NL), '.', optional($.NL))), $.identifier, optional($.type_parameters)),
        super_interfaces: $ => seq($.interface_type, repeat(seq(optional($.NL), ',', optional($.NL), $.interface_type))),
        interface_type: $ => $.class_type,
        generic_constraints: $ => seq('where', optional($.NL), choice($.identifier, 'thistype'), optional($.NL), 'upperbound', optional($.NL), $.upper_bounds, repeat(seq(optional($.NL), ',', optional($.NL), choice($.identifier, 'thistype'), optional($.NL), 'upperbound', optional($.NL), $.upper_bounds))),
        upper_bounds: $ => seq($.type, repeat(seq(optional($.NL), '&', optional($.NL), $.type))),
        class_body: $ => seq('{', repeat($.end), repeat($.class_member_declaration), optional($.NL), optional($.class_primary_init), optional($.NL), repeat($.class_member_declaration), repeat($.end), '}'),

        class_member_declaration: $ => choice($.class_init, $.static_init, $.variable_declaration, $.function_definition, $.operator_function_definition, $.macro_expression, $.property_definition),
        class_init: $ => seq(optional(choice($.class_non_static_member_modifier, seq('const', optional($.NL)))), 'init', optional($.NL), $.function_parameters, optional($.NL), $.block),
        static_init: $ => seq('static', 'init', '(', ')', '{', optional($.expression_or_declarations), '}'),
        class_primary_init: $ => seq(optional(choice($.class_non_static_member_modifier, seq('const', optional($.NL)))), $.class_name, optional($.NL), '(', optional($.NL), $.class_primary_init_param_lists, optional($.NL), ')', optional($.NL), '{', optional($.NL), optional(seq('super', $.call_suffix)), repeat($.end), optional($.expression_or_declarations), optional($.NL), '}'),

        class_name: $ => $.identifier,
        class_primary_init_param_lists: $ => choice(
            seq($.unnamed_parameter_list, optional(seq(optional($.NL), ',', optional($.NL), $.named_parameter_list)), optional(seq(optional($.NL), ',', optional($.NL), $.class_named_init_param_list))),
            seq($.unnamed_parameter_list, optional(seq(optional($.NL), ',', optional($.NL), $.class_unnamed_init_param_list)), optional(seq(optional($.NL), ',', optional($.NL), $.class_named_init_param_list))),
            seq($.class_unnamed_init_param_list, optional(seq(optional($.NL), ',', optional($.NL), $.class_named_init_param_list))),
            seq($.named_parameter_list, optional(seq(optional($.NL), ',', optional($.NL), $.class_named_init_param_list))),
            $.class_named_init_param_list
        ),
        class_unnamed_init_param_list: $ => seq($.class_unnamed_init_param, repeat(seq(optional($.NL), ',', optional($.NL), $.class_unnamed_init_param))),
        class_named_init_param_list: $ => seq($.class_named_init_param, repeat(seq(optional($.NL), ',', optional($.NL), $.class_named_init_param))),
        class_unnamed_init_param: $ => seq(optional(seq($.class_non_static_member_modifier, optional($.NL))), choice('let', 'var'), optional($.NL), $.identifier, optional($.NL), ':', optional($.NL), $.type),
        class_named_init_param: $ => seq(optional(seq($.class_non_static_member_modifier, optional($.NL))), choice('let', 'var'), optional($.NL), $.identifier, optional($.NL), '!', optional($.NL), ':', optional($.NL), $.type, optional(seq(optional($.NL), '=', optional($.NL), $.expression))),

        class_non_static_member_modifier: $ => choice('public', 'private', 'protected', 'internal'),

        // Interface definition
        interface_definition: $ => seq(optional($.interface_modifier_list), 'interface', optional($.NL), $.identifier, optional($.type_parameters), optional(seq(optional($.NL), 'upperbound', optional($.NL), $.super_interfaces)), optional($.generic_constraints), optional($.NL), $.interface_body),
        interface_body: $ => seq('{', repeat($.end), repeat($.interface_member_declaration), repeat($.end), '}'),
        interface_member_declaration: $ => choice($.function_definition, $.operator_function_definition, $.macro_expression, $.property_definition),
        interface_modifier_list: $ => repeat1($.interface_modifier),
        interface_modifier: $ => choice('public', 'protected', 'internal', 'private', 'open'),

        // Function definition
        function_definition: $ => seq(optional($.function_modifier_list), 'func', optional($.NL), $.identifier, optional($.type_parameters), optional($.NL), $.function_parameters, optional(seq(optional($.NL), ':', optional($.NL), $.type)), optional($.generic_constraints), optional($.block)),
        function_modifier_list: $ => repeat1($.function_modifier),
        function_modifier: $ => choice('public', 'private', 'protected', 'internal', 'static', 'open', 'override', 'operator', 'redef', 'mut', 'unsafe', 'const'),


        // Lexer
        NL: $ => choice('\n', '\r\n'),

        // Identifiers and literals
        ident: $ => /[_\p{XID_Start}][_\p{XID_Continue}]*/gu,
        raw_ident: $ => /`[_\p{XID_Start}][_\p{XID_Continue}]*`/gu,
        identifier: $ => choice($.ident, $.raw_ident),
        dollar_identifier: $ => seq('$', choice($.ident, $.raw_ident)),

        // Comments
        comment: $ => choice(
            $.line_comment,
            $.delimited_comment
        ),
        line_comment: $ => token(seq('//', /.*/)),
        delimited_comment: $ => token(seq('/*', /[^*]*\*+([^/*][^*]*\*+)*/, '*/')),

        // Whitespace
        _whitespace: $ => token(/[ \t\f]+/),

        // Symbols
        DOT: $ => '.',
        COMMA: $ => ',',
        LPAREN: $ => '(',
        RPAREN: $ => ')',
        LSQUARE: $ => '[',
        RSQUARE: $ => ']',
        LCURL: $ => '{',
        RCURL: $ => '}',
        ADD: $ => '+',
        SUB: $ => '-',
        MUL: $ => '*',
        DIV: $ => '/',
        EXP: $ => '**',
        MOD: $ => '%',
        ASSIGN: $ => '=',

        // Operators
        EQUAL: $ => '==',
        NOTEQUAL: $ => '!=',
        LT: $ => '<',
        LE: $ => '<=',
        GT: $ => '>',
        GE: $ => '>=',
        AND: $ => '&&',
        OR: $ => '||',
        NOT: $ => '!',

        // Arithmetic and Assignment Expressions
        expression_statement: $ => seq(
            $.expression,
            ';'
        ),

        expression: $ => choice(
            $.binary_expression,
            $.unary_expression,
            $.identifier,
            $.literal
        ),

        binary_expression: $ => prec.left(seq(
            $.expression,
            choice($.ADD, $.SUB, $.MUL, $.DIV, $.MOD, $.EXP, $.EQUAL, $.NOTEQUAL, $.LT, $.LE, $.GT, $.GE),
            $.expression
        )),

        unary_expression: $ => prec.right(seq(
            choice($.NOT, $.SUB),
            $.expression
        )),

        // Assignment Statement
        assignment_statement: $ => seq(
            $.identifier,
            $.ASSIGN,
            $.expression,
            ';'
        ),

        // If Statement
        if_statement: $ => seq(
            'if',
            $.expression,
            $.block,
            optional(seq('else', $.block))
        ),

        // Loop Statement
        loop_statement: $ => choice(
            seq('for', $.expression, $.block),
            seq('while', $.expression, $.block)
        ),

        // Block
        block: $ => seq(
            $.LCURL,
            repeat($.statement),
            $.RCURL
        ),

        // Literals
        literal: $ => choice(
            $.integer_literal,
            $.float_literal,
            $.boolean_literal,
            $.string_literal
        ),

        integer_literal: $ => token(seq(
            choice('0', /[1-9]\d*/),
            optional(choice('i8', 'i16', 'i32', 'i64', 'u8', 'u16', 'u32', 'u64'))
        )),

        float_literal: $ => token(seq(
            /\d+(\.\d+)?/,
            optional(choice('f16', 'f32', 'f64'))
        )),

        boolean_literal: $ => choice('true', 'false'),

        string_literal: $ => token(seq(
            '"',
            repeat(choice($.string_character, $.escape_sequence)),
            '"'
        )),

        string_character: $ => token(prec(1, /[^"\\\r\n]/)),

        escape_sequence: $ => token(seq(
            '\\',
            choice('n', 'r', 't', 'b', 'f', '\\', '"', '\'', 'u{', /[0-9a-fA-F]+/, '}')
        )),

        // Delimiters
        QUOTE_OPEN: $ => '"',
        QUOTE_CLOSE: $ => '"',
        TRIPLE_QUOTE_OPEN: $ => '"""',
        TRIPLE_QUOTE_CLOSE: $ => '"""',
    }
});