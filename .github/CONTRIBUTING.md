# Contributing to fonts

## Adding new fonts

1.  Place the actual font into `resources/<font_name>/` directory, where
    `<font_name>` is the unique name of the font (lowercase, use dashes in
    place of spaces). Note the naming convention below.
2.  Place the font license in the same directory `resources/<font_name>/` into
    a text file `LICENSE` (or `LICENSE.txt`)
3.  Edit `scripts/fonts.yaml`. See below for format.
4.  Install devDependencies with `npm install --only=dev`
5.  Run `npm run build`
6.  Commit
7.  Push

When adding a new font, *do not* edit `styles/fonts.less` and `package.json`
directly, since those may be overwritten by the generator.

### Font file naming convention

The main font file should be named the same as the font directory. That is,
if `<font_name>` is the unique font name (lowercase, dashes in place of spaces), then main font file should be in
`resources/<font_name>/<font_name>.<extension>`.

For example, `resources/anonymous-pro/anonymous-pro.ttf` for the Anonymous Pro font.

If the font has bold, italic, or bold-italic variants, those are named as
`<font_name>-<variant>.<extension>`.

For example,

-   `resources/anonymous-pro/anonymous-pro-bold-italic.ttf`
-   `resources/anonymous-pro/anonymous-pro-bold.ttf`
-   `resources/anonymous-pro/anonymous-pro-italic.ttf`

for the Anonymous Pro font.

This convention can be broken when necessary, for example, if adding several
variants of the same font (e.g. light and normal variants) that have some
overlap.

For example, Office Code Pro has two variations: Light and Medium, and bold
Office Code Pro Light is the same as regular Office Code Pro Medium. Hence,
to avoid duplication, the naming convention is broken.

In any case, treat this convention as more of a guideline. Following the convention will let you generate YAML description automatically, but it's easy enough to write by hand.

### `scripts/fonts.yaml` format

`fonts.yaml` is a YAML object. The object property names are full font names.
Property values are font descriptions. Font description is a YAML object with the following properties:

-   `normal`: string, path to the font file for normal font-face; **required**
-   `bold`: string, path to the font file for bold font-face; *optional*
-   `italic`: string, path to the font file for italic font-face; *optional*
-   `bold-italic`: string, path to the font file for bold-italic font-face; *optional*

All paths are relative to `resources` directory. Always use forward slash `/`
as the path separator.

For the sake of brevity, a shortened form is supported, in case the font file
only has a `normal` version. In that case, instead of specifying the full YAML
object, a string of form `<dir_name>/<font_name>.<extension>` can be used, which will be treated the same as

```yaml
normal: '<font_name>/<font_name>.<extension>'
```

#### Fonts with multiple variants

When adding several variants of the same font, it's preferable to use the following format: root font object contains a property named `variants`, which itself is a YAML object, where property names are font variant names, and values are font descriptions. Special variant name `'*'` is treated as "default variant" and hence the generated font name will match the root font property name.

For example:

```yaml
Droid Sans Mono:
  variants:
    '*': 'droid-sans/droid-sans.woff2'
    Dotted: 'droid-sans-dotted/droid-sans-dotted.woff2'
    Slashed: 'droid-sans-slashed/droid-sans-slashed.woff2'
```
is functionally equivalent to
```yaml
Droid Sans Mono: 'droid-sans/droid-sans.woff2'
Droid Sans Mono Dotted: 'droid-sans-dotted/droid-sans-dotted.woff2'
Droid Sans Mono Slashed: 'droid-sans-slashed/droid-sans-slashed.woff2'
```

Any properties except `variants` on the root object will be applied to all child objects (unless child object redefines those explicitly).

For example:

```yaml
FiraCode:
  bold: 'firacode/FiraCode-Bold.woff2'
  variants:
    '*': 'firacode/FiraCode-Regular.woff2'
    Retina: 'firacode/FiraCode-Retina.woff2'
    Light:
      normal: 'firacode/FiraCode-Light.woff2'
      bold: 'firacode/FiraCode-Medium.woff2'
```
is functionally equivalent to
```yaml
FiraCode:
  normal: 'firacode/FiraCode-Regular.woff2'
  bold: 'firacode/FiraCode-Bold.woff2'
FiraCode Retina:
  normal: 'firacode/FiraCode-Retina.woff2'
  bold: 'firacode/FiraCode-Bold.woff2'
FiraCode Light:
  normal: 'firacode/FiraCode-Light.woff2'
  bold: 'firacode/FiraCode-Medium.woff2'
```

Please note that font variants format is used for computing statistics in the README, so it's highly preferable to use this format when appropriate.

