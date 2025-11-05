/*
 * TEST-VERSION: InDesign Skript: Selektiver PDF-Export mit Ebenenkontrolle
 *
 * Diese Version enthält zusätzliches Debug-Logging zum Testen
 */

#target indesign

// Test-Funktion die alle verfügbaren Konstanten und Einstellungen anzeigt
function testEnvironment() {
    var msg = "=== InDesign ExtendScript Umgebungstest ===\n\n";

    // InDesign Version
    msg += "InDesign Version: " + app.version + "\n";
    msg += "InDesign Name: " + app.name + "\n\n";

    // Dokument Info
    if (app.documents.length > 0) {
        var doc = app.activeDocument;
        msg += "Aktives Dokument: " + doc.name + "\n";
        msg += "Anzahl Ebenen: " + doc.layers.length + "\n\n";

        // Ebenen auflisten
        msg += "--- Ebenen ---\n";
        for (var i = 0; i < doc.layers.length; i++) {
            var layer = doc.layers[i];
            msg += (i + 1) + ". " + layer.name +
                   " (visible: " + layer.visible +
                   ", printable: " + layer.printable +
                   ", locked: " + layer.locked + ")\n";
        }
        msg += "\n";
    } else {
        msg += "KEIN Dokument geöffnet!\n\n";
    }

    // PDF Export Presets
    msg += "--- PDF Export Presets ---\n";
    msg += "Anzahl: " + app.pdfExportPresets.length + "\n";
    for (var i = 0; i < app.pdfExportPresets.length; i++) {
        msg += (i + 1) + ". " + app.pdfExportPresets[i].name + "\n";
    }
    msg += "\n";

    // ExportFormat Konstanten testen
    msg += "--- ExportFormat Konstanten ---\n";
    try {
        msg += "ExportFormat.PDF_TYPE = " + ExportFormat.PDF_TYPE + "\n";
    } catch (e) {
        msg += "ExportFormat.PDF_TYPE: FEHLER - " + e.message + "\n";
    }
    try {
        msg += "ExportFormat.pdfType = " + ExportFormat.pdfType + "\n";
    } catch (e) {
        msg += "ExportFormat.pdfType: FEHLER - " + e.message + "\n";
    }
    msg += "\n";

    // ExportLayerOptions testen
    msg += "--- ExportLayerOptions Konstanten ---\n";
    try {
        msg += "ExportLayerOptions.ALL_LAYERS = " + ExportLayerOptions.ALL_LAYERS + "\n";
    } catch (e) {
        msg += "ExportLayerOptions.ALL_LAYERS: FEHLER - " + e.message + "\n";
    }
    try {
        msg += "ExportLayerOptions.VISIBLE_LAYERS = " + ExportLayerOptions.VISIBLE_LAYERS + "\n";
    } catch (e) {
        msg += "ExportLayerOptions.VISIBLE_LAYERS: FEHLER - " + e.message + "\n";
    }
    try {
        msg += "ExportLayerOptions.VISIBLE_PRINTABLE_LAYERS = " + ExportLayerOptions.VISIBLE_PRINTABLE_LAYERS + "\n";
    } catch (e) {
        msg += "ExportLayerOptions.VISIBLE_PRINTABLE_LAYERS: FEHLER - " + e.message + "\n";
    }
    msg += "\n";

    // Aktuelle PDF Export Einstellungen
    msg += "--- Aktuelle PDF Export Einstellungen ---\n";
    try {
        msg += "exportWhichLayers = " + app.pdfExportPreferences.exportWhichLayers + "\n";
    } catch (e) {
        msg += "exportWhichLayers: FEHLER - " + e.message + "\n";
    }
    try {
        msg += "exportLayers = " + app.pdfExportPreferences.exportLayers + "\n";
    } catch (e) {
        msg += "exportLayers: FEHLER - " + e.message + "\n";
    }

    return msg;
}

