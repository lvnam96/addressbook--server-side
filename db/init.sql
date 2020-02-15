-- NOTE: IF TABLE'S SCHEMA IS CHANGED, REMEMBER TO UPDATE '../helpers/dbUtils.js'
--install extension uuid generator
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE IF NOT EXISTS account (
  id UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  username VARCHAR(20) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  facebook_id VARCHAR(255) UNIQUE,
  birth DATE CONSTRAINT birthday_must_in_past CHECK (birth < CURRENT_DATE),
  email VARCHAR(355) UNIQUE CONSTRAINT basic_email_pattern CHECK (email LIKE '%@%.%'),
  phone VARCHAR(15),
  nicename VARCHAR(25),
  created_on TIMESTAMP NOT NULL,
  salt VARCHAR(32) NOT NULL
);
CREATE TABLE IF NOT EXISTS contactsbook (
  id UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  acc_id UUID REFERENCES account (id) ON UPDATE CASCADE ON DELETE
  SET
    NULL,
    name VARCHAR(25),
    color VARCHAR(40) CHECK (
      color LIKE 'rgb(%)'
      OR color LIKE 'rgba(%)'
      OR color LIKE '#%'
      OR color LIKE 'hsl(%)'
      OR color LIKE 'hsla(%)'
    )
);
CREATE TABLE IF NOT EXISTS account_contactsbook (
  acc_id UUID REFERENCES account (id) ON UPDATE CASCADE ON DELETE CASCADE,
  cbook_id UUID REFERENCES contactsbook (id) ON UPDATE CASCADE ON DELETE CASCADE,
  PRIMARY KEY (acc_id, cbook_id)
);
CREATE TABLE IF NOT EXISTS contact (
  id UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
  cbook_id UUID REFERENCES contactsbook (id) ON UPDATE CASCADE ON DELETE CASCADE,
  acc_id UUID REFERENCES account (id) ON UPDATE CASCADE ON DELETE CASCADE,
  birth DATE CHECK (birth < CURRENT_DATE),
  -- VARCHAR(50) NOT NULL,
  email VARCHAR(355),
  phone TEXT,
  labels TEXT,
  note TEXT,
  name VARCHAR(40) NOT NULL,
  color VARCHAR(40) CHECK (
    color LIKE 'rgb(%)'
    OR color LIKE 'rgba(%)'
    OR color LIKE '#%'
    OR color LIKE 'hsl(%)'
    OR color LIKE 'hsla(%)'
  ),
  website VARCHAR(355) CHECK (
    website LIKE 'http://%'
    OR website LIKE 'https://%'
  ),
  avatar_url VARCHAR(355)
);
-- for future:
-- CREATE TABLE IF NOT EXISTS label (
--   id UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
--   cbook_id UUID REFERENCES contactsbook (id) ON UPDATE CASCADE ON DELETE CASCADE,
--   acc_id UUID REFERENCES account (id) ON UPDATE CASCADE ON DELETE CASCADE,
--   name VARCHAR(50) NOT NULL,
--   slug VARCHAR(50) NOT NULL,
--   -- pattern to get slug from label name: string.replace(/(?!\w).|_/gm, '-')
--   CONSTRAINT unique_label_per_contactsbook PRIMARY KEY (cbook_id, id)
-- );
-- CREATE TABLE IF NOT EXISTS contact_label (
--   cbook_id UUID REFERENCES contactsbook (id) ON UPDATE CASCADE ON DELETE CASCADE,
--   contact_id UUID REFERENCES contact (id) ON UPDATE CASCADE ON DELETE CASCADE,
--   label_slug VARCHAR(50) NOT NULL REFERENCES label (slug) ON UPDATE CASCADE,
--   PRIMARY KEY (cbook_id, label_slug)
-- );
-- CREATE TABLE IF NOT EXISTS phone (
--   acc_id UUID REFERENCES account (id) ON UPDATE CASCADE ON DELETE CASCADE,
--   contact_id UUID REFERENCES contact (id) ON UPDATE CASCADE ON DELETE CASCADE,
--   country_calling_code SMALLINT,
--   phone_number VARCHAR(15),
--   CONSTRAINT unique_phone_numb_per_account PRIMARY KEY (acc_id, country_calling_code, phone_number)
-- );
CREATE TABLE IF NOT EXISTS meta (
  acc_id UUID PRIMARY KEY REFERENCES account (id) ON UPDATE CASCADE ON DELETE CASCADE,
  last_activated_cbook_id UUID REFERENCES contactsbook (id) ON UPDATE CASCADE ON DELETE RESTRICT,
  last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);
