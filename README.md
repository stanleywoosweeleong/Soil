# Sains Tanah · Soil Science · 土壤科学

A soil field guide in Bahasa Melayu, English and Chinese, built from the topics of Chapter 1 (Sains Tanah).

- **Guide**: seven units in the order the work is done in the field: know your soil, soil properties, reading a site, protecting soil, improving soil, feeding crops, then oil palm and fruit trees. Each unit ends with a practical activity and a quiz.
- **Tools**: USDA soil texture triangle (with jar-test input), soil pH explorer with crop targets and a lime estimate, slope calculator, nutrient deficiency key, fertiliser calculator (straight, compound, per plant, tree programme, bag contents and cost).
- **Glossary**: searchable terms shown in all three languages.
- **Textbook index**: maps the lecture-note section numbers (1.1 to 1.3.2) to the guide.

No build step. Open `index.html`, or serve the folder:

    python3 -m http.server 8000

Content lives in `js/content.js` (interface text, tool data, sources) `js/units.js` (units, lessons, activities, quizzes, glossary) and `js/crops.js` (the crop unit and its tool data). Each text is a tuple `[ms, en, zh]`; to add a language, add it to `LANGS` and append one entry to each tuple (missing entries fall back to English). References are listed on the Sources page of the app.
