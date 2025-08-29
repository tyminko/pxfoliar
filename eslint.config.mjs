// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  files: ['**/*.vue'],
  rules: {
    // Ensure attributes and children stay properly indented in Vue templates
    'vue/html-indent': ['warn', 2, {
      attribute: 1,
      baseIndent: 1,
      closeBracket: 0,
      alignAttributesVertically: true,
      ignores: []
    }],
    // If more than 3 attributes, enforce multiline with 1 attribute per line
    'vue/max-attributes-per-line': ['warn', {
      singleline: 3,
      multiline: 1,
    }],
    // In multiline elements, the first attribute must be on a new line
    'vue/first-attribute-linebreak': ['warn', {
      singleline: 'beside',
      multiline: 'below',
    }],
    'vue/html-closing-bracket-newline': ['warn', {
      singleline: 'never',
      multiline: 'never',
    }],
  },
})
