
==================
Function Definition add
==================

func add(a: Int64, b: Int64): Int64 {
    return a + b
}
---------
(source_file
  (function_definition
    name: (identifier)
    parameters: (function_parameters
      (unnamed_parameter_list
        (unnamed_parameter
          (identifier)
          (user_type
            (identifier)))
        (unnamed_parameter
          (identifier)
          (user_type
            (identifier)))))
    return_type: (user_type
      (identifier))
    body: (block
        (jump_expression
          (additive_expression
            left: (identifier)
            right: (identifier))))))
==================
Function Definition getOrThrow
==================

func getOrThrow(a: ?Int64) {
    match (a) {
        case Some(v) => v
        case None => throw NoneValueException()
    }
}

-------
(source_file
  (function_definition
    name: (identifier)
    parameters: (function_parameters
      (unnamed_parameter_list
        (unnamed_parameter
          (identifier)
          (prefix_type
            (prefix_type_operator)
            (user_type
              (identifier))))))
    body: (block
      (match_expression
        value: (identifier)
        (match_body
          (match_case
              (enum_pattern
                (identifier)
                (enum_pattern_parameters
                    (var_binding_pattern
                      (identifier))))
            (identifier))
          (match_case
              (var_binding_pattern
                (identifier))
                (jump_expression
                  (postfix_expression
                    (identifier)
                    (call_suffix)))))))))

==================
Enum Definition RGBColor
==================
enum RGBColor {
    | Red | Green | Blue
}
---------
(source_file
  (enum_definition 
    (identifier)
    (enum_body
      (case_body
        (identifier))
      (case_body
        (identifier))
      (case_body
        (identifier)))))

==================
Enum Definition RGBColor2
==================
enum RGBColor {
    | Red(UInt8) | Green(UInt8) | Blue(UInt8)
}
---------
(source_file
  (enum_definition
    (identifier)
    (enum_body
      (case_body
        (identifier)
        (user_type
          (identifier)))
      (case_body
        (identifier)
        (user_type
          (identifier)))
      (case_body
        (identifier)
        (user_type
          (identifier))))))


==================
Enum Definition RGBColor3
==================
enum Expr {
    | Num(Int64)
    | Add(Expr, Expr)
    | Sub(Expr, Expr)
}

==================
Enum Definition RGBColor4
==================
enum RGBColor {
    | Red | Green | Blue

    public static func printType() {
        print("RGBColor")
    }
}

----------

(source_file
  (enum_definition
    name: (identifier)
    (enum_body
      (case_body
        (identifier))
      (case_body
        (identifier))
      (case_body
        (identifier))
      (function_definition
        modifier: (function_modifier_list
          (function_modifier)
          (function_modifier))
        name: (identifier)
        parameters: (function_parameters)
        body: (block
            (postfix_expression
              (identifier)
              (call_suffix
                (value_argument
                  (string_literal
                    (line_string_literal))))))))))

==================
Option Definition
==================
main
(

) 
{
    let a: Option<Int64> = Some(100)
let b: ?Int64 = Some(100)
let c: Option<String> = Some("Hello")
let d: ?String = None
}

----------

(source_file
  (main_definition
    (function_parameters)
    (block
        (variable_declaration
          name: (var_binding_pattern
            (identifier))
          type: (user_type
            (identifier)
            (type_arguments
              (user_type
                (identifier))))
          value: (postfix_expression
            (identifier)
            (call_suffix
              (value_argument
                (integer_literal)))))
        (variable_declaration
          name: (var_binding_pattern
            (identifier))
          type: (prefix_type
            (prefix_type_operator)
            (user_type
              (identifier)))
          value: (postfix_expression
            (identifier)
            (call_suffix
              (value_argument
                (integer_literal)))))
        (variable_declaration
          name: (var_binding_pattern
            (identifier))
          type: (user_type
            (identifier)
            (type_arguments
              (user_type
                (identifier))))
          value: (postfix_expression
            (identifier)
            (call_suffix
              (value_argument
                (string_literal
                  (line_string_literal))))))
        (variable_declaration
          name: (var_binding_pattern
            (identifier))
          type: (prefix_type
            (prefix_type_operator)
            (user_type
              (identifier)))
          value: (identifier)))))