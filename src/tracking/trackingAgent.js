const DEFAULT_FOLLOW_UP_DAYS = 5;

export const APPLICATION_STATUSES = [
  "prepared",
  "applied",
  "viewed",
  "shortlisted",
  "interview",
  "offer",
  "rejected",
  "withdrawn"
];

export function createApplicationRecord({ candidateId, jobId, applicationUrl = null, notes = null }) {
  return {
    candidate_id: candidateId,
    job_id: jobId,
    status: "prepared",
    application_url: applicationUrl,
    notes,
    applied_at: null
  };
}

export function updateApplicationStatus(application, status, now = new Date()) {
  if (!APPLICATION_STATUSES.includes(status)) {
    throw new Error(`Unsupported application status: ${status}`);
  }

  return {
    ...application,
    status,
    applied_at: status === "applied" && !application.applied_at
      ? now.toISOString()
      : application.applied_at
  };
}

export function createFollowUp(application, days = DEFAULT_FOLLOW_UP_DAYS, now = new Date()) {
  const dueAt = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

  return {
    application_id: application.id ?? null,
    due_at: dueAt.toISOString(),
    status: "pending",
    notes: "Follow up on application if there has been no response."
  };
}

export function getNextAction(application) {
  switch (application.status) {
    case "prepared": return "Submit application when ready.";
    case "applied": return "Wait for response and follow up when due.";
    case "viewed": return "Monitor for shortlist or interview invitation.";
    case "shortlisted": return "Prepare for interview.";
    case "interview": return "Complete interview preparation and attend interview.";
    case "offer": return "Review offer details.";
    case "rejected": return "Archive result and continue with new matches.";
    case "withdrawn": return "No further action.";
    default: return "Review application status.";
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const application = updateApplicationStatus(
    createApplicationRecord({ candidateId: "candidate-id", jobId: "job-id" }),
    "applied"
  );

  console.log(JSON.stringify({
    application,
    followUp: createFollowUp(application),
    nextAction: getNextAction(application)
  }, null, 2));
}
