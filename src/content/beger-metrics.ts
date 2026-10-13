// How daily work at Beger changed with AI agents, from git history only (17 repos, bare
// clones, read-only script beger_ai.py, 13 Oct 2026). Owner identities: t_wassaphas,
// Wassaphas Thongsopa, fonewspyy. Lockfiles, binaries, build output and non-code files
// are excluded. No repo, system or table names appear on the site.
// - SPLIT_DATE: first commit that added agent rules (AGENTS.md / CLAUDE.md / .claude/)
// - weeks: [ISO week start, commits by the owner]
// - months: [month, changed code lines, of which test lines]
// Regenerate rather than hand-edit.

export const BEGER_SPLIT_DATE = "2026-02-25";

export const begerSummary = {
  before: {"commits": 55, "per_week": 3.4, "median_lines_per_commit": 316, "test_share_of_changed_lines": 0.042, "bot_commits": 0, "repos_touched": 6},
  after: {"commits": 1399, "per_week": 42.4, "median_lines_per_commit": 154, "test_share_of_changed_lines": 0.108, "bot_commits": 0, "repos_touched": 16},
};

export const begerWeeks: [string, number][] = [["2025-11-03", 2], ["2025-11-10", 11], ["2025-11-17", 7], ["2025-11-24", 2], ["2025-12-01", 1], ["2025-12-08", 1], ["2025-12-15", 0], ["2025-12-22", 0], ["2025-12-29", 0], ["2026-01-05", 6], ["2026-01-12", 2], ["2026-01-19", 4], ["2026-01-26", 4], ["2026-02-02", 6], ["2026-02-09", 2], ["2026-02-16", 5], ["2026-02-23", 11], ["2026-03-02", 5], ["2026-03-09", 0], ["2026-03-16", 3], ["2026-03-23", 6], ["2026-03-30", 5], ["2026-04-06", 17], ["2026-04-13", 0], ["2026-04-20", 16], ["2026-04-27", 12], ["2026-05-04", 41], ["2026-05-11", 26], ["2026-05-18", 15], ["2026-05-25", 23], ["2026-06-01", 23], ["2026-06-08", 18], ["2026-06-15", 28], ["2026-06-22", 15], ["2026-06-29", 23], ["2026-07-06", 18], ["2026-07-13", 24], ["2026-07-20", 52], ["2026-07-27", 136], ["2026-08-03", 81], ["2026-08-10", 39], ["2026-08-17", 49], ["2026-08-24", 59], ["2026-08-31", 101], ["2026-09-07", 81], ["2026-09-14", 103], ["2026-09-21", 72], ["2026-09-28", 93], ["2026-10-05", 156]];

export const begerMonths: [string, number, number][] = [["2025-11", 8239, 0], ["2025-12", 319, 0], ["2026-01", 58549, 4611], ["2026-02", 70011, 0], ["2026-03", 12906, 156], ["2026-04", 75479, 3629], ["2026-05", 135387, 5427], ["2026-06", 85890, 1231], ["2026-07", 76185, 4593], ["2026-08", 127673, 21801], ["2026-09", 139976, 30049], ["2026-10", 86673, 15833]];