Also of note is that `variants` is actually recursive, i.e. anywhere a font description could be, `variants` can appear instead. Please do not get carried away with it though.

#### Advanced syntax

You can skip this section if basic syntax is enough for you.

##### Fonts with multiple weight variants

Handling fonts with multiple weight variants using the "variants" feature described above can get tedious rather quickly. So when you intend on using systematic weights (e.g. "Regular" to "Thin" is the same as "Bold" to "Regular"), there is a special syntax for that.

If instead of the usual font description, the following properties are specified:

- `names`: array of strings
- `bold`: integer
- `step`: integer
- `weight`: array of font descriptions without `bold` and `bold-italic` properties (can be strings); assumed to be in the increasing weight order

then `length(names)` font variants will be inferred by generator, using the following algorithm:

-  `i`-th font variant is named "(root name) + `names[i]`". If `names[i]` is `'*'`, then font variant is named "root name"
-  font description for `i`-th font variant for `normal` and `italic` is taken from `weight[step*i]`
-  font description for `i`-th font variant for `bold` and `bold-italic` is taken from `weight[step*i+bold]`
-  if `step*i+bold` is larger than `length(weight)`, use the highest weight available.

So, for instance, `Source Code Pro` has 7 weights, namely, Extra Light, Light, Regular, Medium, Semibold, Bold, and Black. Let's say we want to consistently use a weight three "levels" up, i.e. for Extra Light, the bold version would be Medium, for Light, the bold version would be Semibold, etc. In that case, we could write:

```yaml
Source Code Pro:
  names:
  - Extra Light
  - Light
  - '*'
  - Medium
  bold: 3
  step: 1
  weight:
  - 'source-code-pro/source-code-pro-extralight.woff2'
  - 'source-code-pro/source-code-pro-light.woff2'
  - 'source-code-pro/source-code-pro.woff2'
  - 'source-code-pro/source-code-pro-medium.woff2'
  - 'source-code-pro/source-code-pro-semibold.woff2'
  - 'source-code-pro/source-code-pro-bold.woff2'
  - 'source-code-pro/source-code-pro-black.woff2'
```

which would be functionally equivalent to

```yaml
Source Code Pro:
  variants:
    Extra Light:
      normal: 'source-code-pro/source-code-pro-extralight.woff2'
      bold: 'source-code-pro/source-code-pro-medium.woff2'
    Light:
      normal: 'source-code-pro/source-code-pro-light.woff2'
      bold: 'source-code-pro/source-code-pro-semibold.woff2'
    '*':
      normal: 'source-code-pro/source-code-pro.woff2'
      bold: 'source-code-pro/source-code-pro-bold.woff2'
    Medium:
      normal: 'source-code-pro/source-code-pro-medium.woff2'
      bold: 'source-code-pro/source-code-pro-black.woff2'
```

It's possible to mix this with `variants` syntax, see below for an example.

##### Templates

It's possible to save oneself some typing when font files are named in a systematic manner close to the naming convention described above. Specifically,
`bold`, `italic`, and `bold-italic` properties can be specified as templates based on `normal` filename using `bold-template`, `italic-template` and `bold-italic-template` properties respectively.

Template syntax is as follows:

- All template expressions are in braces, `{}`, expressions outside braces are literal.
- Expressions in braces start with a variable name, and optionally contain a JavaScript RegExp replace pattern separated by forward slashes `/`
- The following variables derived from `normal` path are available:
    - `dir`: font directory name (e.g `source-code-pro`)
    - `base`: font file name, including extension (e.g. `source-code-pro-medium.woff2`)
    - `name`: font file name, excluding extension (e.g. `source-code-pro-medium`)
    - `ext`: font file extension, including leading dot (e.g. `.woff2`)
- All variable names must start with an ASCII letter followed by any number of ASCII letters, digits, or an ASCII dash `-`
- Any YAML properties on the current object (including inherited ones) that satisfy naming requirements are available as variables
- Replace pattern is applied to variable value prior to its use in the template
- Forward slashes are not allowed anywhere in RegExp pattern or replace string

So, to summarize, the template syntax is like this: either `{<variable name>}` or `{<variable name>/<search-regex>/<replace-string>/<regex-modifiers>}`.

For example,

