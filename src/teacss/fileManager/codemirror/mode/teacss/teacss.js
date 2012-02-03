CodeMirror.defineMode("teacss", function(config, parserConfig) {

  var jsMode = CodeMirror.getMode(config, "javascript");
  var cssMode = CodeMirror.getMode(config, "css");


    function css(stream, state) {
      if (stream.match(/^\s*?@\{/)) {
          state.token = js_brackets;
          state.jsState = jsMode.startState(cssMode.indent(state.cssState,""));
          state.brackets = 1;
          return "js";
      }
      if (stream.sol()) {
          if (stream.match(/^\s*?@import/) || stream.match(/^\s*?@/)) {
            state.token = js_line;
            state.jsState = jsMode.startState(cssMode.indent(state.cssState,""));
            return "js";
          }
          if (stream.match(/(^\s*?\..*?)\(/)) {
              stream.backUp(1);
              state.token = js_line;
              state.jsState = jsMode.startState(cssMode.indent(state.cssState,""));
              return "mixin";
          }
      }
      if (stream.match(/^\s*?@/)) {
          state.token = js_inline;
          state.jsState = jsMode.startState(cssMode.indent(state.cssState,""));
          state.brackets = 1;
          return "js";
      }
      return cssMode.token(stream,state.cssState);
    }

    function js_brackets(stream, state) {
        if (stream.match(/^(\s)*?\{/,false)) { stream.eatSpace(); state.brackets++; }
        if (stream.match(/^(\s)*?\}/,false)) { stream.eatSpace(); state.brackets--; }

        if (state.brackets==0) {
            state.token = css;
            state.jsState = null;
            stream.match(/^\s*?\}/);
            return "js";
        }
        return jsMode.token(stream, state.jsState);
    }

    function js_line(stream,state) {
        if (stream.sol()) {
            state.token = css;
            state.jsState = null;
            return css(stream,state);
        }
        return jsMode.token(stream, state.jsState);
    }

    function js_inline(stream,state) {
        if (state.brackets) {
            state.brackets = 0;
            return jsMode.token(stream, state.jsState);
        } else {
            state.token = css;
            state.jsState = null;
            return css(stream,state);
        }
    }

  return {
    startState: function() {
      var state = cssMode.startState();
      return {token: css, jsState: null, cssState: state, brackets:0};
    },

    copyState: function(state) {
      var jsState = state.jsState ? CodeMirror.copyState(jsMode, state.jsState) : null;
      var cssState = CodeMirror.copyState(cssMode, state.cssState);
      return {token: state.token, jsState: jsState, cssState: cssState,brackets:state.brackets};
    },

    token: function(stream, state) {
      return state.token(stream, state);
    },

    indent: function(state, textAfter) {
      if (state.token == css)
        return cssMode.indent(state.cssState, textAfter);
      else
        return jsMode.indent(state.jsState, textAfter);
    },

    electricChars: "/{}:"
  }
});