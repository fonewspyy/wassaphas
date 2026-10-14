-- First-party visitor analytics: one row per page view or click. No raw IPs and no
-- cookies: visitor_hash = hmac(ip + user agent + UTC date), so a visitor is countable
-- within one day but can't be followed across days or tied back to an address.

CREATE TABLE analytics_events (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  type          ENUM('pageview','click') NOT NULL,
  path          VARCHAR(300) NOT NULL,             -- page the event happened on
  target        VARCHAR(200) NULL,                 -- clicks: data-track / label / href
  href          VARCHAR(300) NULL,                 -- clicks on links: where it pointed
  referrer_host VARCHAR(200) NULL,                 -- pageviews from another site only
  country       CHAR(2)      NULL,                 -- Cloudflare cf-ipcountry
  device        ENUM('mobile','tablet','desktop') NOT NULL,
  browser       VARCHAR(30)  NOT NULL,
  lang          VARCHAR(5)   NULL,
  visitor_hash  CHAR(64)     NOT NULL,
  created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY ix_analytics_time (created_at, type),
  KEY ix_analytics_visitor (visitor_hash, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