```yaml
Victor Mono:
  names:
    - Thin
    - Extra Light
    - Light
    - '*'
    - Medium
  bold: 3
  step: 1
  italic-template: '{dir}/{name/Regular$//}{italic-name}{ext}'
  weight:
    - 'victor-mono/VictorMono-Thin.woff2'
    - 'victor-mono/VictorMono-ExtraLight.woff2'
    - 'victor-mono/VictorMono-Light.woff2'
    - 'victor-mono/VictorMono-Regular.woff2'
    - 'victor-mono/VictorMono-Medium.woff2'
    - 'victor-mono/VictorMono-SemiBold.woff2'
    - 'victor-mono/VictorMono-Bold.woff2'
  variants:
    '*':
      italic-name: Italic
    Oblique:
      italic-name: Oblique
```

##### Advanced YAML features

You can use YAML anchors, references, etc. To facilitate that, generator ignores object keys that start with `x-`.

### YAML description generator

If you follow the naming convention, you can use `scripts/fontDesc.py` Python
script to generate YAML description automatically. The script accepts a list of
font directories in `resources/` as command line arguments. For instance,
running

```bash
scripts/fontDesc.py resources/3270 resources/anka-coder
```

will produce

```yaml
IBM 3270: '3270/3270.woff'
Anka/Coder:
  bold: 'anka-coder/anka-coder-bold.ttf'
  italic: 'anka-coder/anka-coder-italic.ttf'
  normal: 'anka-coder/anka-coder.ttf'
  bold-italic: 'anka-coder/anka-coder-bold-italic.ttf'
```

on the standard output.

You need Python 3 and fonttools library to run the script, plus brotlipy
library if you plan to use it with WOFF2 fonts.

Using the script is by no means mandatory or even recommended, but it can be a
bit of a time saver when adding multiple fonts.

### Example

Office Code Pro has four weights (Regular, Light, Bold and Medium), and each of
those variants has normal and italic versions.We decide to provide Office Code
Pro Regular, Office Code Pro Medium and Office Code Pro Light.
Hence, we're naming the files as thus:

Regular:
-   `resources/office-code-pro/office-code-pro.woff`
-   `resources/office-code-pro/office-code-pro-italic.woff`

Light:
-   `resources/office-code-pro/office-code-pro-light-italic.woff`
-   `resources/office-code-pro/office-code-pro-light.woff`

Medium:
-   `resources/office-code-pro/office-code-pro-medium.woff`
-   `resources/office-code-pro/office-code-pro-medium-italic.woff`

Bold:
-   `resources/office-code-pro/office-code-pro-bold-italic.woff`
-   `resources/office-code-pro/office-code-pro-bold.woff`

And not forgetting the license:
-   `resources/office-code-pro/LICENSE.txt`

Now, since we want to have a `bold` variant of a font, we'll just include a
variant from two weights up. That is, "bold" for Light version would be Medium,
and "bold" for Regular would be Bold. We'll just use the same Bold as "bold" for Medium.

So the Regular version could be defined like this:

```yaml
Office Code Pro:
   bold-italic: 'office-code-pro/office-code-pro-bold-italic.woff'
   bold: 'office-code-pro/office-code-pro-bold.woff'
   italic: 'office-code-pro/office-code-pro-italic.woff'
   normal: 'office-code-pro/office-code-pro.woff'
```

This one can also be produced by running `scripts/fontDesc.py resources/office-code-pro` (which will also list all other font files as comments)

Now, to define multiple font variants, we'll use the variants syntax:

```yaml
Office Code Pro:
  variants:
    '*':
      bold-italic: 'office-code-pro/office-code-pro-bold-italic.woff'
      bold: 'office-code-pro/office-code-pro-bold.woff'
      italic: 'office-code-pro/office-code-pro-italic.woff'
      normal: 'office-code-pro/office-code-pro.woff'
    Light:
      bold-italic: 'office-code-pro/office-code-pro-medium-italic.woff'
      bold: 'office-code-pro/office-code-pro-medium.woff'
      italic: 'office-code-pro/office-code-pro-light-italic.woff'
      normal: 'office-code-pro/office-code-pro-light.woff'
    Medium:
      bold-italic: 'office-code-pro/office-code-pro-bold-italic.woff'
      bold: 'office-code-pro/office-code-pro-bold.woff'
      italic: 'office-code-pro/office-code-pro-medium-italic.woff'
      normal: 'office-code-pro/office-code-pro-medium.woff'
```

This can be optionally simplified using advanced syntax:

```yaml
Office Code Pro:
  names:
    - Light
    - '*'
    - Medium
  bold: 2
  step: 1
  italic-template: '{dir}/{name}-italic{ext}'
  weight:
    - 'office-code-pro/office-code-pro-light.woff2'
    - 'office-code-pro/office-code-pro.woff2'
    - 'office-code-pro/office-code-pro-medium.woff2'
    - 'office-code-pro/office-code-pro-bold.woff2'
```
