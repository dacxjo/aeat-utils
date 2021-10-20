function extractText(text) {
  return text.match(/(?:"[^"]*"|^[^"]*$)/)[0].replace(/"/g, "");
}

function parseNumericValue(text, lon) {
  return text.split(".").join("").padStart(lon, "0");
}

exports.extractText = extractText;
exports.parseNumericValue = parseNumericValue;
