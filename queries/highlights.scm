; Identifiers

(identifier) @type
(char_lang_types) @type.builtin
(property_definition
  name: (identifier) @property)

; Identifier conventions

; Assume all-caps names are constants
((identifier) @constant
 (#match? @constant "^[A-Z][A-Z\\d_]+$'"))

; Assume uppercase names are enum constructors
((identifier) @constructor
 (#match? @constructor "^[A-Z]"))

; Assume that uppercase names in paths are types
; ((scoped_identifier
;   path: (identifier) @type)
;  (#match? @type "^[A-Z]"))
; ((scoped_identifier
;   path: (scoped_identifier
;     name: (identifier) @type))
;  (#match? @type "^[A-Z]"))
; ((scoped_type_identifier
;   path: (identifier) @type)
;  (#match? @type "^[A-Z]"))
; ((scoped_type_identifier
;   path: (scoped_identifier
;     name: (identifier) @type))
;  (#match? @type "^[A-Z]"))

; Assume all qualified names in struct patterns are enum constructors. (They're
; either that, or struct names; highlighting both as constructors seems to be
; the less glaring choice of error, visually.)
; (struct_pattern
;   type: (scoped_type_identifier
;     name: (type_identifier) @constructor))

; Function calls

; (postfix_expression
;   function: (identifier) @function)
; (postfix_expression
;   function: (field_expression
;     field: (field_identifier) @function.method))
; (postfix_expression
;   function: (scoped_identifier
;     "::"
;     name: (identifier) @function))
; 
; (generic_function
;   function: (identifier) @function)
; (generic_function
;   function: (scoped_identifier
;     name: (identifier) @function))
; (generic_function
;   function: (field_expression
;     field: (field_identifier) @function.method))
; 
; (macro_invocation
;   macro: (identifier) @function.macro
;   "!" @function.macro)

; Function definitions

(function_definition 
  name: (identifier) @function)

(line_comment) @comment
(delimited_comment) @comment

"(" @punctuation.bracket
")" @punctuation.bracket
"[" @punctuation.bracket
"]" @punctuation.bracket
"{" @punctuation.bracket
"}" @punctuation.bracket

(type_arguments
  "<" @punctuation.bracket
  ">" @punctuation.bracket)
(type_parameters
  "<" @punctuation.bracket
  ">" @punctuation.bracket)

":" @punctuation.delimiter
"." @punctuation.delimiter
"," @punctuation.delimiter

(unnamed_parameter (identifier) @variable.parameter)

"as" @keyword
"break" @keyword
"const" @keyword
"continue" @keyword
"else" @keyword
"enum" @keyword
"func" @keyword
"for" @keyword
"if" @keyword
"in" @keyword
"let" @keyword
"match" @keyword
"public" @keyword
"private" @keyword
"protected" @keyword
"internal" @keyword
"static" @keyword
"open" @keyword
"override" @keyword
"redef" @keyword
"return" @keyword
"struct" @keyword
"type" @keyword
"unsafe" @keyword
"where" @keyword
"while" @keyword

(this_super_expression) @variable.builtin

(rune_literal) @string
(string_literal) @string
(byte_string_array_literal) @string

(boolean_literal) @constant.builtin
(integer_literal) @constant.builtin
(float_literal) @constant.builtin

"*" @operator
"&" @operator
"'" @operator