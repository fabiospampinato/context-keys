
/* IMPORT */

import {match, parse} from 'reghex';

/* PARSER HELPERS */

const $ = match ( '' );

/* GRAMMAR HELPERS */

const CRLF
  = '\r\n';

const Digit
  = /\d/;

const Dot
  = '.';

const Newline
  = /[\n\r]/;

const Source
  = /./;

const _
  = $`${/[ \t]/}*`;

/* IDENTIFIER */

const IdentifierStart
  = /[a-zA-Z$_]/;

const IdentifierRest
  = $`${IdentifierStart} | ${Digit}`;

const Identifier
  = $`${IdentifierStart} ${IdentifierRest}*`;

/* NULL LITERAL */

const NullIdentifier
  = 'null';

const NullLiteral
  = $`${NullIdentifier} !${IdentifierRest}`;

/* BOOLEAN LITERAL */

const BooleanIdentifier
  = /true|false/;

const BooleanLiteral
  = $`${BooleanIdentifier} !${IdentifierRest}`;

/* DECIMAL LITERAL */

const DecimalInteger
  = /0|[1-9]\d*/;

const DecimalFullLiteral
  = $`${DecimalInteger} :(${Dot} ${Digit}*)? !${IdentifierStart}`;

const DecimalShortLiteral
  = $`${Dot} ${Digit}+ !${IdentifierStart}`;

const DecimalLiteral
  = $`${DecimalFullLiteral} | ${DecimalShortLiteral}`;

/* STRING LITERAL */

const StringEscapeOperator
  = '\\';

const StringEscapedCharacter
  = $`${StringEscapeOperator} :(${CRLF} | ${Source})`;

const StringAbstractLiteral
  = Delimiter => $`${Delimiter} :(:(!(${Delimiter} | ${StringEscapeOperator} | ${Newline}) ${Source}) | ${StringEscapedCharacter})* ${Delimiter}`;

const StringSingleDelimiter
  = "'";

const StringSingleLiteral
  = StringAbstractLiteral ( StringSingleDelimiter )

const StringDoubleDelimiter
  = '"';

const StringDoubleLiteral
  = StringAbstractLiteral ( StringDoubleDelimiter )

const StringBacktickDelimiter
  = '`';

const StringBacktickLiteral
  = StringAbstractLiteral ( StringBacktickDelimiter )

const StringLiteral
  = $`${StringSingleLiteral} | ${StringDoubleLiteral} | ${StringBacktickLiteral}`;

/* LITERAL */

const Literal
  = $`${NullLiteral} | ${BooleanLiteral} | ${DecimalLiteral} | ${StringLiteral}`;

/* EXPRESSION */

const ExpressionRoot
  = $`${() => TernaryExpression} | ${() => LogicalORExpression}`;

const Expression
  = $`${_} ${ExpressionRoot} ${_}`;

/* GROUP EXPRESSION */

const GroupOperatorStart
  = '(';

const GroupOperatorEnd
  = ')';

const GroupExpression
  = $`${GroupOperatorStart} ${Expression} ${GroupOperatorEnd}`;

/* PRIMARY EXPRESSION */

const PrimaryExpression
  = $`${Literal} | ${Identifier} | ${GroupExpression}`;

/* MEMBER EXPRESSION */

const MemberOperatorStart
  = '[';

const MemberOperatorEnd
  = ']';

const MemberBraketsProperty
  = $`${MemberOperatorStart} ${Expression} ${MemberOperatorEnd}`;

const MemberDotProperty
  = $`${Dot} ${Identifier}`;

const MemberProperty
  = $`${MemberBraketsProperty} | ${MemberDotProperty}`;

const MemberExpression
  = $`${PrimaryExpression} ${MemberProperty}*`;

/* UNARY EXPRESSION */

const UnaryOperator
  = /[-+!]/;

const UnaryOperatorExpression
  = $`${UnaryOperator} ${_} ${() => UnaryExpression}`;

const UnaryExpression
  = $`${MemberExpression} | ${UnaryOperatorExpression}`;

/* BINARY EXPRESSION */

const BinaryAbstractExpression
  = ( Operator, Expression ) => $`${Expression} :(${_} ${Operator} ${_} ${Expression})*`;

/* MULTIPLICATIVE EXPRESSION */

const MultiplicativeOperator
  = /[*/%]/;

const MultiplicativeExpression
  = BinaryAbstractExpression ( MultiplicativeOperator, UnaryExpression );

/* ADDITIVE EXPRESSION */

const AdditiveOperator
  = /[-+]/;

const AdditiveExpression
  = BinaryAbstractExpression ( AdditiveOperator, MultiplicativeExpression );

/* RELATIONAL EXPRESSION */

const RelationalOperator
  = /[<>]=?/;

const RelationalExpression
  = BinaryAbstractExpression ( RelationalOperator, AdditiveExpression );

/* EQUALITY EXPRESSION */

const EqualityOperator
  = /[!=]==?/;

const EqualityExpression
  = BinaryAbstractExpression ( EqualityOperator, RelationalExpression );

/* LOGICAL AND EXPRESSION */

const LogicalANDOperator
  = '&&';

const LogicalANDExpression
  = BinaryAbstractExpression ( LogicalANDOperator, EqualityExpression );

/* LOGICAL OR EXPRESSION */

const LogicalOROperator
  = '||';

const LogicalORExpression
  = BinaryAbstractExpression ( LogicalOROperator, LogicalANDExpression );

/* TERNARY EXPRESSION */

const TernaryOperatorTrue
  = '?';

const TernaryOperatorFalse
  = ':';

const TernaryExpression
  = $`${LogicalORExpression} ${_} ${TernaryOperatorTrue} ${Expression} ${TernaryOperatorFalse} ${Expression}`;

/* ROOT */

const Root
  = $`${Expression}? !${Source}`;

/* EXPORT */

export default parse ( Root );
