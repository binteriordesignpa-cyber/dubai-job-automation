import { candidate } from "../../config/jobCriteria.js";

export function matchJob(job) {
  const requiredSkills = job.requiredSkills ?? [];
  const matchedSkills = requiredSkills.filter(skill =>
    candidate.skills.includes(skill)
  );

  const score = requiredSkills.length === 0
    ? 0
    : Math.round((matchedSkills.length / requiredSkills.length) * 100);

  return {
    job: job.title,
    location: job.location,
    score,
    matchedSkills
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const exampleJob = {
    title: "Senior Interior Designer",
    location: "Dubai",
    requiredSkills: [
      "Interior Design",
      "AutoCAD",
      "SketchUp",
      "V-Ray",
      "Project Management"
    ]
  };

  console.log(JSON.stringify(matchJob(exampleJob), null, 2));
}
