"""
Writes the app's fonts to src/assets/fonts/, cut down to the characters the app shows.

The Google Fonts files also carry Greek, Cyrillic and Vietnamese, which the app never shows;
dropping them makes the fonts several times smaller, which matters on the web, where they
download before the first screen. Every OpenType feature is kept (Arabic letter joining,
Playfair's lining figures).

Run after changing a font or adding text in a new script:
    python3 scripts/subset-fonts.py        (needs `pip install fonttools`)
Then check every character the app uses is covered: the script prints any that are missing.
"""

import pathlib
import re

from fontTools import subset
from fontTools.ttLib import TTFont

ROOT = pathlib.Path(__file__).resolve().parent.parent
SOURCES = ROOT / 'node_modules' / '@expo-google-fonts'
OUT = ROOT / 'src' / 'assets' / 'fonts'

# Google Fonts' "latin" range: ASCII, Latin-1 (é, ç, °, ·), general punctuation (’ – — •), €, ™.
LATIN = (
    'U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,'
    'U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD'
)
# Arabic letters, marks and presentation forms, plus the joiners that control letter shapes.
ARABIC = 'U+0600-06FF,U+0750-077F,U+0870-08FF,U+FB50-FDFF,U+FE70-FEFF,U+200C-200F'

FONTS = {
    'playfair-display/400Regular/PlayfairDisplay_400Regular.ttf': LATIN,
    'playfair-display/700Bold/PlayfairDisplay_700Bold.ttf': LATIN,
    'montserrat/300Light/Montserrat_300Light.ttf': LATIN,
    'open-sans/700Bold/OpenSans_700Bold.ttf': LATIN,
    'nunito-sans/400Regular/NunitoSans_400Regular.ttf': LATIN,
    'nunito-sans/500Medium/NunitoSans_500Medium.ttf': LATIN,
    'nunito-sans/600SemiBold/NunitoSans_600SemiBold.ttf': LATIN,
    'nunito-sans/700Bold/NunitoSans_700Bold.ttf': LATIN,
    # Arabic text also contains Latin digits, unit codes ("A-304") and punctuation.
    'ibm-plex-sans-arabic/300Light/IBMPlexSansArabic_300Light.ttf': f'{ARABIC},{LATIN}',
    'ibm-plex-sans-arabic/400Regular/IBMPlexSansArabic_400Regular.ttf': f'{ARABIC},{LATIN}',
    'ibm-plex-sans-arabic/500Medium/IBMPlexSansArabic_500Medium.ttf': f'{ARABIC},{LATIN}',
    'ibm-plex-sans-arabic/600SemiBold/IBMPlexSansArabic_600SemiBold.ttf': f'{ARABIC},{LATIN}',
    'ibm-plex-sans-arabic/700Bold/IBMPlexSansArabic_700Bold.ttf': f'{ARABIC},{LATIN}',
}


def app_characters() -> set[str]:
    """Every non-ASCII character in the app's string literals, to check coverage."""
    chars: set[str] = set()
    for path in (ROOT / 'src').rglob('*.ts*'):
        for literal in re.findall(r"'((?:[^'\\\n]|\\.)*)'|`([^`]*)`", path.read_text('utf-8')):
            chars.update(c for c in ''.join(literal) if ord(c) > 0x7E)
    return chars


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    used = app_characters()
    arabic_used = {c for c in used if '؀' <= c <= 'ۿ'}
    for source, unicodes in FONTS.items():
        src = SOURCES / source
        dst = OUT / src.name
        options = subset.Options()
        options.layout_features = ['*']
        options.name_IDs = ['*']
        options.glyph_names = False
        options.notdef_outline = True
        font = subset.load_font(str(src), options)
        subsetter = subset.Subsetter(options)
        subsetter.populate(unicodes=subset.parse_unicodes(unicodes))
        subsetter.subset(font)
        subset.save_font(font, str(dst), options)

        cmap = TTFont(dst).getBestCmap()
        # Latin faces must cover the app's non-Arabic characters; Arabic faces all of them.
        needed = used if 'Arabic' in src.name else used - arabic_used
        missing = sorted(c for c in needed if ord(c) not in cmap and not 'ً' <= c <= 'ْ')
        before, after = src.stat().st_size / 1024, dst.stat().st_size / 1024
        note = f'  MISSING: {"".join(missing)!r}' if missing else ''
        print(f'{before:6.0f} KB -> {after:5.0f} KB  {dst.name}{note}')


if __name__ == '__main__':
    main()
