# Sains Tanah · Soil Science · 土壤科学

A soil field guide in Bahasa Melayu, English and Chinese, built from the topics of Chapter 1 (Sains Tanah).

- **Guide**: seven units in the order the work is done in the field: know your soil, soil properties, reading a site, protecting soil, improving soil, feeding crops, then oil palm, selected fruit trees and paddy. Each unit ends with a practical activity and a quiz.
- **Tools**: USDA soil texture triangle (with jar-test input), soil pH explorer with guide ranges per crop (it gives no lime rate; that needs a laboratory lime requirement), slope calculator, nutrient deficiency key, fertiliser calculator (straight, compound, per plant, tree programme, bag contents and cost).
- **Records**: a per-plot field record. Save texture, pH, slope and fertiliser results from the tools, add notes, keep the grade, cost and organic flag of each application, see nutrients and cost applied per plot and year, export a plot as CSV, and back up or restore everything as a JSON file. Data stays in the browser on the device.
- **Search**: one box on the home page searches lessons, practicals, tools and the glossary in any of the three languages, with aliases such as gambut / peat / 泥炭土.
- **Glossary**: searchable terms shown in all three languages.
- **Textbook index**: maps the lecture-note section numbers (1.1 to 1.3.2) to the guide.

No build step. Open `index.html`, or serve the folder:

    python3 -m http.server 8000

Code is split by job: `js/calc.js` (calculations, pure functions), `js/store.js` (validation of everything read from storage or a backup) and `js/app.js` (pages and events). Run the automated checks with:

    node tests/run.js

They cover the calculations, record validation, the bugs found in review, and content integrity in all three languages. The deploy workflow runs them first and does not publish if they fail.

Content lives in `js/content.js` (interface text, tool data, sources) `js/units.js` (units, lessons, activities, quizzes, glossary) and `js/crops.js` (the crop unit and its tool data). Each text is a tuple `[ms, en, zh]`; to add a language, add it to `LANGS` and append one entry to each tuple (missing entries fall back to English). References are listed on the Sources page of the app.

Numbers in the lessons are teaching examples. Each carries a source line saying where it came from and where it applies; crop fertiliser tables are published examples, not field recommendations.

The app opens in light mode and has a switch for dark mode in the header; the choice is remembered and does not follow the device setting. Icons are in `icons/`, drawn from `icon.svg` and `icons/icon-maskable.svg`.

## Publishing

Push to `main`; GitHub Pages publishes in a minute or two. There is no cache version to bump. Installed copies open from the saved version, check for changes in the background, and show a "new version is ready" bar with a Refresh button when any app file has changed.

On first launch the app asks for a language (Bahasa Melayu, English or 中文) and remembers the choice until it is changed from the header.
