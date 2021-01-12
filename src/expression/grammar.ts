
/* IMPORT */

import {Matcher, Parser} from '../types';

/* GRAMMAR */

const grammar = ( $: Matcher, K: Matcher ): Parser => {

  /* HELPERS */

  const CRLF
    = '\r\n';

  const Digit
    = /\d/;

  const Dot
    = '.';

  const Newline
    = /[\n\r]/;

  const Source
    = /[^]/;

  const _
    = /[ \t]*/;

  /* IDENTIFIER */

  const IdentifierStart
    = /[a-zA-Z$_]/;

  const IdentifierRest
    = /[a-zA-Z0-9$_]/;

  const Identifier
    = /[a-zA-Z$_][a-zA-Z0-9$_]*/;

  /* KEY */

  const Key
    = K`${Identifier}`;

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
    = $`${DecimalInteger} (${Dot} ${Digit}*)? !${IdentifierStart}`;

  const DecimalShortLiteral
    = $`${Dot} ${Digit}+ !${IdentifierStart}`;

  const DecimalLiteral
    = $`${DecimalFullLiteral} | ${DecimalShortLiteral}`;

  /* STRING LITERAL */

  const StringEscapeOperator
    = '\\';

  const StringEscapedCharacter
    = $`${StringEscapeOperator} (${CRLF} | ${Source})`;

  const StringAbstractLiteral
    = Delimiter => $`${Delimiter} ((!(${Delimiter} | ${StringEscapeOperator} | ${Newline}) ${Source}) | ${StringEscapedCharacter})* ${Delimiter}`;

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
    = $`${() => LogicalTernaryExpression} | ${() => LogicalORExpression}`;

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
    = $`${GroupExpression} | ${Literal} | ${Key}`;

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
    = /[-+]|!+/;

  const UnaryExpression
    = $`${UnaryOperator}? ${_} ${MemberExpression}`;

  /* BINARY EXPRESSION */

  const BinaryAbstractExpression
    = ( Operator, Expression ) => $`${Expression} (${_} ${Operator} ${_} ${Expression})*`;

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

  const TernaryAbstractExpressionGuard
    = ( LOperator, ROperator ) => new RegExp ( `(?=.+?${`\\${LOperator}`}.+?${`\\${ROperator}`}.+?)` );

  const TernaryAbstractExpression
    = ( LOperator, ROperator, LExpression, RExpression ) => $`${TernaryAbstractExpressionGuard ( LOperator, ROperator )} ${LExpression} ${_} ${LOperator} ${RExpression} ${ROperator} ${RExpression}`;

  /* LOGICAL TERNARY EXPRESSION */

  const LogicalTernaryOperatorTrue
    = '?';

  const LogicalTernaryOperatorFalse
    = ':';

  const LogicalTernaryExpression
    = TernaryAbstractExpression ( LogicalTernaryOperatorTrue, LogicalTernaryOperatorFalse, LogicalORExpression, Expression );

  /* ROOT */

  const Root
    = $`${Expression}? ${_} !${Source}`;

  /* RETURN */

  return Root;

};

/* EXPORT */

export default grammar;