// Hauptfunktion
function main() {
    // SCHRITT 1: Umgebungstest
    var testResult = testEnvironment();

    // Test-Ergebnis in Datei schreiben
    var testFile = new File("~/Desktop/InDesign_Skript_Test.txt");
    testFile.open("w");
    testFile.write(testResult);
    testFile.close();

    alert("Umgebungstest abgeschlossen!\n\nDie Ergebnisse wurden gespeichert:\n" + testFile.fsName + "\n\nBitte prüfe diese Datei und sende mir die Informationen.");

    // Prüfen ob ein Dokument geöffnet ist
    if (app.documents.length === 0) {
        alert("STOP: Bitte öffne zuerst ein InDesign-Dokument mit mehreren Ebenen.");
        return;
    }

    var doc = app.activeDocument;

    // Prüfen ob Ebenen vorhanden sind
    if (doc.layers.length === 0) {
        alert("STOP: Das Dokument enthält keine Ebenen.");
        return;
    }

    if (doc.layers.length < 2) {
        alert("HINWEIS: Das Dokument hat nur eine Ebene. Für den Test wären mehrere Ebenen besser.");
    }

    // SCHRITT 2: Wirklich exportieren?
    var doExport = confirm("Möchtest du jetzt einen Test-Export durchführen?\n\n" +
                          "Das Skript wird:\n" +
                          "1. Einen Dialog mit allen Ebenen anzeigen\n" +
                          "2. Die ausgewählten Ebenen für den Export vorbereiten\n" +
                          "3. Ein PDF exportieren\n" +
                          "4. Alle Ebenen wieder auf ihren ursprünglichen Zustand zurücksetzen");

    if (!doExport) {
        alert("Test abgebrochen. Die Testdatei auf dem Desktop enthält trotzdem nützliche Informationen.");
        return;
    }

    // SCHRITT 3: Normaler Export-Ablauf
    // Aktuelle Ebenenzustände speichern
    var originalLayerStates = saveLayerStates(doc);
    alert("DEBUG: Original-Zustände gespeichert für " + originalLayerStates.length + " Ebenen");

    // Dialog zur Ebenenauswahl anzeigen
    var selectedLayers = showLayerSelectionDialog(doc);

    if (selectedLayers === null) {
        alert("Export abgebrochen.");
        return;
    }

    // Debug-Info über Auswahl
    var selectedCount = 0;
    for (var i = 0; i < selectedLayers.length; i++) {
        if (selectedLayers[i]) selectedCount++;
    }
    alert("DEBUG: " + selectedCount + " von " + selectedLayers.length + " Ebenen ausgewählt");

    // Ebenen entsprechend der Auswahl ein-/ausblenden
    setLayerVisibility(doc, selectedLayers);
    alert("DEBUG: Ebenensichtbarkeit gesetzt");

    // PDF-Export durchführen
    var exportSuccess = exportPDF(doc);

    // Ursprüngliche Ebenenzustände wiederherstellen
    restoreLayerStates(doc, originalLayerStates);
    alert("DEBUG: Original-Zustände wiederhergestellt");

    if (exportSuccess) {
        alert("✓ TEST ERFOLGREICH!\n\nPDF wurde exportiert und alle Ebenen wurden zurückgesetzt.");
    } else {
        alert("⚠ Export wurde abgebrochen oder ist fehlgeschlagen.");
    }
}

// Speichert die aktuellen Sichtbarkeits- und Druckzustände aller Ebenen
function saveLayerStates(doc) {
    var states = [];
    for (var i = 0; i < doc.layers.length; i++) {
        states.push({
            layer: doc.layers[i],
            visible: doc.layers[i].visible,
            printable: doc.layers[i].printable,
            locked: doc.layers[i].locked
        });
    }
    return states;
}

