const fs = require("fs");
const { XMLParser } = require("fast-xml-parser");
const kmlFilePath = process.argv[2];
if (!kmlFilePath)
  console.warn(
    "no KML file dropped via [.bat]; falling back to default filename...",
  );
const fallbackPath = "route.kml";
const targetPath = kmlFilePath || fallbackPath;
const kmlData = fs.readFileSync(targetPath, "utf-8");
const parser = new XMLParser({ ignoreAttributes: false });
const jsonObj = parser.parse(kmlData);
try {
  let placemark =
    jsonObj.kml?.Document?.Placemark ||
    jsonObj.kml?.Document?.Folder?.Placemark;
  if (Array.isArray(placemark)) {
    placemark = placemark.find((p) => p.LineString);
  }
  if (!placemark || !placemark.LineString) {
    throw new Error("Cloud not find a valid LineString element. ");
  }
  const name = placemark.name;
  const coordString = placemark.LineString.coordinates.trim();
  const points = coordString.split(/\s+/);
  console.log("Extracting route name: " + name);
  let jsonexport = {
    name: name,
    coordinates: [],
  };
  points.forEach((point) => {
    if (!point || !point.includes(",")) return;
    const parts = point.split(",");
    const lon = parts[0]?.trim();
    const lat = parts[1]?.trim();
    const alt = parts[2]?.trim() || 0;
    if (lat && lon) {
      jsonexport.coordinates.push([Number(lat), Number(lon), Number(alt)]);
    }
  });
  const outputFilePath = targetPath.replace(".kml", "_clean.json");
  fs.writeFileSync(outputFilePath, JSON.stringify(jsonexport, null, 2));
  console.log("Success! Clean 'Latitude,Longitude' CSV generated. ");
} catch (e) {
  console.error(
    `Error parsing KML structure. Check your tag paths: ${e.message}`,
    e,
  );
}
