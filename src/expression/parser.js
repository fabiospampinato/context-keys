/*
 * Generated by PEG.js 0.10.0.
 *
 * http://pegjs.org/
 */

"use strict";

function peg$subclass(child, parent) {
  function ctor() { this.constructor = child; }
  ctor.prototype = parent.prototype;
  child.prototype = new ctor();
}

function peg$SyntaxError(message, expected, found, location) {
  this.message  = message;
  this.expected = expected;
  this.found    = found;
  this.location = location;
  this.name     = "SyntaxError";

  if (typeof Error.captureStackTrace === "function") {
    Error.captureStackTrace(this, peg$SyntaxError);
  }
}

peg$subclass(peg$SyntaxError, Error);

peg$SyntaxError.buildMessage = function(expected, found) {
  var DESCRIBE_EXPECTATION_FNS = {
        literal: function(expectation) {
          return "\"" + literalEscape(expectation.text) + "\"";
        },

        "class": function(expectation) {
          var escapedParts = "",
              i;

          for (i = 0; i < expectation.parts.length; i++) {
            escapedParts += expectation.parts[i] instanceof Array
              ? classEscape(expectation.parts[i][0]) + "-" + classEscape(expectation.parts[i][1])
              : classEscape(expectation.parts[i]);
          }

          return "[" + (expectation.inverted ? "^" : "") + escapedParts + "]";
        },

        any: function(expectation) {
          return "any character";
        },

        end: function(expectation) {
          return "end of input";
        },

        other: function(expectation) {
          return expectation.description;
        }
      };

  function hex(ch) {
    return ch.charCodeAt(0).toString(16).toUpperCase();
  }

  function literalEscape(s) {
    return s
      .replace(/\\/g, '\\\\')
      .replace(/"/g,  '\\"')
      .replace(/\0/g, '\\0')
      .replace(/\t/g, '\\t')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/[\x00-\x0F]/g,          function(ch) { return '\\x0' + hex(ch); })
      .replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) { return '\\x'  + hex(ch); });
  }

  function classEscape(s) {
    return s
      .replace(/\\/g, '\\\\')
      .replace(/\]/g, '\\]')
      .replace(/\^/g, '\\^')
      .replace(/-/g,  '\\-')
      .replace(/\0/g, '\\0')
      .replace(/\t/g, '\\t')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r')
      .replace(/[\x00-\x0F]/g,          function(ch) { return '\\x0' + hex(ch); })
      .replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) { return '\\x'  + hex(ch); });
  }

  function describeExpectation(expectation) {
    return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
  }

  function describeExpected(expected) {
    var descriptions = new Array(expected.length),
        i, j;

    for (i = 0; i < expected.length; i++) {
      descriptions[i] = describeExpectation(expected[i]);
    }

    descriptions.sort();

    if (descriptions.length > 0) {
      for (i = 1, j = 1; i < descriptions.length; i++) {
        if (descriptions[i - 1] !== descriptions[i]) {
          descriptions[j] = descriptions[i];
          j++;
        }
      }
      descriptions.length = j;
    }

    switch (descriptions.length) {
      case 1:
        return descriptions[0];

      case 2:
        return descriptions[0] + " or " + descriptions[1];

      default:
        return descriptions.slice(0, -1).join(", ")
          + ", or "
          + descriptions[descriptions.length - 1];
    }
  }

  function describeFound(found) {
    return found ? "\"" + literalEscape(found) + "\"" : "end of input";
  }

  return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
};

