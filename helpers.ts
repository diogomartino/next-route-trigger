import { exec } from "child_process";

const getMemoryUsageByName = async (processName: string) => {
  return new Promise((resolve, reject) => {
    exec(
      `ps aux --sort=-%mem | grep ${processName} | grep -v grep`,
      (err, stdout, stderr) => {
        if (err || stderr) {
          reject(stderr);
          return;
        }

        const processes = stdout.split("\n").filter(Boolean);

        processes.forEach((process) => {
          const processInfo = process.split(/\s+/);
          const rssInKB = processInfo[5];
          const rssInMB = (parseInt(rssInKB) / 1024).toFixed(2);
          const processNameExtracted = processInfo.slice(10).join(" ");
          if (processNameExtracted.includes(processName)) {
            resolve(rssInMB);
          }
        });
      }
    );
  });
};

const hitPage = async (baseUrl: string, path: string) => {
  const fullUrl = `${baseUrl}${path}`;
  const start = performance.now();

  const response = await fetch(fullUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const end = performance.now();

  console.log(`${path} - ${response.status} - ${(end - start).toFixed(2)}ms`);
};

const processPaths = async (baseUrl: string, paths: string[]) => {
  const results: {
    time: number;
    path: string;
  }[] = [];

  for (const path of paths) {
    const start = performance.now();
    await hitPage(baseUrl, path);
    const end = performance.now();

    results.push({
      time: end - start,
      path,
    });
  }

  return results.sort((a, b) => a.time - b.time);
};

export { hitPage, getMemoryUsageByName, processPaths };
