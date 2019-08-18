
/* EXPRESSION GRAMMAR */

//URL: https://github.com/pegjs/pegjs/blob/master/examples/javascript.pegjs

Start
  = __ Statements __ { return true; }

SourceCharacter
  = .

WhiteSpace
  = "\t"
  / "\v"
  / "\f"
  / " "
  / "\u00A0"
  / "\uFEFF"
  / [\u0020\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000] // Zs

LineTerminator
  = [\n\r\u2028\u2029]

LineTerminatorSequence
  = "\n"
  / "\r\n"
  / "\r"
  / "\u2028"
  / "\u2029"

Identifier
  = !ReservedWord IdentifierName

IdentifierName
  = IdentifierStart IdentifierPart*

IdentifierStart
  = ASCIILetter
  / "$"
  / "_"

IdentifierPart
  = IdentifierStart
  / DecimalDigit

ASCIILetter
 = [a-zA-Z]

ReservedWord
  = Keyword
  / NullLiteral
  / BooleanLiteral

Keyword
  = ("break" / "case" / "catch" / "class" / "const" / "continue" / "debugger" / "default" / "delete" / "do" / "else" / "enum" / "export" / "extends" / "finally" / "for" / "function" / "if" / "implements" / "import" / "in" / "instanceof" / "interface" / "let" / "new" / "package" / "private" / "protected" / "public" / "return" / "static" / "super" / "switch" / "this" / "throw" / "try" / "typeof" / "var" / "void" / "while" / "with" / "yield") !IdentifierPart

Literal
  = NullLiteral
  / BooleanLiteral
  / NumericLiteral
  / StringLiteral

NullLiteral
  = "null" !IdentifierPart

BooleanLiteral
  = "true" !IdentifierPart
  / "false" !IdentifierPart

NumericLiteral
  = HexIntegerLiteral !(IdentifierStart / DecimalDigit)
  / DecimalLiteral !(IdentifierStart / DecimalDigit)

DecimalLiteral
  = DecimalIntegerLiteral "." DecimalDigit* ExponentPart?
  / "." DecimalDigit+ ExponentPart?
  / DecimalIntegerLiteral ExponentPart?

DecimalIntegerLiteral
  = "0"
  / NonZeroDigit DecimalDigit*

DecimalDigit
  = [0-9]

NonZeroDigit
  = [1-9]

ExponentPart
  = ExponentIndicator SignedInteger

ExponentIndicator
  = "e"i

SignedInteger
  = [+-]? DecimalDigit+

HexIntegerLiteral
  = "0x"i $HexDigit+

HexDigit
  = [0-9a-f]i

StringLiteral
  = '`' BacktickStringCharacter* '`'
  / '"' DoubleStringCharacter* '"'
  / "'" SingleStringCharacter* "'"

BacktickStringCharacter
  = !('`' / "\\" / LineTerminator) SourceCharacter
  / StringSpecialCharacter

DoubleStringCharacter
  = !('"' / "\\" / LineTerminator) SourceCharacter
  / StringSpecialCharacter

SingleStringCharacter
  = !("'" / "\\" / LineTerminator) SourceCharacter
  / StringSpecialCharacter

StringSpecialCharacter
  = "\\" EscapeSequence
  / LineContinuation

LineContinuation
  = "\\" LineTerminatorSequence

EscapeSequence
  = CharacterEscapeSequence
  / "0" !DecimalDigit
  / HexEscapeSequence
  / UnicodeEscapeSequence

CharacterEscapeSequence
  = SingleEscapeCharacter
  / NonEscapeCharacter

SingleEscapeCharacter
  = "'"
  / '"'
  / "`"
  / "\\"
  / "b"
  / "f"
  / "n"
  / "r"
  / "t"
  / "v"

NonEscapeCharacter
  = !(EscapeCharacter / LineTerminator) SourceCharacter

EscapeCharacter
  = SingleEscapeCharacter
  / DecimalDigit
  / "x"
  / "u"

HexEscapeSequence
  = "x" $(HexDigit HexDigit)

UnicodeEscapeSequence
  = "u" $(HexDigit HexDigit HexDigit HexDigit)

__
  = (WhiteSpace / LineTerminatorSequence)*

_
  = WhiteSpace*

EOS
  = __ ";"
  / _ LineTerminatorSequence
  / _ &"}"
  / __ EOF

EOF
  = !.

PrimaryExpression
  = Identifier
  / Literal
  / "(" __ Expression __ ")"

MemberExpression
  = PrimaryExpression (__ "[" __ Expression __ "]"  / __ "." __ IdentifierName)*

UnaryExpression
  = MemberExpression
  / UnaryOperator __ UnaryExpression

UnaryOperator
  = $("+" !"=")
  / $("-" !"=")
  / "~"
  / "!"

MultiplicativeExpression
  = UnaryExpression (__ MultiplicativeOperator __ UnaryExpression)*

MultiplicativeOperator
  = $("*" !"=")
  / $("/" !"=")
  / $("%" !"=")

AdditiveExpression
  = MultiplicativeExpression (__ AdditiveOperator __ MultiplicativeExpression)*

AdditiveOperator
  = $("+" ![+=])
  / $("-" ![-=])

ShiftExpression
  = AdditiveExpression (__ ShiftOperator __ AdditiveExpression)*

ShiftOperator
  = $("<<"  !"=")
  / $(">>>" !"=")
  / $(">>"  !"=")

RelationalExpression
  = ShiftExpression (__ RelationalOperator __ ShiftExpression)*

RelationalOperator
  = "<="
  / ">="
  / $("<" !"<")
  / $(">" !">")

EqualityExpression
  = RelationalExpression (__ EqualityOperator __ RelationalExpression)*

EqualityOperator
  = "==="
  / "!=="
  / "=="
  / "!="

BitwiseANDExpression
  = EqualityExpression (__ BitwiseANDOperator __ EqualityExpression)*

BitwiseANDOperator
  = $("&" ![&=])

BitwiseXORExpression
  = BitwiseANDExpression (__ BitwiseXOROperator __ BitwiseANDExpression)*

BitwiseXOROperator
  = $("^" !"=")

BitwiseORExpression
  = BitwiseXORExpression (__ BitwiseOROperator __ BitwiseXORExpression)*

BitwiseOROperator
  = $("|" ![|=])

LogicalANDExpression
  = BitwiseORExpression (__ LogicalANDOperator __ BitwiseORExpression)*

LogicalANDOperator
  = "&&"

LogicalORExpression
  = LogicalANDExpression (__ LogicalOROperator __ LogicalANDExpression)*

LogicalOROperator
  = "||"

ConditionalExpression
  = LogicalORExpression __ "?" __ ConditionalExpression __ ":" __ ConditionalExpression
  / LogicalORExpression

Expression
  = ConditionalExpression (__ "," __ ConditionalExpression)*

Statement
  = Expression EOS

Statements
  = (Statement (__ Statement)*)?
