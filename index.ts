import { getMemoryUsageByName, processPaths } from "./helpers";
import { scanRoutes } from "./scanner";

const baseUrl = "http://localhost:3000";
const projectPath = "/home/martino/Desktop/template";

console.log(`Testing ${baseUrl} on ${projectPath}`);

const paths = scanRoutes(projectPath);

console.log(`Found ${paths.length} paths`);

const coldMemory = await getMemoryUsageByName("next-server");
const coldStart = performance.now();
const coldResults = await processPaths(baseUrl, paths);
const coldEnd = performance.now();

const warmMemory = await getMemoryUsageByName("next-server");
const warmStart = performance.now();
const warmResults = await processPaths(baseUrl, paths);
const warmEnd = performance.now();

const endMemory = await getMemoryUsageByName("next-server");

console.clear();

console.log(`Cold results ${(coldEnd - coldStart).toFixed(2)}ms`);
coldResults
  .slice(-10)
  .forEach((result) =>
    console.log(`${result.path} - ${result.time.toFixed(2)}ms`)
  );

console.log(`Warm results ${(warmEnd - warmStart).toFixed(2)}ms`);
warmResults
  .slice(-10)
  .forEach((result) =>
    console.log(`${result.path} - ${result.time.toFixed(2)}ms`)
  );

console.log(
  `Cold memory: ${coldMemory}MB | Warm memory: ${warmMemory}MB | Final memory: ${endMemory}MB`
);
