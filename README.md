# Sains Tanah · Soil Science · 土壤科学

A study app for Chapter 1 (Sains Tanah) in Bahasa Melayu, English and Chinese.

- **Notes** for 1.1 Soil, 1.2 Soil Conservation and 1.3 Fertilisers, following the lecture-note contents page
- **Tools**: USDA soil texture triangle (with jar-test input), soil pH explorer, fertiliser calculator
- **Quiz**: a reflection checklist and a Jana Minda quiz per chapter

No build step. Open `index.html`, or serve the folder:

    python3 -m http.server 8000

Content lives in `js/content.js`. Each text is a tuple `[ms, en, zh]`; to add a language, add it to `LANGS` and append one entry to each tuple (missing entries fall back to English). References are listed on the Sources page of the app.
