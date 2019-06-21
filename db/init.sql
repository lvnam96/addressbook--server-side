--install extension uuid generator
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS account (
    id UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    username VARCHAR(20) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    facebook_id VARCHAR(255) UNIQUE,
    birth DATE CHECK (birth < CURRENT_DATE),
    email VARCHAR(355) UNIQUE CHECK (email LIKE '%@%'),
    phone VARCHAR(15),
    nicename VARCHAR(25),
    created_on TIMESTAMP NOT NULL,
    last_login TIMESTAMP,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    salt CHAR(10) NOT NULL
);

CREATE TABLE IF NOT EXISTS addressbook (
    id UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    -- account_id UUID REFERENCES account (id) ON UPDATE CASCADE ON DELETE SET NULL,
    name VARCHAR(25),
    color VARCHAR(30) CHECK (color LIKE 'rgb(%)' OR color LIKE 'rgba(%)' OR color LIKE '#%' OR color LIKE 'hsl(%)')
);

--prepare for future feature: share addressbook to other users
CREATE TABLE IF NOT EXISTS account_addressbook (
    account_id UUID REFERENCES account (id) ON UPDATE CASCADE ON DELETE CASCADE,
    addressbook_id UUID REFERENCES addressbook (id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS contact (
    id UUID PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
    addressbook_id UUID REFERENCES addressbook (id) ON UPDATE CASCADE ON DELETE CASCADE,
    account_id UUID REFERENCES account (id) ON UPDATE CASCADE ON DELETE SET NULL,
    birth DATE CHECK (birth < CURRENT_DATE),
    email VARCHAR(355),
    phone VARCHAR(15),
    note TEXT,
    name VARCHAR(30) NOT NULL,
    color VARCHAR(30) CHECK (color LIKE 'rgb(%)' OR color LIKE 'rgba(%)' OR color LIKE '#%' OR color LIKE 'hsl(%)'),
    website VARCHAR(355) CHECK (website LIKE 'http://%' OR website LIKE 'https://%'),
    labels VARCHAR(300),
    avatar_url VARCHAR(355)
);
