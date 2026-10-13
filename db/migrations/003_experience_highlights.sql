-- Bullet points for each role, in both languages. NULL Thai falls back to English.
ALTER TABLE experiences
  ADD COLUMN highlights    JSON NULL AFTER summary_th,
  ADD COLUMN highlights_th JSON NULL AFTER highlights;
