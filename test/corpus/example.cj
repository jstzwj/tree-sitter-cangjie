
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
      (expression_or_declarations
        (jump_expression
          (additive_expression
            left: (identifier)
            right: (identifier)))))))
==================
Function Definition getOrThrow
==================

func getOrThrow(a: ?Int64) {
    match (a) {
        case Some(v) => v
        case None => throw NoneValueException()
    }
}

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