// Stellt die ursprünglichen Ebenenzustände wieder her
function restoreLayerStates(doc, states) {
    for (var i = 0; i < states.length; i++) {
        try {
            states[i].layer.locked = states[i].locked;
            states[i].layer.visible = states[i].visible;
            states[i].layer.printable = states[i].printable;
        } catch (e) {
            alert("FEHLER beim Wiederherstellen von Ebene " + (i+1) + ": " + e.message);
        }
    }
}

// Zeigt einen Dialog zur Auswahl der zu exportierenden Ebenen
function showLayerSelectionDialog(doc) {
    var dialog = new Window("dialog", "TEST: Ebenen für PDF-Export auswählen");
    dialog.orientation = "column";
    dialog.alignChildren = ["fill", "top"];
    dialog.spacing = 10;
    dialog.margins = 16;

    // Informationstext
    var infoGroup = dialog.add("group");
    var infoText = infoGroup.add("statictext", undefined, "Wähle die Ebenen aus, die im PDF sichtbar sein sollen:", {multiline: true});
    infoText.preferredSize.width = 400;

    // Scrollbare Liste für Ebenen
    var layerPanel = dialog.add("panel", undefined, "Ebenen (" + doc.layers.length + " insgesamt)");
    layerPanel.orientation = "column";
    layerPanel.alignChildren = ["left", "top"];
    layerPanel.spacing = 5;
    layerPanel.margins = 10;

    var layerCheckboxes = [];

    // Checkbox für jede Ebene erstellen (von oben nach unten wie in InDesign)
    for (var i = doc.layers.length - 1; i >= 0; i--) {
        var layer = doc.layers[i];
        var layerInfo = layer.name + " (v:" + layer.visible + " p:" + layer.printable + " l:" + layer.locked + ")";
        var checkbox = layerPanel.add("checkbox", undefined, layerInfo);
        checkbox.value = layer.visible && layer.printable; // Standard: nur wenn beides true ist
        layerCheckboxes.push({
            checkbox: checkbox,
            layerIndex: i
        });
    }

    // Schnellauswahl-Buttons
    var quickSelectGroup = dialog.add("group");
    quickSelectGroup.orientation = "row";
    quickSelectGroup.alignChildren = ["left", "center"];
    quickSelectGroup.spacing = 10;

    var selectAllBtn = quickSelectGroup.add("button", undefined, "Alle auswählen");
    selectAllBtn.onClick = function() {
        for (var i = 0; i < layerCheckboxes.length; i++) {
            layerCheckboxes[i].checkbox.value = true;
        }
    };

    var deselectAllBtn = quickSelectGroup.add("button", undefined, "Alle abwählen");
    deselectAllBtn.onClick = function() {
        for (var i = 0; i < layerCheckboxes.length; i++) {
            layerCheckboxes[i].checkbox.value = false;
        }
    };

    // Trennlinie
    dialog.add("panel", undefined, "", {borderStyle: "black"});

    // Buttons
    var buttonGroup = dialog.add("group");
    buttonGroup.orientation = "row";
    buttonGroup.alignChildren = ["right", "center"];
    buttonGroup.spacing = 10;

    var cancelBtn = buttonGroup.add("button", undefined, "Abbrechen", {name: "cancel"});
    var okBtn = buttonGroup.add("button", undefined, "PDF exportieren", {name: "ok"});

    // Dialog anzeigen
    if (dialog.show() == 1) {
        // OK wurde geklickt - ausgewählte Ebenen zurückgeben
        var selectedLayers = [];
        for (var i = 0; i < layerCheckboxes.length; i++) {
            selectedLayers[layerCheckboxes[i].layerIndex] = layerCheckboxes[i].checkbox.value;
        }
        return selectedLayers;
    } else {
        // Abbrechen
        return null;
    }
}

