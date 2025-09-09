-- Users
CREATE TABLE IF NOT EXISTS public.users (
    uid SERIAL PRIMARY KEY,
    telephone_number VARCHAR(20),
    fname VARCHAR(50) NOT NULL,
    lname VARCHAR(50) NOT NULL,
    bio TEXT,
    age INT,
    sex VARCHAR(10),
    signup_time TIME DEFAULT CURRENT_TIME,
    signup_date DATE DEFAULT CURRENT_DATE,
    cookie_policy_version_accepted VARCHAR(20),
    cookie_policy_accepted_at TIMESTAMP,
    CONSTRAINT users_age_check CHECK (age > 20)
);

-- Participant
CREATE TABLE IF NOT EXISTS public.participant (
    uid INT NOT NULL REFERENCES public.users(uid) ON DELETE CASCADE,
    credit INT DEFAULT 0,
    status VARCHAR(20),
    PRIMARY KEY (uid)
);

-- Admin
CREATE TABLE IF NOT EXISTS public.admin (
    uid INT NOT NULL REFERENCES public.users(uid) ON DELETE CASCADE,
    admin_type VARCHAR(50),
    PRIMARY KEY (uid)
);

-- Chat Document
CREATE TABLE IF NOT EXISTS public.chat_doc (
    cid SERIAL PRIMARY KEY,
    sdate DATE,
    stime TIME,
    data JSONB
);

-- Event
CREATE TABLE IF NOT EXISTS public.event (
    eid SERIAL PRIMARY KEY,
    cost DECIMAL(10,2),
    name VARCHAR(100) NOT NULL,
    date DATE,
    time TIME,
    place VARCHAR(100),
    capacity INT NOT NULL,
    detail TEXT,
    rating FLOAT,
    uid INT REFERENCES public.users(uid) ON DELETE SET NULL
);

-- Report
CREATE TABLE IF NOT EXISTS public.report (
    rid SERIAL PRIMARY KEY,
    report_type VARCHAR(50),
    report_detail TEXT,
    report_topic VARCHAR(100),
    uid INT REFERENCES public.users(uid) ON DELETE SET NULL,
    eid INT REFERENCES public.event(eid) ON DELETE CASCADE
);

-- Chat
CREATE TABLE IF NOT EXISTS public.chat (
    sender INT NOT NULL REFERENCES public.users(uid) ON DELETE CASCADE,
    receiver INT NOT NULL REFERENCES public.users(uid) ON DELETE CASCADE,
    cid INT NOT NULL REFERENCES public.chat_doc(cid) ON DELETE CASCADE,
    PRIMARY KEY (sender, receiver, cid)
);

-- Befriend
CREATE TABLE IF NOT EXISTS public.befriend (
    uid INT NOT NULL REFERENCES public.users(uid) ON DELETE CASCADE,
    fid INT NOT NULL REFERENCES public.users(uid) ON DELETE CASCADE,
    PRIMARY KEY (uid, fid)
);

-- Joined
CREATE TABLE IF NOT EXISTS public.joined (
    uid INT NOT NULL REFERENCES public.users(uid) ON DELETE CASCADE,
    eid INT NOT NULL REFERENCES public.event(eid) ON DELETE CASCADE,
    PRIMARY KEY (uid, eid)
);

-- Index to speed up queries by date
CREATE INDEX IF NOT EXISTS idx_events_start_time ON public.event (date);
