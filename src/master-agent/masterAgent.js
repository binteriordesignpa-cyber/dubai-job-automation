import { matchJob } from "../job-match/jobMatchAgent.js";

export function runMasterAgent(jobs = []) {
  const matches = jobs
    .map(matchJob)
    .sort((a, b) => b.score - a.score);

  return {
    totalJobs: jobs.length,
    matches
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const demoJobs = [
    {
      title: "Senior Interior Designer",
      location: "Dubai",
      requiredSkills: [
        "Interior Design",
        "AutoCAD",
        "SketchUp",
        "V-Ray",
        "Project Management"
      ]
    },
    {
      title: "Interior Designer",
      location: "Dubai",
      requiredSkills: ["Interior Design", "AutoCAD", "Photoshop"]
    }
  ];

  console.log(JSON.stringify(runMasterAgent(demoJobs), null, 2));
}