// Setzt die Sichtbarkeit und Druckbarkeit der Ebenen
function setLayerVisibility(doc, selectedLayers) {
    for (var i = 0; i < doc.layers.length; i++) {
        try {
            var shouldBeVisible = selectedLayers[i];
            var layer = doc.layers[i];

            // Gesperrte Ebenen temporär entsperren
            var wasLocked = layer.locked;
            if (wasLocked) {
                layer.locked = false;
            }

            // Sichtbarkeit und Druckbarkeit setzen
            layer.visible = shouldBeVisible;
            layer.printable = shouldBeVisible;

            // Sperre wiederherstellen
            if (wasLocked) {
                layer.locked = true;
            }
        } catch (e) {
            alert("WARNUNG: Ebene '" + doc.layers[i].name + "' konnte nicht geändert werden.\n" + e.message);
        }
    }
}

// Führt den PDF-Export durch
function exportPDF(doc) {
    try {
        // Dateinamen und Speicherort abfragen
        var defaultName = doc.name.replace(/\.[^\.]+$/, "") + "_TEST.pdf";
        var saveFile = File.saveDialog("TEST-PDF speichern unter", "PDF-Dateien:*.pdf");

        if (!saveFile) {
            return false;
        }

        // Sicherstellen dass die Dateiendung .pdf ist
        if (!/\.pdf$/i.test(saveFile.name)) {
            saveFile = new File(saveFile.fullName + ".pdf");
        }

        // PDF-Exportvorgabe finden
        var pdfPreset = null;
        var presetName = "";

        // Verschiedene Namen ausprobieren
        var presetNames = [
            "High Quality Print",
            "[High Quality Print]",
            "Hohe Qualität",
            "[Hohe Qualität]",
            "Press Quality",
            "[Press Quality]",
            "Druckausgabequalität",
            "[Druckausgabequalität]"
        ];

        for (var i = 0; i < presetNames.length; i++) {
            try {
                pdfPreset = app.pdfExportPresets.item(presetNames[i]);
                presetName = presetNames[i];
                break;
            } catch (e) {
                // Nächsten Namen probieren
            }
        }

        // Falls keiner gefunden wurde, erste Vorgabe verwenden
        if (pdfPreset === null && app.pdfExportPresets.length > 0) {
            pdfPreset = app.pdfExportPresets[0];
            presetName = pdfPreset.name;
        }

        if (pdfPreset === null) {
            alert("FEHLER: Keine PDF-Exportvorgabe gefunden!");
            return false;
        }

        alert("DEBUG: Verwende PDF-Preset: " + presetName);

        // KRITISCH: PDF-Export-Einstellungen setzen
        try {
            app.pdfExportPreferences.exportWhichLayers = ExportLayerOptions.VISIBLE_PRINTABLE_LAYERS;
            alert("DEBUG: exportWhichLayers gesetzt auf VISIBLE_PRINTABLE_LAYERS");
        } catch (e) {
            alert("WARNUNG: Konnte exportWhichLayers nicht setzen:\n" + e.message);
        }

        // PDF exportieren
        try {
            doc.exportFile(ExportFormat.PDF_TYPE, saveFile, false, pdfPreset);
            alert("DEBUG: exportFile aufgerufen mit PDF_TYPE");
        } catch (e1) {
            // Fallback: Versuche mit pdfType (Kleinbuchstaben)
            try {
                doc.exportFile(ExportFormat.pdfType, saveFile, false, pdfPreset);
                alert("DEBUG: exportFile aufgerufen mit pdfType (Fallback)");
            } catch (e2) {
                alert("FEHLER beim Export:\nVersuch 1: " + e1.message + "\n\nVersuch 2: " + e2.message);
                return false;
            }
        }

        return true;

    } catch (e) {
        alert("FEHLER in exportPDF():\n" + e.message + "\n\nZeile: " + e.line);
        return false;
    }
}

// Skript ausführen
try {
    main();
} catch (e) {
    alert("KRITISCHER FEHLER:\n" + e.message + "\n\nZeile: " + e.line + "\n\nQuelle: " + e.source);
}
