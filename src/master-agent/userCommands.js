export const USER_COMMANDS = {
  SEARCH: "find new Dubai interior design jobs",
  MATCH: "match my best jobs",
  PREPARE: "prepare applications",
  STATUS: "show application status",
  FOLLOW_UP: "show follow-ups",
  INTERVIEW: "prepare me for interview"
};

export function interpretCommand(input = "") {
  const text = input.trim().toLowerCase();

  if (text.includes("find") && text.includes("job")) return "SEARCH";
  if (text.includes("match")) return "MATCH";
  if (text.includes("prepare") && text.includes("application")) return "PREPARE";
  if (text.includes("status") || text.includes("application status")) return "STATUS";
  if (text.includes("follow")) return "FOLLOW_UP";
  if (text.includes("interview")) return "INTERVIEW";

  return "UNKNOWN";
}
