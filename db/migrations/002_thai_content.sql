-- Thai copy for content that is shown in prose. English columns stay the fallback:
-- a NULL *_th value means "show the English text".
-- Titles, tech names and company names are not translated.

ALTER TABLE projects
  ADD COLUMN summary_th     VARCHAR(400) NULL AFTER summary,
  ADD COLUMN description_th TEXT         NULL AFTER description,
  ADD COLUMN role_th        VARCHAR(160) NULL AFTER role,
  ADD COLUMN highlights_th  JSON         NULL AFTER highlights;

ALTER TABLE experiences
  ADD COLUMN title_th   VARCHAR(160) NULL AFTER title,
  ADD COLUMN period_th  VARCHAR(60)  NULL AFTER period,
  ADD COLUMN summary_th TEXT         NULL AFTER summary;