function peg$parse(input, options) {
  options = options !== void 0 ? options : {};

  var peg$FAILED = {},

      peg$startRuleIndices = { Start: 0 },
      peg$startRuleIndex   = 0,

      peg$consts = [
        function() { return true; },
        peg$anyExpectation(),
        "\t",
        peg$literalExpectation("\t", false),
        "\x0B",
        peg$literalExpectation("\x0B", false),
        "\f",
        peg$literalExpectation("\f", false),
        " ",
        peg$literalExpectation(" ", false),
        "\xA0",
        peg$literalExpectation("\xA0", false),
        "\uFEFF",
        peg$literalExpectation("\uFEFF", false),
        /^[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/,
        peg$classExpectation([" ", "\xA0", "\u1680", ["\u2000", "\u200A"], "\u202F", "\u205F", "\u3000"], false, false),
        /^[\n\r\u2028\u2029]/,
        peg$classExpectation(["\n", "\r", "\u2028", "\u2029"], false, false),
        "\n",
        peg$literalExpectation("\n", false),
        "\r\n",
        peg$literalExpectation("\r\n", false),
        "\r",
        peg$literalExpectation("\r", false),
        "\u2028",
        peg$literalExpectation("\u2028", false),
        "\u2029",
        peg$literalExpectation("\u2029", false),
        "$",
        peg$literalExpectation("$", false),
        "_",
        peg$literalExpectation("_", false),
        /^[a-zA-Z]/,
        peg$classExpectation([["a", "z"], ["A", "Z"]], false, false),
        "break",
        peg$literalExpectation("break", false),
        "case",
        peg$literalExpectation("case", false),
        "catch",
        peg$literalExpectation("catch", false),
        "class",
        peg$literalExpectation("class", false),
        "const",
        peg$literalExpectation("const", false),
        "continue",
        peg$literalExpectation("continue", false),
        "debugger",
        peg$literalExpectation("debugger", false),
        "default",
        peg$literalExpectation("default", false),
        "delete",
        peg$literalExpectation("delete", false),
        "do",
        peg$literalExpectation("do", false),
        "else",
        peg$literalExpectation("else", false),
        "enum",
        peg$literalExpectation("enum", false),
        "export",
        peg$literalExpectation("export", false),
        "extends",
        peg$literalExpectation("extends", false),
        "finally",
        peg$literalExpectation("finally", false),
        "for",
        peg$literalExpectation("for", false),
        "function",
        peg$literalExpectation("function", false),
        "if",
        peg$literalExpectation("if", false),
        "implements",
        peg$literalExpectation("implements", false),
        "import",
        peg$literalExpectation("import", false),
        "in",
        peg$literalExpectation("in", false),
        "instanceof",
        peg$literalExpectation("instanceof", false),
        "interface",
        peg$literalExpectation("interface", false),
        "let",
        peg$literalExpectation("let", false),
        "new",
        peg$literalExpectation("new", false),
        "package",
        peg$literalExpectation("package", false),
        "private",
        peg$literalExpectation("private", false),
        "protected",
        peg$literalExpectation("protected", false),
        "public",
        peg$literalExpectation("public", false),
        "return",
        peg$literalExpectation("return", false),
        "static",
        peg$literalExpectation("static", false),
        "super",
        peg$literalExpectation("super", false),
        "switch",
        peg$literalExpectation("switch", false),
        "this",
        peg$literalExpectation("this", false),
        "throw",
        peg$literalExpectation("throw", false),
        "try",
        peg$literalExpectation("try", false),
        "typeof",
        peg$literalExpectation("typeof", false),
        "var",
        peg$literalExpectation("var", false),
        "void",
        peg$literalExpectation("void", false),
        "while",
        peg$literalExpectation("while", false),
        "with",
        peg$literalExpectation("with", false),
        "yield",
        peg$literalExpectation("yield", false),
        "null",
        peg$literalExpectation("null", false),
        "true",
        peg$literalExpectation("true", false),
        "false",
        peg$literalExpectation("false", false),
        ".",
        peg$literalExpectation(".", false),
        "0",
        peg$literalExpectation("0", false),
        /^[0-9]/,
        peg$classExpectation([["0", "9"]], false, false),
        /^[1-9]/,
        peg$classExpectation([["1", "9"]], false, false),
        "e",
        peg$literalExpectation("e", true),
        /^[+\-]/,
        peg$classExpectation(["+", "-"], false, false),
        "0x",
        peg$literalExpectation("0x", true),
        /^[0-9a-f]/i,
        peg$classExpectation([["0", "9"], ["a", "f"]], false, true),
        "`",
        peg$literalExpectation("`", false),
        "\"",
        peg$literalExpectation("\"", false),
        "'",
        peg$literalExpectation("'", false),
        "\\",
        peg$literalExpectation("\\", false),
        "b",
        peg$literalExpectation("b", false),
        "f",
        peg$literalExpectation("f", false),
        "n",
        peg$literalExpectation("n", false),
        "r",
        peg$literalExpectation("r", false),
        "t",
        peg$literalExpectation("t", false),
        "v",
        peg$literalExpectation("v", false),
        "x",
        peg$literalExpectation("x", false),
        "u",
        peg$literalExpectation("u", false),
        ";",
        peg$literalExpectation(";", false),
        "}",
        peg$literalExpectation("}", false),
        "(",
        peg$literalExpectation("(", false),
        ")",
        peg$literalExpectation(")", false),
        "[",
        peg$literalExpectation("[", false),
        "]",
        peg$literalExpectation("]", false),
        "+",
        peg$literalExpectation("+", false),
        "=",
        peg$literalExpectation("=", false),
        "-",
        peg$literalExpectation("-", false),
        "~",
        peg$literalExpectation("~", false),
        "!",
        peg$literalExpectation("!", false),
        "*",
        peg$literalExpectation("*", false),
        "/",
        peg$literalExpectation("/", false),
        "%",
        peg$literalExpectation("%", false),
        /^[+=]/,
        peg$classExpectation(["+", "="], false, false),
        /^[\-=]/,
        peg$classExpectation(["-", "="], false, false),
        "<<",
        peg$literalExpectation("<<", false),
        ">>>",
        peg$literalExpectation(">>>", false),
        ">>",
        peg$literalExpectation(">>", false),
        "<=",
        peg$literalExpectation("<=", false),
        ">=",
        peg$literalExpectation(">=", false),
        "<",
        peg$literalExpectation("<", false),
        ">",
        peg$literalExpectation(">", false),
        "===",
        peg$literalExpectation("===", false),
        "!==",
        peg$literalExpectation("!==", false),
        "==",
        peg$literalExpectation("==", false),
        "!=",
        peg$literalExpectation("!=", false),
        "&",
        peg$literalExpectation("&", false),
        /^[&=]/,
        peg$classExpectation(["&", "="], false, false),
        "^",
        peg$literalExpectation("^", false),
        "|",
        peg$literalExpectation("|", false),
        /^[|=]/,
        peg$classExpectation(["|", "="], false, false),
        "&&",
        peg$literalExpectation("&&", false),
        "||",
        peg$literalExpectation("||", false),
        "?",
        peg$literalExpectation("?", false),
        ":",
        peg$literalExpectation(":", false),
        ",",
        peg$literalExpectation(",", false)
      ],

      peg$bytecode = [
        peg$decode("%;F/9#;e/0$;F/'$8#: # )(#'#(\"'#&'#"),
        peg$decode("1\"\"5!7!"),
        peg$decode("2\"\"\"6\"7#.e &2$\"\"6$7%.Y &2&\"\"6&7'.M &2(\"\"6(7).A &2*\"\"6*7+.5 &2,\"\"6,7-.) &4.\"\"5!7/"),
        peg$decode("40\"\"5!71"),
        peg$decode("22\"\"6273.M &24\"\"6475.A &26\"\"6677.5 &28\"\"6879.) &2:\"\"6:7;"),
        peg$decode("%%<;*=.##&&!&'#/,#;&/#$+\")(\"'#&'#"),
        peg$decode("%;'/3#$;(0#*;(&/#$+\")(\"'#&'#"),
        peg$decode(";).5 &2<\"\"6<7=.) &2>\"\"6>7?"),
        peg$decode(";'.# &;2"),
        peg$decode("4@\"\"5!7A"),
        peg$decode(";+.) &;-.# &;."),
        peg$decode("%2B\"\"6B7C.\u0209 &2D\"\"6D7E.\u01FD &2F\"\"6F7G.\u01F1 &2H\"\"6H7I.\u01E5 &2J\"\"6J7K.\u01D9 &2L\"\"6L7M.\u01CD &2N\"\"6N7O.\u01C1 &2P\"\"6P7Q.\u01B5 &2R\"\"6R7S.\u01A9 &2T\"\"6T7U.\u019D &2V\"\"6V7W.\u0191 &2X\"\"6X7Y.\u0185 &2Z\"\"6Z7[.\u0179 &2\\\"\"6\\7].\u016D &2^\"\"6^7_.\u0161 &2`\"\"6`7a.\u0155 &2b\"\"6b7c.\u0149 &2d\"\"6d7e.\u013D &2f\"\"6f7g.\u0131 &2h\"\"6h7i.\u0125 &2j\"\"6j7k.\u0119 &2l\"\"6l7m.\u010D &2n\"\"6n7o.\u0101 &2p\"\"6p7q.\xF5 &2r\"\"6r7s.\xE9 &2t\"\"6t7u.\xDD &2v\"\"6v7w.\xD1 &2x\"\"6x7y.\xC5 &2z\"\"6z7{.\xB9 &2|\"\"6|7}.\xAD &2~\"\"6~7\x7F.\xA1 &2\x80\"\"6\x807\x81.\x95 &2\x82\"\"6\x827\x83.\x89 &2\x84\"\"6\x847\x85.} &2\x86\"\"6\x867\x87.q &2\x88\"\"6\x887\x89.e &2\x8A\"\"6\x8A7\x8B.Y &2\x8C\"\"6\x8C7\x8D.M &2\x8E\"\"6\x8E7\x8F.A &2\x90\"\"6\x907\x91.5 &2\x92\"\"6\x927\x93.) &2\x94\"\"6\x947\x95/8#%<;(=.##&&!&'#/#$+\")(\"'#&'#"),
        peg$decode(";-./ &;..) &;/.# &;9"),
        peg$decode("%2\x96\"\"6\x967\x97/8#%<;(=.##&&!&'#/#$+\")(\"'#&'#"),
        peg$decode("%2\x98\"\"6\x987\x99/8#%<;(=.##&&!&'#/#$+\")(\"'#&'#.H &%2\x9A\"\"6\x9A7\x9B/8#%<;(=.##&&!&'#/#$+\")(\"'#&'#"),
        peg$decode("%;7/>#%<;'.# &;2=.##&&!&'#/#$+\")(\"'#&'#.H &%;0/>#%<;'.# &;2=.##&&!&'#/#$+\")(\"'#&'#"),
        peg$decode("%;1/P#2\x9C\"\"6\x9C7\x9D/A$$;20#*;2&/1$;4.\" &\"/#$+$)($'#(#'#(\"'#&'#.u &%2\x9C\"\"6\x9C7\x9D/G#$;2/&#0#*;2&&&#/1$;4.\" &\"/#$+#)(#'#(\"'#&'#.; &%;1/1#;4.\" &\"/#$+\")(\"'#&'#"),
        peg$decode("2\x9E\"\"6\x9E7\x9F.= &%;3/3#$;20#*;2&/#$+\")(\"'#&'#"),
        peg$decode("4\xA0\"\"5!7\xA1"),
        peg$decode("4\xA2\"\"5!7\xA3"),
        peg$decode("%;5/,#;6/#$+\")(\"'#&'#"),
        peg$decode("3\xA4\"\"5!7\xA5"),
        peg$decode("%4\xA6\"\"5!7\xA7.\" &\"/9#$;2/&#0#*;2&&&#/#$+\")(\"'#&'#"),
        peg$decode("%3\xA8\"\"5\"7\xA9/@#%$;8/&#0#*;8&&&#/\"!&,)/#$+\")(\"'#&'#"),
        peg$decode("4\xAA\"\"5!7\xAB"),
        peg$decode("%2\xAC\"\"6\xAC7\xAD/B#$;:0#*;:&/2$2\xAC\"\"6\xAC7\xAD/#$+#)(#'#(\"'#&'#.\x87 &%2\xAE\"\"6\xAE7\xAF/B#$;;0#*;;&/2$2\xAE\"\"6\xAE7\xAF/#$+#)(#'#(\"'#&'#.R &%2\xB0\"\"6\xB07\xB1/B#$;<0#*;<&/2$2\xB0\"\"6\xB07\xB1/#$+#)(#'#(\"'#&'#"),
        peg$decode("%%<2\xAC\"\"6\xAC7\xAD./ &2\xB2\"\"6\xB27\xB3.# &;#=.##&&!&'#/,#;!/#$+\")(\"'#&'#.# &;="),
        peg$decode("%%<2\xAE\"\"6\xAE7\xAF./ &2\xB2\"\"6\xB27\xB3.# &;#=.##&&!&'#/,#;!/#$+\")(\"'#&'#.# &;="),
        peg$decode("%%<2\xB0\"\"6\xB07\xB1./ &2\xB2\"\"6\xB27\xB3.# &;#=.##&&!&'#/,#;!/#$+\")(\"'#&'#.# &;="),
        peg$decode("%2\xB2\"\"6\xB27\xB3/,#;?/#$+\")(\"'#&'#.# &;>"),
        peg$decode("%2\xB2\"\"6\xB27\xB3/,#;$/#$+\")(\"'#&'#"),
        peg$decode(";@.T &%2\x9E\"\"6\x9E7\x9F/8#%<;2=.##&&!&'#/#$+\")(\"'#&'#.) &;D.# &;E"),
        peg$decode(";A.# &;B"),
        peg$decode("2\xB0\"\"6\xB07\xB1.\x89 &2\xAE\"\"6\xAE7\xAF.} &2\xAC\"\"6\xAC7\xAD.q &2\xB2\"\"6\xB27\xB3.e &2\xB4\"\"6\xB47\xB5.Y &2\xB6\"\"6\xB67\xB7.M &2\xB8\"\"6\xB87\xB9.A &2\xBA\"\"6\xBA7\xBB.5 &2\xBC\"\"6\xBC7\xBD.) &2\xBE\"\"6\xBE7\xBF"),
        peg$decode("%%<;C.# &;#=.##&&!&'#/,#;!/#$+\")(\"'#&'#"),
        peg$decode(";A.; &;2.5 &2\xC0\"\"6\xC07\xC1.) &2\xC2\"\"6\xC27\xC3"),
        peg$decode("%2\xC0\"\"6\xC07\xC1/F#%%;8/,#;8/#$+\")(\"'#&'#/\"!&,)/#$+\")(\"'#&'#"),
        peg$decode("%2\xC2\"\"6\xC27\xC3/X#%%;8/>#;8/5$;8/,$;8/#$+$)($'#(#'#(\"'#&'#/\"!&,)/#$+\")(\"'#&'#"),
        peg$decode("$;\".# &;$0)*;\".# &;$&"),
        peg$decode("$;\"0#*;\"&"),
        peg$decode("%;F/2#2\xC4\"\"6\xC47\xC5/#$+\")(\"'#&'#.z &%;G/,#;$/#$+\")(\"'#&'#.a &%;G/>#%<2\xC6\"\"6\xC67\xC7=/##&'!&&#/#$+\")(\"'#&'#.6 &%;F/,#;I/#$+\")(\"'#&'#"),
        peg$decode("%<1\"\"5!7!=.##&&!&'#"),
        peg$decode(";%.c &;,.] &%2\xC8\"\"6\xC87\xC9/M#;F/D$;c/;$;F/2$2\xCA\"\"6\xCA7\xCB/#$+%)(%'#($'#(#'#(\"'#&'#"),
        peg$decode("%;J/\u011B#$%;F/\\#2\xCC\"\"6\xCC7\xCD/M$;F/D$;c/;$;F/2$2\xCE\"\"6\xCE7\xCF/#$+&)(&'#(%'#($'#(#'#(\"'#&'#.N &%;F/D#2\x9C\"\"6\x9C7\x9D/5$;F/,$;&/#$+$)($'#(#'#(\"'#&'#0\x97*%;F/\\#2\xCC\"\"6\xCC7\xCD/M$;F/D$;c/;$;F/2$2\xCE\"\"6\xCE7\xCF/#$+&)(&'#(%'#($'#(#'#(\"'#&'#.N &%;F/D#2\x9C\"\"6\x9C7\x9D/5$;F/,$;&/#$+$)($'#(#'#(\"'#&'#&/#$+\")(\"'#&'#"),
        peg$decode(";K.? &%;M/5#;F/,$;L/#$+#)(#'#(\"'#&'#"),
        peg$decode("%%2\xD0\"\"6\xD07\xD1/>#%<2\xD2\"\"6\xD27\xD3=.##&&!&'#/#$+\")(\"'#&'#/\"!&,).m &%%2\xD4\"\"6\xD47\xD5/>#%<2\xD2\"\"6\xD27\xD3=.##&&!&'#/#$+\")(\"'#&'#/\"!&,).5 &2\xD6\"\"6\xD67\xD7.) &2\xD8\"\"6\xD87\xD9"),
        peg$decode("%;L/}#$%;F/>#;O/5$;F/,$;L/#$+$)($'#(#'#(\"'#&'#0H*%;F/>#;O/5$;F/,$;L/#$+$)($'#(#'#(\"'#&'#&/#$+\")(\"'#&'#"),
        peg$decode("%%2\xDA\"\"6\xDA7\xDB/>#%<2\xD2\"\"6\xD27\xD3=.##&&!&'#/#$+\")(\"'#&'#/\"!&,).\x8D &%%2\xDC\"\"6\xDC7\xDD/>#%<2\xD2\"\"6\xD27\xD3=.##&&!&'#/#$+\")(\"'#&'#/\"!&,).U &%%2\xDE\"\"6\xDE7\xDF/>#%<2\xD2\"\"6\xD27\xD3=.##&&!&'#/#$+\")(\"'#&'#/\"!&,)"),
        peg$decode("%;N/}#$%;F/>#;Q/5$;F/,$;N/#$+$)($'#(#'#(\"'#&'#0H*%;F/>#;Q/5$;F/,$;N/#$+$)($'#(#'#(\"'#&'#&/#$+\")(\"'#&'#"),
        peg$decode("%%2\xD0\"\"6\xD07\xD1/>#%<4\xE0\"\"5!7\xE1=.##&&!&'#/#$+\")(\"'#&'#/\"!&,).U &%%2\xD4\"\"6\xD47\xD5/>#%<4\xE2\"\"5!7\xE3=.##&&!&'#/#$+\")(\"'#&'#/\"!&,)"),
        peg$decode("%;P/}#$%;F/>#;S/5$;F/,$;P/#$+$)($'#(#'#(\"'#&'#0H*%;F/>#;S/5$;F/,$;P/#$+$)($'#(#'#(\"'#&'#&/#$+\")(\"'#&'#"),
        peg$decode("%%2\xE4\"\"6\xE47\xE5/>#%<2\xD2\"\"6\xD27\xD3=.##&&!&'#/#$+\")(\"'#&'#/\"!&,).\x8D &%%2\xE6\"\"6\xE67\xE7/>#%<2\xD2\"\"6\xD27\xD3=.##&&!&'#/#$+\")(\"'#&'#/\"!&,).U &%%2\xE8\"\"6\xE87\xE9/>#%<2\xD2\"\"6\xD27\xD3=.##&&!&'#/#$+\")(\"'#&'#/\"!&,)"),
        peg$decode("%;R/}#$%;F/>#;U/5$;F/,$;R/#$+$)($'#(#'#(\"'#&'#0H*%;F/>#;U/5$;F/,$;R/#$+$)($'#(#'#(\"'#&'#&/#$+\")(\"'#&'#"),
        peg$decode("2\xEA\"\"6\xEA7\xEB.\x99 &2\xEC\"\"6\xEC7\xED.\x8D &%%2\xEE\"\"6\xEE7\xEF/>#%<2\xEE\"\"6\xEE7\xEF=.##&&!&'#/#$+\")(\"'#&'#/\"!&,).U &%%2\xF0\"\"6\xF07\xF1/>#%<2\xF0\"\"6\xF07\xF1=.##&&!&'#/#$+\")(\"'#&'#/\"!&,)"),
        peg$decode("%;T/}#$%;F/>#;W/5$;F/,$;T/#$+$)($'#(#'#(\"'#&'#0H*%;F/>#;W/5$;F/,$;T/#$+$)($'#(#'#(\"'#&'#&/#$+\")(\"'#&'#"),
        peg$decode("2\xF2\"\"6\xF27\xF3.A &2\xF4\"\"6\xF47\xF5.5 &2\xF6\"\"6\xF67\xF7.) &2\xF8\"\"6\xF87\xF9"),
        peg$decode("%;V/}#$%;F/>#;Y/5$;F/,$;V/#$+$)($'#(#'#(\"'#&'#0H*%;F/>#;Y/5$;F/,$;V/#$+$)($'#(#'#(\"'#&'#&/#$+\")(\"'#&'#"),
        peg$decode("%%2\xFA\"\"6\xFA7\xFB/>#%<4\xFC\"\"5!7\xFD=.##&&!&'#/#$+\")(\"'#&'#/\"!&,)"),
        peg$decode("%;X/}#$%;F/>#;[/5$;F/,$;X/#$+$)($'#(#'#(\"'#&'#0H*%;F/>#;[/5$;F/,$;X/#$+$)($'#(#'#(\"'#&'#&/#$+\")(\"'#&'#"),
        peg$decode("%%2\xFE\"\"6\xFE7\xFF/>#%<2\xD2\"\"6\xD27\xD3=.##&&!&'#/#$+\")(\"'#&'#/\"!&,)"),
        peg$decode("%;Z/}#$%;F/>#;]/5$;F/,$;Z/#$+$)($'#(#'#(\"'#&'#0H*%;F/>#;]/5$;F/,$;Z/#$+$)($'#(#'#(\"'#&'#&/#$+\")(\"'#&'#"),
        peg$decode("%%2\u0100\"\"6\u01007\u0101/>#%<4\u0102\"\"5!7\u0103=.##&&!&'#/#$+\")(\"'#&'#/\"!&,)"),
        peg$decode("%;\\/}#$%;F/>#;_/5$;F/,$;\\/#$+$)($'#(#'#(\"'#&'#0H*%;F/>#;_/5$;F/,$;\\/#$+$)($'#(#'#(\"'#&'#&/#$+\")(\"'#&'#"),
        peg$decode("2\u0104\"\"6\u01047\u0105"),
        peg$decode("%;^/}#$%;F/>#;a/5$;F/,$;^/#$+$)($'#(#'#(\"'#&'#0H*%;F/>#;a/5$;F/,$;^/#$+$)($'#(#'#(\"'#&'#&/#$+\")(\"'#&'#"),
        peg$decode("2\u0106\"\"6\u01067\u0107"),
        peg$decode("%;`/w#;F/n$2\u0108\"\"6\u01087\u0109/_$;F/V$;b/M$;F/D$2\u010A\"\"6\u010A7\u010B/5$;F/,$;b/#$+))()'#(('#(''#(&'#(%'#($'#(#'#(\"'#&'#.# &;`"),
        peg$decode("%;b/\x89#$%;F/D#2\u010C\"\"6\u010C7\u010D/5$;F/,$;b/#$+$)($'#(#'#(\"'#&'#0N*%;F/D#2\u010C\"\"6\u010C7\u010D/5$;F/,$;b/#$+$)($'#(#'#(\"'#&'#&/#$+\")(\"'#&'#"),
        peg$decode("%;c/,#;H/#$+\")(\"'#&'#"),
        peg$decode("%;d/Y#$%;F/,#;d/#$+\")(\"'#&'#06*%;F/,#;d/#$+\")(\"'#&'#&/#$+\")(\"'#&'#.\" &\"")
      ],

      peg$currPos          = 0,
      peg$savedPos         = 0,
      peg$posDetailsCache  = [{ line: 1, column: 1 }],
      peg$maxFailPos       = 0,
      peg$maxFailExpected  = [],
      peg$silentFails      = 0,

      peg$result;

  if ("startRule" in options) {
    if (!(options.startRule in peg$startRuleIndices)) {
      throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
    }

    peg$startRuleIndex = peg$startRuleIndices[options.startRule];
  }

  function text() {
    return input.substring(peg$savedPos, peg$currPos);
  }

  function location() {
    return peg$computeLocation(peg$savedPos, peg$currPos);
  }

  function expected(description, location) {
    location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos)

    throw peg$buildStructuredError(
      [peg$otherExpectation(description)],
      input.substring(peg$savedPos, peg$currPos),
      location
    );
  }

  function error(message, location) {
    location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos)

    throw peg$buildSimpleError(message, location);
  }

  function peg$literalExpectation(text, ignoreCase) {
    return { type: "literal", text: text, ignoreCase: ignoreCase };
  }

  function peg$classExpectation(parts, inverted, ignoreCase) {
    return { type: "class", parts: parts, inverted: inverted, ignoreCase: ignoreCase };
  }

  function peg$anyExpectation() {
    return { type: "any" };
  }

  function peg$endExpectation() {
    return { type: "end" };
  }

  function peg$otherExpectation(description) {
    return { type: "other", description: description };
  }

  function peg$computePosDetails(pos) {
    var details = peg$posDetailsCache[pos], p;

    if (details) {
      return details;
    } else {
      p = pos - 1;
      while (!peg$posDetailsCache[p]) {
        p--;
      }

      details = peg$posDetailsCache[p];
      details = {
        line:   details.line,
        column: details.column
      };

      while (p < pos) {
        if (input.charCodeAt(p) === 10) {
          details.line++;
          details.column = 1;
        } else {
          details.column++;
        }

        p++;
      }

      peg$posDetailsCache[pos] = details;
      return details;
    }
  }

  function peg$computeLocation(startPos, endPos) {
    var startPosDetails = peg$computePosDetails(startPos),
        endPosDetails   = peg$computePosDetails(endPos);

    return {
      start: {
        offset: startPos,
        line:   startPosDetails.line,
        column: startPosDetails.column
      },
      end: {
        offset: endPos,
        line:   endPosDetails.line,
        column: endPosDetails.column
      }
    };
  }

  function peg$fail(expected) {
    if (peg$currPos < peg$maxFailPos) { return; }

    if (peg$currPos > peg$maxFailPos) {
      peg$maxFailPos = peg$currPos;
      peg$maxFailExpected = [];
    }

    peg$maxFailExpected.push(expected);
  }

  function peg$buildSimpleError(message, location) {
    return new peg$SyntaxError(message, null, null, location);
  }

  function peg$buildStructuredError(expected, found, location) {
    return new peg$SyntaxError(
      peg$SyntaxError.buildMessage(expected, found),
      expected,
      found,
      location
    );
  }

  function peg$decode(s) {
    var bc = new Array(s.length), i;

    for (i = 0; i < s.length; i++) {
      bc[i] = s.charCodeAt(i) - 32;
    }

    return bc;
  }

  function peg$parseRule(index) {
    var bc    = peg$bytecode[index],
        ip    = 0,
        ips   = [],
        end   = bc.length,
        ends  = [],
        stack = [],
        params, i;

    while (true) {
      while (ip < end) {
        switch (bc[ip]) {
          case 0:
            stack.push(peg$consts[bc[ip + 1]]);
            ip += 2;
            break;

          case 1:
            stack.push(void 0);
            ip++;
            break;

          case 2:
            stack.push(null);
            ip++;
            break;

          case 3:
            stack.push(peg$FAILED);
            ip++;
            break;

          case 4:
            stack.push([]);
            ip++;
            break;

          case 5:
            stack.push(peg$currPos);
            ip++;
            break;

          case 6:
            stack.pop();
            ip++;
            break;

          case 7:
            peg$currPos = stack.pop();
            ip++;
            break;

          case 8:
            stack.length -= bc[ip + 1];
            ip += 2;
            break;

          case 9:
            stack.splice(-2, 1);
            ip++;
            break;

          case 10:
            stack[stack.length - 2].push(stack.pop());
            ip++;
            break;

          case 11:
            stack.push(stack.splice(stack.length - bc[ip + 1], bc[ip + 1]));
            ip += 2;
            break;

          case 12:
            stack.push(input.substring(stack.pop(), peg$currPos));
            ip++;
            break;

          case 13:
            ends.push(end);
            ips.push(ip + 3 + bc[ip + 1] + bc[ip + 2]);

            if (stack[stack.length - 1]) {
              end = ip + 3 + bc[ip + 1];
              ip += 3;
            } else {
              end = ip + 3 + bc[ip + 1] + bc[ip + 2];
              ip += 3 + bc[ip + 1];
            }

            break;

          case 14:
            ends.push(end);
            ips.push(ip + 3 + bc[ip + 1] + bc[ip + 2]);

            if (stack[stack.length - 1] === peg$FAILED) {
              end = ip + 3 + bc[ip + 1];
              ip += 3;
            } else {
              end = ip + 3 + bc[ip + 1] + bc[ip + 2];
              ip += 3 + bc[ip + 1];
            }

            break;

          case 15:
            ends.push(end);
            ips.push(ip + 3 + bc[ip + 1] + bc[ip + 2]);

            if (stack[stack.length - 1] !== peg$FAILED) {
              end = ip + 3 + bc[ip + 1];
              ip += 3;
            } else {
              end = ip + 3 + bc[ip + 1] + bc[ip + 2];
              ip += 3 + bc[ip + 1];
            }

            break;

          case 16:
            if (stack[stack.length - 1] !== peg$FAILED) {
              ends.push(end);
              ips.push(ip);

              end = ip + 2 + bc[ip + 1];
              ip += 2;
            } else {
              ip += 2 + bc[ip + 1];
            }

            break;

          case 17:
            ends.push(end);
            ips.push(ip + 3 + bc[ip + 1] + bc[ip + 2]);

            if (input.length > peg$currPos) {
              end = ip + 3 + bc[ip + 1];
              ip += 3;
            } else {
              end = ip + 3 + bc[ip + 1] + bc[ip + 2];
              ip += 3 + bc[ip + 1];
            }

            break;

          case 18:
            ends.push(end);
            ips.push(ip + 4 + bc[ip + 2] + bc[ip + 3]);

            if (input.substr(peg$currPos, peg$consts[bc[ip + 1]].length) === peg$consts[bc[ip + 1]]) {
              end = ip + 4 + bc[ip + 2];
              ip += 4;
            } else {
              end = ip + 4 + bc[ip + 2] + bc[ip + 3];
              ip += 4 + bc[ip + 2];
            }

            break;

          case 19:
            ends.push(end);
            ips.push(ip + 4 + bc[ip + 2] + bc[ip + 3]);

            if (input.substr(peg$currPos, peg$consts[bc[ip + 1]].length).toLowerCase() === peg$consts[bc[ip + 1]]) {
              end = ip + 4 + bc[ip + 2];
              ip += 4;
            } else {
              end = ip + 4 + bc[ip + 2] + bc[ip + 3];
              ip += 4 + bc[ip + 2];
            }

            break;

          case 20:
            ends.push(end);
            ips.push(ip + 4 + bc[ip + 2] + bc[ip + 3]);

            if (peg$consts[bc[ip + 1]].test(input.charAt(peg$currPos))) {
              end = ip + 4 + bc[ip + 2];
              ip += 4;
            } else {
              end = ip + 4 + bc[ip + 2] + bc[ip + 3];
              ip += 4 + bc[ip + 2];
            }

            break;

          case 21:
            stack.push(input.substr(peg$currPos, bc[ip + 1]));
            peg$currPos += bc[ip + 1];
            ip += 2;
            break;

          case 22:
            stack.push(peg$consts[bc[ip + 1]]);
            peg$currPos += peg$consts[bc[ip + 1]].length;
            ip += 2;
            break;

          case 23:
            stack.push(peg$FAILED);
            if (peg$silentFails === 0) {
              peg$fail(peg$consts[bc[ip + 1]]);
            }
            ip += 2;
            break;

          case 24:
            peg$savedPos = stack[stack.length - 1 - bc[ip + 1]];
            ip += 2;
            break;

          case 25:
            peg$savedPos = peg$currPos;
            ip++;
            break;

          case 26:
            params = bc.slice(ip + 4, ip + 4 + bc[ip + 3]);
            for (i = 0; i < bc[ip + 3]; i++) {
              params[i] = stack[stack.length - 1 - params[i]];
            }

            stack.splice(
              stack.length - bc[ip + 2],
              bc[ip + 2],
              peg$consts[bc[ip + 1]].apply(null, params)
            );

            ip += 4 + bc[ip + 3];
            break;

          case 27:
            stack.push(peg$parseRule(bc[ip + 1]));
            ip += 2;
            break;

          case 28:
            peg$silentFails++;
            ip++;
            break;

          case 29:
            peg$silentFails--;
            ip++;
            break;

          default:
            throw new Error("Invalid opcode: " + bc[ip] + ".");
        }
      }

      if (ends.length > 0) {
        end = ends.pop();
        ip = ips.pop();
      } else {
        break;
      }
    }

    return stack[0];
  }

  peg$result = peg$parseRule(peg$startRuleIndex);

  if (peg$result !== peg$FAILED && peg$currPos === input.length) {
    return peg$result;
  } else {
    if (peg$result !== peg$FAILED && peg$currPos < input.length) {
      peg$fail(peg$endExpectation());
    }

    throw peg$buildStructuredError(
      peg$maxFailExpected,
      peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
      peg$maxFailPos < input.length
        ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
        : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
    );
  }
}

module.exports = {
  SyntaxError: peg$SyntaxError,
  parse:       peg$parse
};
