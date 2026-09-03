import { targetCriteria } from "../../config/jobCriteria.js";

export function buildSearchQueries() {
  return targetCriteria.roles.map(role =>
    `${role} ${targetCriteria.location}`
  );
}

export function buildSearchPlan() {
  return {
    location: targetCriteria.location,
    roles: targetCriteria.roles,
    queries: buildSearchQueries(),
    sources: [
      "Indeed",
      "Bayt",
      "GulfTalent",
      "LinkedIn Jobs"
    ]
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(JSON.stringify(buildSearchPlan(), null, 2));
}
