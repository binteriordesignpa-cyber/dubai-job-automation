import { createClient } from "@supabase/supabase-js";

function getSupabaseClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variable."
    );
  }

  return createClient(url, key, {
    auth: { persistSession: false }
  });
}

export async function upsertJobs(jobs = []) {
  const supabase = getSupabaseClient();

  const rows = jobs.map(job => ({
    title: job.title,
    company: job.company || null,
    location: job.location || null,
    description: job.description || null,
    source: job.source || null,
    source_url: job.url || null,
    required_skills: job.requiredSkills || [],
    discovered_at: job.discoveredAt || new Date().toISOString()
  }));

  if (rows.length === 0) return [];

  const { data, error } = await supabase
    .from("jobs")
    .upsert(rows, { onConflict: "source_url" })
    .select();

  if (error) throw error;
  return data;
}

export async function createJobMatches(candidateId, jobs = []) {
  const supabase = getSupabaseClient();

  const jobRows = await upsertJobs(jobs);
  const jobByUrl = new Map(jobRows.map(job => [job.source_url, job]));

  const matches = jobs
    .map(job => {
      const storedJob = jobByUrl.get(job.url);
      if (!storedJob || !job.match) return null;

      return {
        candidate_id: candidateId,
        job_id: storedJob.id,
        match_score: job.match.score,
        matched_skills: job.match.matchedSkills || [],
        recommendation: job.match.score >= 80 ? "shortlist" : "review"
      };
    })
    .filter(Boolean);

  if (matches.length === 0) return [];

  const { data, error } = await supabase
    .from("job_matches")
    .upsert(matches, { onConflict: "candidate_id,job_id" })
    .select();

  if (error) throw error;
  return data;
}
