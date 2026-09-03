import { targetCriteria } from "../../config/jobCriteria.js";
import { matchJob } from "../job-match/jobMatchAgent.js";

function normalizeText(value = "") {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

export function normalizeJob(rawJob) {
  return {
    title: rawJob.title?.trim() ?? "",
    company: rawJob.company?.trim() ?? "",
    location: rawJob.location?.trim() ?? "",
    url: rawJob.url?.trim() ?? "",
    source: rawJob.source?.trim() ?? "",
    description: rawJob.description?.trim() ?? "",
    requiredSkills: rawJob.requiredSkills ?? [],
    discoveredAt: rawJob.discoveredAt ?? new Date().toISOString()
  };
}

export function isTargetJob(job) {
  const location = normalizeText(job.location);
  const title = normalizeText(job.title);

  const locationMatch = location.includes(normalizeText(targetCriteria.location));
  const roleMatch = targetCriteria.roles.some(role =>
    title.includes(normalizeText(role))
  );

  return locationMatch && roleMatch;
}

export function deduplicateJobs(jobs) {
  const seen = new Set();
  return jobs.filter(job => {
    const key = job.url || [job.title, job.company, job.location]
      .map(normalizeText)
      .join("|");

    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function searchAndMatchJobs(rawJobs = []) {
  const normalizedJobs = rawJobs.map(normalizeJob);
  const targetJobs = normalizedJobs.filter(isTargetJob);
  const uniqueJobs = deduplicateJobs(targetJobs);

  return uniqueJobs
    .map(job => ({
      ...job,
      match: matchJob(job)
    }))
    .sort((a, b) => b.match.score - a.match.score);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const demoJobs = [
    {
      title: "Senior Interior Designer",
      company: "Example Dubai Studio",
      location: "Dubai, UAE",
      url: "https://example.com/jobs/senior-interior-designer",
      source: "demo",
      description: "Senior interior design role in Dubai.",
      requiredSkills: [
        "Interior Design",
        "AutoCAD",
        "SketchUp",
        "V-Ray",
        "Project Management"
      ]
    },
    {
      title: "Junior Graphic Designer",
      company: "Example Agency",
      location: "Dubai, UAE",
      url: "https://example.com/jobs/junior-graphic-designer",
      source: "demo",
      requiredSkills: ["Photoshop"]
    }
  ];

  console.log(JSON.stringify(searchAndMatchJobs(demoJobs), null, 2));
}
