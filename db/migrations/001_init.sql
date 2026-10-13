-- Portfolio schema. Applied once by scripts/migrate.mjs, recorded in schema_migrations.
-- Never edit an applied migration: add 002_*.sql instead.

CREATE TABLE projects (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  slug          VARCHAR(80)  NOT NULL,
  title         VARCHAR(120) NOT NULL,
  summary       VARCHAR(300) NOT NULL,
  description   TEXT         NULL,
  role          VARCHAR(120) NULL,
  tech          JSON         NOT NULL,           -- ["Next.js","MariaDB"]
  highlights    JSON         NOT NULL,           -- ["Built X", "Cut Y by Z%"]
  repo_url      VARCHAR(300) NULL,
  live_url      VARCHAR(300) NULL,
  year          SMALLINT     NULL,
  featured      TINYINT(1)   NOT NULL DEFAULT 0,
  published     TINYINT(1)   NOT NULL DEFAULT 1,
  sort_order    INT          NOT NULL DEFAULT 0,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_projects_slug (slug),
  KEY ix_projects_listing (published, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE skills (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  category    ENUM('frontend','backend','database','ai','devops') NOT NULL,
  name        VARCHAR(60)  NOT NULL,
  sort_order  INT          NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY uq_skills_category_name (category, name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE experiences (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  company     VARCHAR(120) NOT NULL,
  title       VARCHAR(120) NOT NULL,
  period      VARCHAR(60)  NOT NULL,             -- display text, e.g. "2024 – Present"
  summary     TEXT         NOT NULL,
  sort_order  INT          NOT NULL DEFAULT 0,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE contact_messages (
  id          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  name        VARCHAR(120) NOT NULL,
  email       VARCHAR(200) NOT NULL,
  message     TEXT         NOT NULL,
  ip_hash     CHAR(64)     NOT NULL,             -- sha256(ip + secret), never the raw IP
  is_read     TINYINT(1)   NOT NULL DEFAULT 0,
  created_at  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY ix_contact_ip_time (ip_hash, created_at),
  KEY ix_contact_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
