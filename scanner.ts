import fs from "fs";
import path from "path";

const isPageFile = (file: string) => {
  return (
    file === "page.tsx" ||
    file === "page.jsx" ||
    file === "page.js" ||
    file === "page.ts"
  );
};

const scanRoutes = (projectDir: string): string[] => {
  const appDirs = [
    path.resolve(projectDir, "app"),
    path.resolve(projectDir, "src", "app"),
  ];

  const routes: string[] = [];
  let appDir = "";

  for (const dir of appDirs) {
    if (fs.existsSync(dir)) {
      appDir = dir;
      break;
    }
  }

  if (!appDir) {
    console.error("No app directory found (either /app or /src/app).");
    return [];
  }

  const walk = (dir: string, routePrefix = "") => {
    const files = fs.readdirSync(dir, { withFileTypes: true });

    for (const file of files) {
      const fullPath = path.join(dir, file.name);

      if (file.isDirectory()) {
        walk(fullPath, path.join(routePrefix, file.name));
      } else if (isPageFile(file.name)) {
        let route = "/" + routePrefix;

        route = route
          .split(path.sep)
          .filter(
            (segment) => !segment.startsWith("(") && !segment.startsWith("@")
          )
          .join("/");

        route = route.replace(/\[(\.{3})?([^\]]+)\]/g, (_match, dots, name) => {
          return dots ? `*${name}` : `:${name}`;
        });

        if (!route.endsWith("/")) route += "/";
        if (route === "//") route = "/";

        routes.push(route);
      }
    }
  };

  walk(appDir);

  return routes.sort();
};

export { scanRoutes };
