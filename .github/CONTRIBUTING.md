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

### `scripts/fonts.yaml` format

`fonts.yaml` is a YAML object. The object property names are full font names.
Property values are YAML objects with the following properties:

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

For the Light version,

```yaml
Office Code Pro Light:
  bold-italic: 'office-code-pro/office-code-pro-medium-italic.woff'
  bold: 'office-code-pro/office-code-pro-medium.woff'
  italic: 'office-code-pro/office-code-pro-light-italic.woff'
  normal: 'office-code-pro/office-code-pro-light.woff'
```

And for the Medium version:

```yaml
Office Code Pro Medium:
  bold-italic: 'office-code-pro/office-code-pro-bold-italic.woff'
  bold: 'office-code-pro/office-code-pro-bold.woff'
  italic: 'office-code-pro/office-code-pro-medium-italic.woff'
  normal: 'office-code-pro/office-code-pro-medium.woff'
```
