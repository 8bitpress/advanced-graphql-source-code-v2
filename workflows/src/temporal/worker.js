import { Worker } from "@temporalio/worker";
import { URL } from "url";
import * as activities from "./activities.js";

async function initTemporalWorker() {
  const worker = await Worker.create({
    workflowsPath: new URL("./workflows.js", import.meta.url).pathname,
    activities,
    taskQueue: "marked-app"
  });

  await worker.run();
}

export default initTemporalWorker;
