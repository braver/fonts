## 3.9.0

### New font

-   Office Code Pro D, the Office Code variant with dotted zero


### Other

-   Use more consistent order for fonts in font selection and package settings windows. 

## 3.8.0

### New font

-   Victor Mono, with both oblique and true italic faces.

### Maintenance

-   Generator script became smarter. For one, it doesn't count
    font variants as different fonts anymore. For two, defining
    font families with a lot of variants became easier. See contribution
    guide for a more or less comprehensive description.

## 3.7.2

-   Fix cascadia code style

## 3.7.1

-   Compress cascadia-code to woff2

## 3.7.0

-   Add Microsoft Cascadia Code

## 3.6.0

-   Bump FiraCode to v2, add FiraCode Retina

## 3.5.0

### New font

With many thanks to [Sighery](https://github.com/Sighery)

-   Fantasque Sans Mono variant without loop k

## 3.4.0

### New fonts

With many thanks to [vekuda](https://github.com/vekuda)

-   CatV 6x12 9
-   CMU Typewriter Text
-   Corbi Mono S
-   Fairfax HD
-   Kawkab Mono
-   Kawkab Mono Light
-   Libertinus Mono
-   Meyrin
-   Monodeco
-   Monodeco Light

### Updated fonts

-   Updated IBM 3270 font to v2.0.0 (also, name it correctly)

    **Notice:** '3270' font face has been renamed to 'IBM 3270'. If you used
    '3270' then your config should be updated automatically. If it isn't,
    however, just open font selector (or fonts package config) and select
    'IBM 3270' font-face.

-   Fixed Source Code Pro bold weights in Light and Medium variants

### New features

-   Interactive font selector. Now you don't have to go into package settings
    to try out new fonts. Access through "Packages" → "Fonts" → "Open Font
    Selector" menu option, or by running `fonts:open-font-selector` command (
    e.g. from command palette)

### Other changes

-   Convert all fonts to woff2

    This dramatically reduces resources size at the cost of a slightly more
    processing overhead when loading fonts. Keeping your data limit safe.

### Maintenance

-   Case-insensitive sort for fonts in settings, readme and fonts.less
-   Put precise number of fonts in readme
-   Added specs (checks if all fonts can be loaded, are rendered correctly, and
    are used in TextEditor)
-   Fix OpenDyslexic license

## 3.3.0

### New fonts

With many thanks to [vekuda](https://github.com/vekuda)

-   agave
-   APL2741
-   APL385 Unicode
-   B612 Mono
-   Bedstead
-   Bedstead Condensed
-   Bedstead Extended
-   Bedstead Extra Condensed
-   Bedstead Ultra Condensed
-   DaddyTimeMono
-   DejaVu Sans Mono - Bront
-   iA Writer Mono S
-   OpenDyslexicMono
-   Press Start 2P
-   Ubuntu Mono - Bront

### Updated fonts

-   BPMono

### General maintenance

-   Added yaml font description generator
-   Removed broken link from README

## 3.2.0

### New fonts

-   Borg Sans Mono (Marnen Laibow-Koser)

### Updated fonts

-   FiraCode updated from 1.205 to 1.206

### Fixes

Fixed CSS styles for the following fonts:

-   Plex Mono
-   Average Mono bold-italic

### General maintenance

-   Added FiraCode license
-   Added contribution guide and PR template
-   Cleaned-up styles
-   Sorted fonts list in config schema

### README updates

-   We have over 70 fonts now! (Marnen Laibow-Koser)
-   List all fonts (generated)
-   Fix formatting

## 3.1.0

-   Use atom.styles to set CSS style
-   Fix resource disposal on deactivation
-   Rewrite in pure JavaScript
-   Move main style to separate stylesheet
-   resources: Update firacode to 1.205 From 1.204 (Chinmay Kunkikar)
-   add courier prime, - code, fixedsys, league, noto, plex

## 3.0.3

-   fix #63 update hasklig fonts to 1.1

## 3.0.2

-   reduce likelihood of variable collision

## 3.0.1

-   fix #60 quote font names for safety

## 3.0.0

-   set fonts with var() and add secondary fonts
-   fix #54 restore font fixer

## 2.1.0

-   add terminus

## 2.0.0

-   fix #37 add dotted and slashed zeroes for Droid Sans
-   fix #19 add hasklig light and medium
-   add overpass and space fonts
-   there is no bold nova
-   fix #29 add luculent
-   fix #46 update firacode
-   Bump required Atom version to v1.13 (Lee Dohm)
-   Remove references to ::shadow (Lee Dohm)

## 1.8.0

-   revert readme
-   Create clean, repeatable activation and deactivation (Lee Dohm)
-   Remove unused state parameter from activate method (Lee Dohm)
-   Migrate config schema to package.json (Lee Dohm)
-   Update README.md
-   adds Go Mono (Clifton Kaznocha)

## 1.7.0

-   fix #34 update firacode
-   fix #39 use fixedsys excelsior
-   fix #40 fix stylesheet for 3270 and camingocode
-   add FiraCode Light (blaqbern)
-   update FiraCode to 1.200 (blaqbern)

## 1.6.0

-   updated files for mononoki
-   new files for hack and fantasque
-   adds 3270 font
-   Renamed firacode regular

## 1.5.0

-   Added SK Modernist Mono

## 1.4.0

-   Added Fixedsys Excelsior with ligatures!

## 1.3.0 - a7madgamal and opatel99

-   Added Mononoki

## 1.2.0

-   Added Camingocode

## 1.1.0

-   Added Iosevka

## 1.0.0

-   Ligatures are here! Hasklig, FiraCode and Monoid are now included and the appropriate text-rendering styles are set automatically.

## 0.7.0

-   Added a version of Gohu that actually works (and looks awesome!)

## 0.6.0

-   Updated Source Code Pro with the new release, adding true italics
-   Added Code New Roman and Office Code Pro

## 0.5.0

-   Added Hack and Roboto Mono

## 0.4.0

-   Immediately see the font in effect in a preview editor.mini

## 0.3.0 - More weights, select from a list

-   Source Code Pro in Light, Extra Light and Medium
-   M+ in Light, Thin and Medium
-   Latin Modern and Hermit in Light
-   Measurements now fully fixed
-   Easily pick from a list of fonts in Settings

## 0.2.0 - Measurements fixes

-   Measurements are fixed in most cases now, bold and italic still fail sometimes

## 0.1.2 - Stephen G. Hartke

-   Added Aurulent Sans and Verily Serif

## 0.1.1 - Fixedsys

-   Added Fixedsys
-   Link to programmingfonts.org

## 0.1.0 - First Release

-   All fonts I could find added
-   Documented and mostly tested
