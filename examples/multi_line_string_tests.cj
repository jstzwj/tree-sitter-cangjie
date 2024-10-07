main() {
    println("""
Hi! // This is not a comment.
This is Cangjie!
""")
    println("""
Hi! // This is not a comment. ${"a" + "b"}
This is Cangjie!
""")
    println("""
${"a" + "b"}
""")
    println("""${"a" + "b"}""")

    let a = ###"Cangjie is very good!"###
    let b = #Cangjie is very good!#
    let b = #'Cangjie is very good!'#
    let b = ##"foo #\"# bar"##
}
