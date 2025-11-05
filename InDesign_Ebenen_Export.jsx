/*
 * InDesign Skript: Selektiver PDF-Export mit Ebenenkontrolle
 *
 * Dieses Skript ermöglicht es, vor dem PDF-Export gezielt auszuwählen,
 * welche Ebenen im PDF sichtbar sein sollen und welche nicht.
 *
 * VERWENDUNG:
 * 1. InDesign-Dokument öffnen
 * 2. Datei > Skripten > Skript ausführen... (oder Fenster > Automatisierung > Skripte)
 * 3. Dieses Skript auswählen und ausführen
 * 4. Im Dialog die gewünschten Ebenen auswählen
 * 5. Exporteinstellungen festlegen
 */

#target indesign

// Hauptfunktion
function main() {
    // Prüfen ob InDesign läuft und initialisiert ist
    if (typeof app === 'undefined' || app.name.indexOf("InDesign") === -1) {
        alert("Dieses Skript muss in Adobe InDesign ausgeführt werden.");
        return;
    }

    // Prüfen ob ein Dokument geöffnet ist
    if (!app.documents.length || app.documents.length === 0) {
        alert("Bitte öffnen Sie zuerst ein InDesign-Dokument.");
        return;
    }

    // Prüfen ob activeDocument verfügbar ist
    var doc;
    try {
        doc = app.activeDocument;
    } catch (e) {
        alert("Kein aktives Dokument gefunden. Bitte klicken Sie ins Dokument-Fenster.");
        return;
    }

    if (!doc) {
        alert("Kein aktives Dokument gefunden. Bitte öffnen Sie ein Dokument.");
        return;
    }

    // Prüfen ob Ebenen vorhanden sind
    if (doc.layers.length === 0) {
        alert("Das Dokument enthält keine Ebenen.");
        return;
    }

    // Aktuelle Ebenenzustände speichern
    var originalLayerStates = saveLayerStates(doc);

    // Dialog zur Ebenenauswahl anzeigen
    var selectedLayers = showLayerSelectionDialog(doc);

    if (selectedLayers === null) {
        // Benutzer hat abgebrochen
        return;
    }

    // Ebenen entsprechend der Auswahl ein-/ausblenden
    setLayerVisibility(doc, selectedLayers);

    // PDF-Export durchführen
    var exportSuccess = exportPDF(doc);

    // Ursprüngliche Ebenenzustände wiederherstellen
    restoreLayerStates(doc, originalLayerStates);

    if (exportSuccess) {
        alert("PDF wurde erfolgreich exportiert!");
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
            // Ebene existiert möglicherweise nicht mehr oder kann nicht geändert werden
        }
    }
}

// Zeigt einen Dialog zur Auswahl der zu exportierenden Ebenen
function showLayerSelectionDialog(doc) {
    var dialog = new Window("dialog", "Ebenen für PDF-Export auswählen");
    dialog.orientation = "column";
    dialog.alignChildren = ["fill", "top"];
    dialog.spacing = 10;
    dialog.margins = 16;

    // Informationstext
    var infoGroup = dialog.add("group");
    infoGroup.add("statictext", undefined, "Wählen Sie die Ebenen aus, die im PDF sichtbar sein sollen:", {multiline: true});

    // Scrollbare Liste für Ebenen
    var layerPanel = dialog.add("panel", undefined, "Ebenen");
    layerPanel.orientation = "column";
    layerPanel.alignChildren = ["left", "top"];
    layerPanel.spacing = 5;
    layerPanel.margins = 10;

    var layerCheckboxes = [];

    // Checkbox für jede Ebene erstellen
    for (var i = doc.layers.length - 1; i >= 0; i--) {
        var layer = doc.layers[i];
        var checkbox = layerPanel.add("checkbox", undefined, layer.name);
        checkbox.value = layer.visible; // Standardmäßig aktuellen Status übernehmen
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
            // Fehler bei dieser Ebene ignorieren und weitermachen
            alert("Warnung: Ebene '" + doc.layers[i].name + "' konnte nicht geändert werden.\n" + e.message);
        }
    }
}

// Führt den PDF-Export durch
function exportPDF(doc) {
    try {
        // Dateinamen und Speicherort abfragen
        var defaultName = doc.name.replace(/\.[^\.]+$/, "") + ".pdf";
        var saveFile = File.saveDialog("PDF speichern unter", "PDF-Dateien:*.pdf");

        if (!saveFile) {
            // Benutzer hat Speichern abgebrochen
            return false;
        }

        // Sicherstellen dass die Dateiendung .pdf ist
        if (!/\.pdf$/i.test(saveFile.name)) {
            saveFile = new File(saveFile.fullName + ".pdf");
        }

        // PDF-Exportvorgabe verwenden (Standard oder benutzerdefiniert)
        var pdfPreset;

        try {
            // Versuche "High Quality Print" Vorgabe zu verwenden (ohne eckige Klammern)
            pdfPreset = app.pdfExportPresets.item("High Quality Print");
        } catch (e) {
            try {
                // Versuche mit eckigen Klammern (alte Versionen)
                pdfPreset = app.pdfExportPresets.item("[High Quality Print]");
            } catch (e2) {
                // Falls nicht vorhanden, erste verfügbare Vorgabe verwenden
                if (app.pdfExportPresets.length > 0) {
                    pdfPreset = app.pdfExportPresets[0];
                } else {
                    alert("Keine PDF-Exportvorgabe gefunden. Bitte erstellen Sie eine Vorgabe in InDesign.");
                    return false;
                }
            }
        }

        // WICHTIG: PDF-Export-Einstellungen setzen
        // Nur sichtbare und druckbare Ebenen exportieren
        // KORREKTUR: Richtige Konstante ist EXPORT_VISIBLE_PRINTABLE_LAYERS
        try {
            app.pdfExportPreferences.exportWhichLayers = ExportLayerOptions.EXPORT_VISIBLE_PRINTABLE_LAYERS;
        } catch (e) {
            // Fallback: Versuche ohne EXPORT_ Prefix (ältere InDesign Versionen)
            try {
                app.pdfExportPreferences.exportWhichLayers = ExportLayerOptions.visiblePrintableLayers;
            } catch (e2) {
                // Wenn beides fehlschlägt, einfach weitermachen - die Ebenen sind ja schon korrekt gesetzt
            }
        }

        // Optional: Ebenen im PDF als echte PDF-Ebenen exportieren (falls gewünscht)
        // app.pdfExportPreferences.exportLayers = true;

        // PDF exportieren - KORREKTUR: PDF_TYPE statt pdfType
        doc.exportFile(ExportFormat.PDF_TYPE, saveFile, false, pdfPreset);

        return true;

    } catch (e) {
        alert("Fehler beim PDF-Export:\n" + e.message + "\n\nZeile: " + e.line);
        return false;
    }
}

// Skript ausführen
try {
    main();
} catch (e) {
    alert("Es ist ein Fehler aufgetreten:\n" + e.message + "\n\nZeile: " + e.line);
}
