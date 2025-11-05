# InDesign Skript: Selektiver PDF-Export mit Ebenenkontrolle

## Was macht das Skript?

Dieses Skript ermöglicht es dir, beim PDF-Export aus InDesign gezielt auszuwählen, welche Ebenen im finalen PDF sichtbar sein sollen und welche nicht. Das ist besonders nützlich wenn du:

- Verschiedene Versionen eines Dokuments exportieren möchtest (z.B. mit/ohne Schnittmarken)
- Entwurfsebenen oder Notizen ausblenden willst
- Mehrsprachige Dokumente hast und nur bestimmte Sprachen exportieren möchtest
- Verschiedene Varianten für unterschiedliche Kunden erstellen willst

## Installation

### Methode 1: Über den Scripts-Ordner (empfohlen)

1. **Scripts-Ordner finden:**
   - **Mac:** `~/Library/Preferences/Adobe InDesign/[Version]/[Sprache]/Scripts/Scripts Panel/`
   - **Windows:** `C:\Users\[Benutzername]\AppData\Roaming\Adobe\InDesign\[Version]\[Sprache]\Scripts\Scripts Panel\`

2. **Skript kopieren:**
   - Kopiere die Datei `InDesign_Ebenen_Export.jsx` in diesen Ordner

3. **In InDesign verfügbar machen:**
   - Öffne InDesign
   - Gehe zu `Fenster > Hilfsprogramme > Skripte` (oder `Fenster > Automatisierung > Skripte`)
   - Das Skript sollte nun in der Liste erscheinen

### Methode 2: Direktes Ausführen

1. Öffne InDesign
2. Gehe zu `Datei > Skripten > Skript ausführen...`
3. Navigiere zur Datei `InDesign_Ebenen_Export.jsx` und wähle sie aus

## Verwendung

### Schritt-für-Schritt Anleitung:

1. **Dokument öffnen:**
   - Öffne dein InDesign-Dokument, das du exportieren möchtest

2. **Skript starten:**
   - Doppelklick auf das Skript im Skripte-Panel
   - ODER: `Datei > Skripten > Skript ausführen...` und Skript auswählen

3. **Ebenen auswählen:**
   - Ein Dialog erscheint mit allen Ebenen deines Dokuments
   - Aktiviere die Checkboxen der Ebenen, die im PDF sichtbar sein sollen
   - Deaktiviere die Ebenen, die NICHT exportiert werden sollen
   - **Tipp:** Nutze die Buttons "Alle auswählen" / "Alle abwählen" für schnelle Auswahl

4. **PDF exportieren:**
   - Klicke auf "PDF exportieren"
   - Wähle Speicherort und Dateinamen
   - Klicke auf "Speichern"

5. **Fertig!**
   - Das PDF wird mit den ausgewählten Ebenen exportiert
   - Alle Ebenen in deinem Originaldokument bleiben unverändert

## Funktionen im Detail

### Automatische Wiederherstellung
- Das Skript speichert die ursprünglichen Ebenenzustände
- Nach dem Export werden alle Ebenen automatisch wieder auf ihren ursprünglichen Zustand zurückgesetzt
- Dein Dokument bleibt unverändert

### Schnellauswahl-Buttons
- **Alle auswählen:** Aktiviert alle Ebenen für den Export
- **Alle abwählen:** Deaktiviert alle Ebenen (nützlich wenn du nur 1-2 Ebenen exportieren willst)

### PDF-Vorgabe
- Das Skript verwendet standardmäßig die "High Quality Print" Vorgabe
- Falls nicht verfügbar, wird die erste verfügbare Vorgabe verwendet
- Du kannst das im Skript anpassen (siehe unten)

## Anpassungen

### PDF-Exportvorgabe ändern

Öffne die Datei `InDesign_Ebenen_Export.jsx` und suche diese Zeile (ca. Zeile 148):

```javascript
pdfPreset = app.pdfExportPresets.item("[High Quality Print]");
```

Ersetze `"[High Quality Print]"` durch eine andere Vorgabe, z.B.:
- `"[PDF/X-4:2008]"`
- `"[Press Quality]"`
- `"[Smallest File Size]"`
- Oder den Namen einer eigenen Vorgabe

### Dialog-Text anpassen

Du kannst den Text im Dialog anpassen, indem du Zeile 74 änderst:

```javascript
var dialog = new Window("dialog", "Ebenen für PDF-Export auswählen");
```

## Häufige Fehler & Lösungen

### "Bitte öffnen Sie zuerst ein InDesign-Dokument"
- **Problem:** Kein Dokument ist geöffnet
- **Lösung:** Öffne ein InDesign-Dokument vor dem Ausführen des Skripts

### "Das Dokument enthält keine Ebenen"
- **Problem:** Das Dokument hat nur die Standardebene oder keine Ebenen
- **Lösung:** Erstelle mehrere Ebenen in deinem Dokument

### "Keine PDF-Exportvorgabe gefunden"
- **Problem:** InDesign hat keine PDF-Exportvorgaben
- **Lösung:** Erstelle eine Vorgabe unter `Datei > Adobe PDF-Vorgaben > Definieren...`

### PDF wird nicht exportiert
- **Prüfe:** Hast du mindestens eine Ebene ausgewählt?
- **Prüfe:** Hast du Schreibrechte für den Zielordner?
- **Prüfe:** Ist genug Speicherplatz vorhanden?

## Tipps & Tricks

### Workflow-Optimierung
1. **Benenne Ebenen sinnvoll:** Nutze aussagekräftige Namen wie "DE Text", "EN Text", "Schnittmarken", "Notizen"
2. **Farbcodierung:** Nutze Ebenenfarben in InDesign zur besseren Übersicht
3. **Tastenkombination:** Weise dem Skript in InDesign eine Tastenkombination zu für schnellen Zugriff

### Mehrere Versionen exportieren
Wenn du mehrere Versionen exportieren möchtest:
1. Führe das Skript mehrmals aus
2. Wähle jedes Mal eine andere Ebenenkombination
3. Speichere mit unterschiedlichen Dateinamen (z.B. "Dokument_DE.pdf", "Dokument_EN.pdf")

### Batch-Export
Für wiederkehrende Exportvorgaben kannst du das Skript erweitern und die Ebenenauswahl vordefinieren.

## Technische Details

- **Dateiformat:** JavaScript für ExtendScript (.jsx)
- **Kompatibilität:** InDesign CS6 und höher
- **Sprache:** Funktioniert mit allen InDesign-Sprachversionen

## Support & Erweiterungen

Wenn du das Skript erweitern möchtest, sind hier einige Ideen:

- **Vorgaben speichern:** Häufig verwendete Ebenenkombinationen speichern
- **Batch-Export:** Mehrere vordefinierte Versionen auf einmal exportieren
- **Dateinamen-Templates:** Automatische Benennung basierend auf ausgewählten Ebenen
- **Exportformat-Auswahl:** Zusätzlich JPEG, PNG etc. anbieten

Viel Erfolg mit deinem ersten InDesign-Skript!
