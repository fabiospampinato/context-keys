
/* EXPRESSION GRAMMAR */

//URL: https://github.com/pegjs/pegjs/blob/master/examples/javascript.pegjs

/* START */

Start
  = _ Expression _ !Source { return true }

/* HELPERS */

Dot
  = "."

Newline
  = [\n\r\u2028\u2029]

NewlineSequence
  = "\r\n"
  / Newline

Source
  = .

_
  = [ \t\v\f\u00A0\u1680\u2000-\u200A\u202F\u205F\u3000\uFEFF]*

/* IDENTIFIER */

Identifier
  = IdentifierStart IdentifierRest*

IdentifierStart
  = [a-zA-Z$_]

IdentifierRest
  = IdentifierStart
  / DecimalDigit

/* LITERAL */

Literal
  = NullLiteral
  / BooleanLiteral
  / DecimalLiteral
  / StringLiteral

/* NULL LITERAL */

NullIdentifier
  = "null"

NullLiteral
  = NullIdentifier !IdentifierRest

/* BOOLEAN LITERAL */

BooleanIdentifier
  = "true"
  / "false"

BooleanLiteral
  = BooleanIdentifier !IdentifierRest

/* DECIMAL LITERAL */

DecimalLiteral
  = DecimalIntegerLiteral (Dot DecimalDigit*)? DecimalExponent? !IdentifierStart
  / Dot DecimalDigit+ DecimalExponent? !IdentifierStart

DecimalIntegerLiteral
  = "0"
  / [1-9] DecimalDigit*

DecimalDigit
  = [0-9]

DecimalExponent
  = "e"i [+-]? DecimalDigit+

/* STRING LITERAL */

StringLiteral
  = StringSingleDelimiter StringSingleCharacter* StringSingleDelimiter
  / StringDoubleDelimiter StringDoubleCharacter* StringDoubleDelimiter
  / StringBacktickDelimiter StringBacktickCharacter* StringBacktickDelimiter

StringSingleDelimiter
  = "'"

StringSingleCharacter
  = !(StringSingleDelimiter / StringEscapeOperator / Newline) Source
  / StringEscapedCharacter

StringDoubleDelimiter
  = '"'

StringDoubleCharacter
  = !(StringDoubleDelimiter / StringEscapeOperator / Newline) Source
  / StringEscapedCharacter

StringBacktickDelimiter
  = "`"

StringBacktickCharacter
  = !(StringBacktickDelimiter / StringEscapeOperator / Newline) Source
  / StringEscapedCharacter

StringEscapeOperator
  = "\\"

StringEscapedCharacter
  = StringEscapeOperator (NewlineSequence / Source)

/* EXPRESSION */

Expression
  = TernaryExpression
  / LogicalORExpression

/* TERNARY EXPRESSION */

TernaryOperatorTrue
  = "?"

TernaryOperatorFalse
  = ":"

TernaryExpression
  = LogicalORExpression _ TernaryOperatorTrue _ Expression _ TernaryOperatorFalse _ Expression

/* LOGICAL OR EXPRESSION */

LogicalOROperator
  = "||"

LogicalORExpression
  = LogicalANDExpression (_ LogicalOROperator _ LogicalANDExpression)*

/* LOGICAL AND EXPRESSION */

LogicalANDOperator
  = "&&"

LogicalANDExpression
  = EqualityExpression (_ LogicalANDOperator _ EqualityExpression)*

/* EQUALITY EXPRESSION */

EqualityOperator
  = ("==" / "!=") "="?

EqualityExpression
  = RelationalExpression (_ EqualityOperator _ RelationalExpression)*

/* RELATIONAL EXPRESSION */

RelationalOperator
  = ("<" / ">") "="?

RelationalExpression
  = AdditiveExpression (_ RelationalOperator _ AdditiveExpression)*

/* ADDITIVE EXPRESSION */

AdditiveOperator
  = ("+" / "-") ![-+=]

AdditiveExpression
  = MultiplicativeExpression (_ AdditiveOperator _ MultiplicativeExpression)*

/* MULTIPLICATIVE EXPRESSION */

MultiplicativeOperator
  = ("*" / "/" / "%") !"="

MultiplicativeExpression
  = UnaryExpression (_ MultiplicativeOperator _ UnaryExpression)*

/* UNARY EXPRESSION */

UnaryOperator
  = ("+" / "-" / "!") !"="

UnaryExpression
  = MemberExpression
  / UnaryOperator _ UnaryExpression

/* MEMER EXPRESSION */

MemberOperatorStart
  = "["

MemberOperatorEnd
  = "]"

MemberExpression
  = PrimaryExpression (_ MemberOperatorStart _ Expression _ MemberOperatorEnd  / _ Dot _ Identifier)*

/* GROUP EXPRESSION */

GroupOperatorStart
  = "("

GroupOperatorEnd
  = ")"

GroupExpression
  = GroupOperatorStart _ Expression _ GroupOperatorEnd

/* PRIMARY EXPRESSION */

PrimaryExpression
  = Identifier
  / Literal
  / GroupExpression
