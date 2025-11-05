# InDesign Layer Export Script

Ein InDesign-Skript für selektiven PDF-Export mit Ebenenkontrolle.

## Übersicht

Dieses Skript ermöglicht es, beim PDF-Export aus Adobe InDesign gezielt auszuwählen, welche Ebenen im finalen PDF sichtbar sein sollen. Perfekt für:

- Mehrsprachige Dokumente (verschiedene Sprachversionen exportieren)
- Kundenvarianten (verschiedene Versionen für unterschiedliche Kunden)
- Druck vs. Digital (mit/ohne Schnittmarken, Anschnitt, etc.)
- Entwürfe (mit/ohne Notizen, Kommentare, Hilfslinien)

## Features

✅ **Interaktiver Dialog** zur Ebenenauswahl
✅ **Automatische Wiederherstellung** der ursprünglichen Ebenenzustände
✅ **Unterstützung für gesperrte Ebenen**
✅ **Schnellauswahl-Buttons** (Alle auswählen / Alle abwählen)
✅ **Kompatibel mit InDesign CS6 und höher**
✅ **Sprachunabhängig** (funktioniert mit allen InDesign-Sprachversionen)

## Installation

### Methode 1: Scripts-Ordner (empfohlen)

Kopiere `InDesign_Ebenen_Export.jsx` in den InDesign Scripts-Ordner:

**macOS:**
```
~/Library/Preferences/Adobe InDesign/[Version]/[Sprache]/Scripts/Scripts Panel/
```

**Windows:**
```
C:\Users\[Benutzername]\AppData\Roaming\Adobe\InDesign\[Version]\[Sprache]\Scripts\Scripts Panel\
```

Nach der Installation erscheint das Skript im Skripte-Panel (`Fenster > Hilfsprogramme > Skripte`).

### Methode 2: Direktes Ausführen

1. `Datei > Skripten > Skript ausführen...`
2. Navigiere zu `InDesign_Ebenen_Export.jsx`
3. Ausführen

## Verwendung

1. **InDesign-Dokument öffnen** mit mehreren Ebenen
2. **Skript ausführen** (siehe Installation)
3. **Ebenen auswählen** im Dialog (Checkboxen aktivieren für sichtbare Ebenen)
4. **"PDF exportieren"** klicken
5. **Speicherort wählen** und speichern
6. **Fertig!** Alle Ebenen werden automatisch wieder auf den ursprünglichen Zustand zurückgesetzt

## Dateien

- **`InDesign_Ebenen_Export.jsx`** - Das Hauptskript (produktiv)
- **`InDesign_Ebenen_Export_TEST.jsx`** - Debug-Version mit erweiterten Tests
- **`ANLEITUNG.md`** - Ausführliche Dokumentation mit Troubleshooting

## Test-Version

Die TEST-Version enthält:
- Umgebungstest (schreibt Systeminfo auf den Desktop)
- Debug-Dialoge bei jedem Schritt
- API-Kompatibilitätstests
- Hilfreich bei Problemen oder für neue InDesign-Versionen

## Technische Details

- **Sprache:** JavaScript für Adobe ExtendScript (.jsx)
- **Kompatibilität:** InDesign CS6, CC 2014-2025
- **API:** Adobe InDesign ExtendScript DOM
- **Getestet mit:** InDesign CC 2024/2025

## Anpassungen

Das Skript kann einfach angepasst werden:

### PDF-Exportvorgabe ändern
Siehe [ANLEITUNG.md](ANLEITUNG.md#pdf-exportvorgabe-ändern) - Zeile 192-196

### Dialog-Text ändern
Siehe [ANLEITUNG.md](ANLEITUNG.md#dialog-text-anpassen) - Zeile 87

### Ebenen als PDF-Layers exportieren
Zeile 213 aktivieren: `app.pdfExportPreferences.exportLayers = true;`

## Häufige Probleme

### Skript funktioniert nicht
1. Teste zuerst die `InDesign_Ebenen_Export_TEST.jsx` Version
2. Prüfe die generierte Testdatei auf dem Desktop
3. Siehe [ANLEITUNG.md](ANLEITUNG.md#häufige-fehler--lösungen) für Details

### PDF enthält falsche Ebenen
- Das Skript setzt `exportWhichLayers = VISIBLE_PRINTABLE_LAYERS`
- Nur Ebenen, die als "visible" UND "printable" markiert sind, werden exportiert

### Ebenen können nicht geändert werden
- Gesperrte Ebenen werden automatisch temporär entsperrt
- Falls Fehler auftreten, zeigt das Skript eine Warnung an

## Lizenz

Open Source - frei verwendbar und anpassbar.

## Support

Für detaillierte Anleitungen siehe [ANLEITUNG.md](ANLEITUNG.md).

---

**Erstellt mit Claude Code**
