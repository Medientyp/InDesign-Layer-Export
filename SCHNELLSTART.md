# InDesign Layer Export - Schnellstart

## So verwendest du das Skript:

### Option A: Direktes Ausführen (einfachste Methode)

1. **InDesign öffnen** und Dokument mit mehreren Ebenen laden
2. Menü: **Datei > Skripten > Skript ausführen...**
3. Navigiere zu: **InDesign_Ebenen_Export.jsx**
4. **Öffnen** klicken
5. Im Dialog die gewünschten Ebenen auswählen
6. **"PDF exportieren"** klicken
7. Speicherort wählen → Fertig!

### Option B: Installation im Scripts Panel

1. **Skript-Datei kopieren:**
   - Kopiere `InDesign_Ebenen_Export.jsx`
   - Mac: `~/Library/Preferences/Adobe InDesign/[Version]/[Sprache]/Scripts/Scripts Panel/`
   - Windows: `C:\Users\[Name]\AppData\Roaming\Adobe\InDesign\[Version]\[Sprache]\Scripts\Scripts Panel\`

2. **InDesign neu starten** (falls schon offen)

3. **Skripte-Panel öffnen:**
   - Menü: `Fenster > Hilfsprogramme > Skripte`

4. **Doppelklick** auf `InDesign_Ebenen_Export.jsx` unter "User"

5. Fertig!

## Beispiel-Workflow

**Szenario:** Du hast ein mehrsprachiges Dokument mit deutschen und englischen Textebenen.

1. Dokument öffnen mit Ebenen:
   - "Text DE"
   - "Text EN"
   - "Bilder"
   - "Schnittmarken"

2. **Deutsche Version exportieren:**
   - Skript ausführen
   - Auswählen: ☑ Text DE, ☑ Bilder, ☐ Text EN, ☐ Schnittmarken
   - Exportieren als: `Broschure_DE.pdf`

3. **Englische Version exportieren:**
   - Skript nochmal ausführen
   - Auswählen: ☐ Text DE, ☑ Bilder, ☑ Text EN, ☐ Schnittmarken
   - Exportieren als: `Broschure_EN.pdf`

4. **Druckversion mit Schnittmarken:**
   - Skript nochmal ausführen
   - Auswählen: ☑ Text DE, ☑ Bilder, ☐ Text EN, ☑ Schnittmarken
   - Exportieren als: `Broschure_DE_Print.pdf`

## Erster Test

Probiere zuerst die TEST-Version:
1. Führe `InDesign_Ebenen_Export_TEST.jsx` aus
2. Es erstellt eine Datei auf dem Desktop: `InDesign_Skript_Test.txt`
3. Diese Datei zeigt alle System-Infos und ob alles funktioniert

## Probleme?

- **"Keine PDF-Exportvorgabe gefunden"** → Erstelle eine PDF-Vorgabe in InDesign
- **Skript macht nichts** → Teste die TEST-Version und schau dir die Textdatei an
- **Ebenen werden nicht exportiert** → Prüfe ob Ebenen als "druckbar" markiert sind

Mehr Details in: [ANLEITUNG.md](ANLEITUNG.md)
