// ##################################################
// Kopier das Sheet und füge die neue URL unten bei Spreadsheet_URL ein
// https://docs.google.com/spreadsheets/d/1HtfbCtEQwuXYDzh8Pt3ur9cu1inGTUQCGtsYUz0N6tA/copy
var SPREADSHEET_URL = "";

// ##################################################
// Konfigurationsbereich
// ##################################################

// Auswahl des Custom Labels (0 bis 4)
var selectedCustomLabel = 2; // Wähle zwischen 0 und 4

// Setzen Sie den Break-even-ROAS
var breakevenRoas = 1.5;

// Durchschnittliche Conversion Rate
var AverageCvr = 2;

// Schwellenwert für Impressionen
var impressionThreshold = 50;

// Zeitspanne für die Datenabfrage (Tage zurück)
var daysAgo = 90;


//Bennenung der Produkttypen (So werden die Custom_Labels heissen
var productTypeNameOverperformer = 'Machines';
var productTypeNameGoodPerformer = 'Hustlers';
var productTypeNameMediumPerformer = 'Sleeper';
var productTypeNamePoorPerformer = 'killjoy'; 
var productTypeNameLowImpressions = 'Ninjas'; 

// ##################################################
// Rest des Skripts (Nichts ändern)
// ##################################################

function main() {
    var products = getFilteredShoppingProducts(daysAgo);
    products.sort(function(a, b) {
        return a[0] > b[0];
    });
    products = products.slice(0, 999999);
    pushToSpreadsheet(products);
    saveProductDataWithTimestamp(products); // Speichert die Daten im save_data Sheet
}


function getFilteredShoppingProducts(daysAgo) {
    var today = new Date();
    var daysAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - daysAgo);
    var dateFrom = Utilities.formatDate(daysAgo, AdsApp.currentAccount().getTimeZone(), 'yyyyMMdd');
    var dateTo = Utilities.formatDate(today, AdsApp.currentAccount().getTimeZone(), 'yyyyMMdd');

    var query =
        "SELECT OfferId, Impressions, Clicks, Ctr, Cost, Conversions, ConversionValue " +
        "FROM SHOPPING_PERFORMANCE_REPORT " +
        "DURING " + dateFrom + "," + dateTo;

    var products = [];
    var count = 0;
    var report = AdsApp.report(query);
    var rows = report.rows();
    while (rows.hasNext()) {
        var row = rows.next();
        var offer_id = formatOfferId(row['OfferId']); // Hier wird die Funktion aufgerufen
        var impressions = row['Impressions'].toString();
        var clicks = row['Clicks'].toString();
        var cost = row['Cost'].toString();
        var conversions = row['Conversions'].toString();
        var conversionValue = row['ConversionValue'].toString();
        var convValuePerCost = (conversionValue.replace(",", "") / cost.replace(",", "")).toString();
        if (isNaN(convValuePerCost)) {
            convValuePerCost = 0;
        }

        var productType = '';
        if (clicks > (300 / AverageCvr) && convValuePerCost >= breakevenRoas + 1) { 
        productType = productTypeNameOverperformer; // OVERPERFORMER
      } else if (clicks >= (100 / AverageCvr) && convValuePerCost >= breakevenRoas) {
            productType = productTypeNameGoodPerformer; // Good Performer
      } else if (convValuePerCost >= breakevenRoas - 1) {
            productType = productTypeNameMediumPerformer; // Medium Performer
      } else if (impressions < impressionThreshold) {
            productType = productTypeNameLowImpressions; // Low Impr
      } else { 
            productType = productTypeNamePoorPerformer; // Poor performer
        }
        products.push([offer_id, impressions, clicks, cost, conversions, conversionValue, convValuePerCost, productType]);
        count += 1;
    }
    Logger.log(count);
    return products;
}

function formatOfferId(offerId) {
    var expectedFormat = /^shopify_[A-Z]{2}_/; // Regulärer Ausdruck für das erwartete Format

    if (offerId.startsWith("shopify_")) {
        if (!expectedFormat.test(offerId)) {
            var parts = offerId.split('_');
            if (parts.length > 2) {
                parts[1] = parts[1].toUpperCase(); // Wandelt nur den Ländercode in Großbuchstaben um, falls nötig
                offerId = parts.join('_');
            }
        }
    }
    return offerId;
}

function pushToSpreadsheet(data) {
    var spreadsheet = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
    setCustomLabelInSheet(); // Setzt das Custom Label im Sheet
    var sheet = spreadsheet.getSheetByName('EYL-Izer');
    var lastRow = sheet.getMaxRows();
    sheet.getRange('A2:H' + lastRow).clearContent();
    var start_row = 2;
    var endRow = start_row + data.length - 1;
    var range = sheet.getRange('A' + start_row + ':' + 'H' + endRow);
    if (data.length > 0) {
        range.setValues(data);
    }
    return;
}

function setCustomLabelInSheet() {
    var spreadsheet = SpreadsheetApp.openByUrl(SPREADSHEET_URL); // Verwendet die bestehende URL des Spreadsheets
    var sheet = spreadsheet.getSheetByName('EYL-Izer'); // Ersetzen Sie dies mit dem Namen Ihres Sheets
    var customLabelHeader = 'custom label ' + selectedCustomLabel;
    sheet.getRange('H1').setValue(customLabelHeader);
}

function saveProductDataWithTimestamp(products) {
    var spreadsheet = SpreadsheetApp.openByUrl(SPREADSHEET_URL);
    var saveDataSheet = spreadsheet.getSheetByName('save_data') || spreadsheet.insertSheet('save_data');
    
    // Fügt eine Kopfzeile hinzu, wenn das Blatt neu ist
    if (saveDataSheet.getLastRow() == 0) {
        saveDataSheet.appendRow(['Zeitstempel', 'OfferId', 'Impressions', 'Clicks', 'Cost', 'Conversions', 'ConversionValue', 'Roas', 'ProductType']);
    }

    var timestamp = Utilities.formatDate(new Date(), "GMT", "yyyy-MM-dd"); // Zeitstempel im Format JJJJ-MM-TT
    products.forEach(function(product) {
        var dataWithTimestamp = [timestamp].concat(product);
        saveDataSheet.appendRow(dataWithTimestamp);
    });
}
