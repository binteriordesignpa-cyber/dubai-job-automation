import { buildSearchPlan } from "./searchQueries.js";
import { searchAndMatchJobs } from "./jobSearchAgent.js";

export function prepareSearchPipeline(rawJobs = []) {
  const plan = buildSearchPlan();
  const results = searchAndMatchJobs(rawJobs);

  return {
    searchPlan: plan,
    totalDiscovered: rawJobs.length,
    totalQualified: results.length,
    results
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(JSON.stringify(prepareSearchPipeline([]), null, 2));
}
