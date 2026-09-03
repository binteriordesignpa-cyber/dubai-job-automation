const AUTO_PREPARE_THRESHOLD = 80;

export function prepareApplication(job, candidate, documents = []) {
  const score = job.match?.score ?? 0;
  const cv = documents.find(doc => doc.document_type === "cv");
  const portfolio = documents.find(doc => doc.document_type === "portfolio");

  return {
    job: {
      title: job.title,
      company: job.company ?? "",
      location: job.location ?? "",
      url: job.url ?? ""
    },
    matchScore: score,
    status: score >= AUTO_PREPARE_THRESHOLD ? "prepared" : "review_required",
    package: {
      cv: cv ?? null,
      portfolio: portfolio ?? null,
      coverLetter: buildCoverLetter(job, candidate)
    },
    submission: {
      ready: score >= AUTO_PREPARE_THRESHOLD,
      requiresUserAction: true,
      reason: "Final submission remains user-controlled for CAPTCHA, identity verification, legal attestations, or other platform-required actions."
    }
  };
}

function buildCoverLetter(job, candidate) {
  const skills = candidate.skills?.slice(0, 5).join(", ") || "interior design";

  return `Dear Hiring Team,\n\nI am interested in the ${job.title} opportunity at ${job.company || "your company"} in ${job.location || "Dubai"}. I bring ${candidate.experience ?? 0} years of interior design experience with strengths in ${skills}.\n\nI would welcome the opportunity to discuss how my experience can contribute to your projects.\n\nKind regards,\n${candidate.name || "Candidate"}`;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const demo = prepareApplication(
    {
      title: "Senior Interior Designer",
      company: "Example Dubai Studio",
      location: "Dubai",
      url: "https://example.com/job",
      match: { score: 100 }
    },
    {
      name: "Candidate",
      experience: 13,
      skills: ["Interior Design", "AutoCAD", "SketchUp", "V-Ray", "Project Management"]
    },
    []
  );

  console.log(JSON.stringify(demo, null, 2));
}
