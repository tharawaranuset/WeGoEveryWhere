--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.4 (Debian 17.4-1.pgdg120+2)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;


--
-- Name: EXTENSION pgcrypto; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pgcrypto IS 'cryptographic functions';


--
-- Name: countuserjoins(); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.countuserjoins()
    LANGUAGE plpgsql
    AS $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT u.fname, COUNT(j.eid) AS event_count
        FROM users u
        JOIN joined j ON u.uid = j.uid
        GROUP BY u.uid, u.fname
    LOOP
        RAISE NOTICE 'User % joined % events.', r.fname, r.event_count;
    END LOOP;
END;
$$;


ALTER PROCEDURE public.countuserjoins() OWNER TO postgres;

--
-- Name: countuserjoinsover(integer); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.countuserjoinsover(IN min_events integer)
    LANGUAGE plpgsql
    AS $$
DECLARE
    u RECORD;
    e RECORD;
BEGIN
    FOR u IN
        SELECT usr.uid, usr.fname, usr.lname, COUNT(j.eid) AS event_count
        FROM users usr
        JOIN joined j ON usr.uid = j.uid
        GROUP BY usr.uid, usr.fname, usr.lname
        HAVING COUNT(j.eid) >= min_events
    LOOP
        RAISE NOTICE 'User ID: %, Name: % %, joined % events:',
            u.uid, u.fname, u.lname, u.event_count;

        FOR e IN
            SELECT ev.name
            FROM joined j
            JOIN event ev ON j.eid = ev.eid
            WHERE j.uid = u.uid
        LOOP
            RAISE NOTICE ' - %', e.name;
        END LOOP;
    END LOOP;
END;
$$;


ALTER PROCEDURE public.countuserjoinsover(IN min_events integer) OWNER TO postgres;

--
-- Name: geteventcapacityusage(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.geteventcapacityusage(eid_input integer) RETURNS numeric
    LANGUAGE plpgsql
    AS $$
DECLARE
    joined_count INT;
    max_capacity INT;
    usage_ratio NUMERIC(5,2);
BEGIN
    -- à¸”à¸¶à¸‡à¸„à¸§à¸²à¸¡à¸ˆà¸¸à¸ªà¸¹à¸‡à¸ªà¸¸à¸”
    SELECT capacity INTO max_capacity FROM event WHERE eid = eid_input;

    -- à¸–à¹‰à¸²à¹„à¸¡à¹ˆà¹€à¸ˆà¸­ event
    IF max_capacity IS NULL OR max_capacity = 0 THEN
        RAISE EXCEPTION 'Event ID % not found or has invalid capacity', eid_input;
    END IF;

    -- à¸ˆà¸³à¸™à¸§à¸™à¸„à¸™à¹€à¸‚à¹‰à¸²à¸£à¹ˆà¸§à¸¡
    SELECT COUNT(*) INTO joined_count FROM joined WHERE eid = eid_input;

    -- à¸„à¸³à¸™à¸§à¸“à¹€à¸›à¸­à¸£à¹Œà¹€à¸‹à¹‡à¸™à¸•à¹Œ
    usage_ratio := (joined_count::NUMERIC / max_capacity) * 100;

    RETURN usage_ratio;
END;
$$;


ALTER FUNCTION public.geteventcapacityusage(eid_input integer) OWNER TO postgres;

--
-- Name: getfriendsinsameevent(); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.getfriendsinsameevent()
    LANGUAGE plpgsql
    AS $$
BEGIN
    SELECT DISTINCT 
        u1.fname AS user_name,
        u2.fname AS friend_name,
        e.name AS event_name,
        e.date, e.time
    FROM be_friend bf
    JOIN joined j1 ON bf.uid = j1.uid
    JOIN joined j2 ON bf.fid = j2.uid
    JOIN event e ON j1.eid = e.eid AND j2.eid = e.eid
    JOIN users u1 ON bf.uid = u1.uid
    JOIN users u2 ON bf.fid = u2.uid
    WHERE bf.uid < bf.fid;  -- à¸›à¹‰à¸­à¸‡à¸à¸±à¸™à¸‚à¹‰à¸­à¸¡à¸¹à¸¥à¸‹à¹‰à¸³ (uid-fid à¸à¸±à¸š fid-uid)
END $$;


ALTER PROCEDURE public.getfriendsinsameevent() OWNER TO postgres;

--
-- Name: getfullusereventdetails(integer); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.getfullusereventdetails(IN input_uid integer)
    LANGUAGE plpgsql
    AS $$
BEGIN
    SELECT u.fname, u.lname, e.name AS event_name, e.date, e.place
    FROM joined j
    JOIN users u ON j.uid = u.uid
    JOIN event e ON j.eid = e.eid
    WHERE j.uid = input_uid;
END $$;


ALTER PROCEDURE public.getfullusereventdetails(IN input_uid integer) OWNER TO postgres;

--
-- Name: notify_moderator_on_report(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.notify_moderator_on_report() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  new_cid INTEGER;
BEGIN
  -- Insert chat message as JSON
  INSERT INTO chat_doc(sdate, stime, data)
  VALUES (
    CURRENT_DATE,
    CURRENT_TIME,
    jsonb_build_object(
      'user', NEW.uid,
      'topic', NEW.report_topic,
      'detail', NEW.report_detail
    )
  )
  RETURNING cid INTO new_cid;

  -- Send to moderator (assume uid = 1)
  INSERT INTO chat(sender, receiver, cid)
  VALUES (NEW.uid, 1, new_cid);

  RETURN NEW;
END;
$$;


ALTER FUNCTION public.notify_moderator_on_report() OWNER TO postgres;

--
-- Name: prevent_overbooking(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.prevent_overbooking() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
  current_count INT;
  max_capacity INT;
BEGIN
  SELECT COUNT(*) INTO current_count FROM joined WHERE eid = NEW.eid;
  SELECT capacity INTO max_capacity FROM event WHERE eid = NEW.eid;

  IF current_count >= max_capacity THEN
    RAISE EXCEPTION 'This event is already full.';
  END IF;

  RETURN NEW;
END;
$$;


ALTER FUNCTION public.prevent_overbooking() OWNER TO postgres;

--
-- Name: suggestfriendbysharedevents(integer); Type: PROCEDURE; Schema: public; Owner: postgres
--

CREATE PROCEDURE public.suggestfriendbysharedevents(IN uid_input integer)
    LANGUAGE plpgsql
    AS $$
DECLARE
    suggested RECORD;
BEGIN
    FOR suggested IN
        SELECT DISTINCT u.uid, u.fname, u.lname, u.age, u.sex, u.telephone_number
        FROM joined j1
        JOIN joined j2 ON j1.eid = j2.eid
        JOIN users u ON u.uid = j2.uid
        WHERE j1.uid = uid_input
          AND j2.uid != uid_input
          AND j2.uid NOT IN (
              SELECT fid FROM be_friend WHERE uid = uid_input
              UNION
              SELECT uid FROM be_friend WHERE fid = uid_input
          )
    LOOP
        RAISE NOTICE 'Suggest UID: %, Name: % %, Age: %, Sex: %, Tel: %',
            suggested.uid, suggested.fname, suggested.lname,
            suggested.age, suggested.sex, suggested.telephone_number;
    END LOOP;
END;
$$;


ALTER PROCEDURE public.suggestfriendbysharedevents(IN uid_input integer) OWNER TO postgres;

--
-- Name: userlevel(integer); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.userlevel(uid_input integer) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
    join_count INT;
    level TEXT;
BEGIN
	IF NOT EXISTS (SELECT 1 FROM users WHERE uid = uid_input) THEN
        RAISE EXCEPTION 'User ID % does not exist', uid_input;
    END IF;
	
    SELECT COUNT(*) INTO join_count
    FROM joined
    WHERE uid = uid_input;

    IF join_count = 0 THEN
        level := 'Inactive';
    ELSIF join_count <= 2 THEN
        level := 'Newbie';
    ELSIF join_count <= 4 THEN
        level := 'Active';
    ELSE
        level := 'Champion';
    END IF;

    RETURN level;
END;
$$;


ALTER FUNCTION public.userlevel(uid_input integer) OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admin; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admin (
    uid integer NOT NULL,
    admin_type character varying(50)
);


ALTER TABLE public.admin OWNER TO postgres;

--
-- Name: be_friend; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.be_friend (
    uid integer NOT NULL,
    fid integer NOT NULL
);


ALTER TABLE public.be_friend OWNER TO postgres;

--
-- Name: chat; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chat (
    sender integer NOT NULL,
    receiver integer NOT NULL,
    cid integer NOT NULL
);


ALTER TABLE public.chat OWNER TO postgres;

--
-- Name: chat_doc; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chat_doc (
    cid integer NOT NULL,
    sdate date,
    stime time without time zone,
    data jsonb
);


ALTER TABLE public.chat_doc OWNER TO postgres;

--
-- Name: chat_doc_cid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.chat_doc_cid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.chat_doc_cid_seq OWNER TO postgres;

--
-- Name: chat_doc_cid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.chat_doc_cid_seq OWNED BY public.chat_doc.cid;


--
-- Name: event; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.event (
    eid integer NOT NULL,
    cost numeric(10,2) DEFAULT 0.00,
    name character varying(100) NOT NULL,
    date date,
    "time" time without time zone,
    place character varying(100),
    capacity integer NOT NULL,
    detail text,
    rating double precision DEFAULT 0,
    uid integer
);


ALTER TABLE public.event OWNER TO postgres;

--
-- Name: event_eid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.event_eid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.event_eid_seq OWNER TO postgres;

--
-- Name: event_eid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.event_eid_seq OWNED BY public.event.eid;


--
-- Name: joined; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.joined (
    uid integer NOT NULL,
    eid integer NOT NULL
);


ALTER TABLE public.joined OWNER TO postgres;

--
-- Name: participant; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.participant (
    uid integer NOT NULL,
    credit integer DEFAULT 0,
    status character varying(20)
);


ALTER TABLE public.participant OWNER TO postgres;

--
-- Name: report; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.report (
    rid integer NOT NULL,
    report_type character varying(50),
    report_detail text,
    report_topic character varying(100),
    uid integer
);


ALTER TABLE public.report OWNER TO postgres;

--
-- Name: report_rid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.report_rid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.report_rid_seq OWNER TO postgres;

--
-- Name: report_rid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.report_rid_seq OWNED BY public.report.rid;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    uid integer NOT NULL,
    telephone_number character varying(20),
    fname character varying(50) NOT NULL,
    lname character varying(50) NOT NULL,
    bio text,
    age integer,
    sex character varying(10),
    signup_time time without time zone,
    signup_date date,
    CONSTRAINT users_age_check CHECK ((age > 20))
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_uid_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_uid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_uid_seq OWNER TO postgres;

--
-- Name: users_uid_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_uid_seq OWNED BY public.users.uid;


--
-- Name: chat_doc cid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_doc ALTER COLUMN cid SET DEFAULT nextval('public.chat_doc_cid_seq'::regclass);


--
-- Name: event eid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event ALTER COLUMN eid SET DEFAULT nextval('public.event_eid_seq'::regclass);


--
-- Name: report rid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.report ALTER COLUMN rid SET DEFAULT nextval('public.report_rid_seq'::regclass);


--
-- Name: users uid; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN uid SET DEFAULT nextval('public.users_uid_seq'::regclass);


--
-- Data for Name: admin; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admin (uid, admin_type) FROM stdin;
2	SuperAdmin
4	Moderator
6	SystemAdmin
\.


--
-- Data for Name: be_friend; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.be_friend (uid, fid) FROM stdin;
2	3
3	4
4	5
\.


--
-- Data for Name: chat; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chat (sender, receiver, cid) FROM stdin;
2	3	2
3	4	3
4	5	4
\.


--
-- Data for Name: chat_doc; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chat_doc (cid, sdate, stime, data) FROM stdin;
1	2025-04-01	08:35:00	{"message": "Hello, how are you?"}
2	2025-04-02	09:20:00	{"message": "I need help with a problem."}
3	2025-04-03	10:05:00	{"message": "What time is the meeting?"}
4	2025-04-04	14:35:00	{"message": "Let's meet for coffee later!"}
5	2025-04-05	15:50:00	{"message": "Good afternoon, everyone."}
6	2025-04-17	15:11:30.248975	{"user": 201, "topic": "Inappropriate Event", "detail": "This is test content flagged"}
7	2025-04-19	16:00:00	{"message": "This is a test message from uid 1"}
8	2025-04-19	07:06:48.518639	{"user": 1, "topic": "Cascade Test", "detail": "Testing cascade delete with uid=1"}
\.


--
-- Data for Name: event; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.event (eid, cost, name, date, "time", place, capacity, detail, rating, uid) FROM stdin;
2	50.00	Sports Day	2025-05-10	10:00:00	Stadium	200	A day full of sports activities.	0	2
3	30.00	Book Fair	2025-05-15	12:00:00	Library	100	A fair showcasing books and authors.	0	3
999	0.00	Test Event	2025-04-17	14:58:36.520109	Test Place	4	Just a test	5	2
10	20.00	Hiking Adventure	2025-06-01	08:00:00	National Park	50	A group hiking day through scenic trails.	4.3	4
11	15.00	Book Club Gathering	2025-06-10	18:00:00	Library Room B	20	Discussing our monthly reading pick.	4.7	4
12	10.00	Evening Yoga	2025-06-15	17:30:00	Community Hall	30	Relaxing yoga for all skill levels.	4.4	4
13	0.00	Free Coding Workshop	2025-06-20	13:00:00	Tech Center	40	Introductory session to Python.	4.8	4
14	25.00	Photography Walk	2025-06-25	09:30:00	Old Town	15	Guided photo walk through historical areas.	4.6	4
15	5.00	Board Game Night	2025-06-30	19:00:00	Cafe Corner	25	Casual evening with strategy and party games.	4.5	4
4	10.00	Tech Meet-Up	2025-06-01	13:00:00	Tech Hub	80	A meetup for tech enthusiasts.	4	4
5	15.00	Cooking Class	2025-06-10	14:00:00	Community Center	11	A cooking workshop for beginners.	0	5
7	0.00	Tech Conference	2025-05-01	10:00:00	Hall A	12	Tech talks & workshops	4.6	14
8	0.00	AI Bootcamp	2025-05-05	13:00:00	Lab 2	12	Hands-on AI coding	4.8	14
9	0.00	Cloud Summit	2025-05-10	09:00:00	Conference Center	12	Cloud Infrastructure	4.5	14
\.


--
-- Data for Name: joined; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.joined (uid, eid) FROM stdin;
3	14
2	2
3	3
4	4
5	5
2	999
3	999
5	999
4	999
2	5
3	11
4	11
9	11
8	11
12	11
4	9
5	9
8	9
9	9
10	9
11	9
12	9
13	9
6	9
3	9
3	8
4	8
5	8
8	8
9	8
10	8
11	8
12	8
13	8
6	8
3	7
4	7
5	7
8	7
9	7
10	7
11	7
12	7
13	7
6	7
5	15
9	15
10	15
13	15
14	15
3	13
8	13
10	13
11	13
14	13
5	12
6	12
9	12
10	12
13	12
3	10
4	10
5	10
6	10
9	10
4	14
6	14
9	14
11	14
12	14
\.


--
-- Data for Name: participant; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.participant (uid, credit, status) FROM stdin;
2	150	Active
3	50	Inactive
4	200	Active
5	75	Inactive
6	80	Active
8	90	Active
9	70	Active
10	50	Active
14	100	Active
\.


--
-- Data for Name: report; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.report (rid, report_type, report_detail, report_topic, uid) FROM stdin;
2	Abuse	Inappropriate behavior in chat.	User Behavior	2
3	Bug	App crashes during login.	Technical Issue	3
4	Feature Request	Would like to see dark mode.	Suggestions	4
5	Complaint	Event was canceled without notice.	Event Management	5
501	Abuse	This is test content flagged	Inappropriate Event	201
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (uid, telephone_number, fname, lname, bio, age, sex, signup_time, signup_date) FROM stdin;
3	0809876543	Alice	Brown	A software engineer.	28	Female	10:00:00	2025-04-03
4	0912345678	Bob	White	Loves sports.	35	Male	14:30:00	2025-04-04
5	0898765432	Charlie	Green	A teacher and book lover.	40	Male	15:45:00	2025-04-05
2	0902345678	Jane	Smith	Enjoys playing chess.	21	Female	09:15:00	2025-04-02
11	0844444444	Dana	Organizer	Experienced event organizer and host.	30	Female	11:45:00	2024-01-01
8	0811111111	Alice	Active	Enjoys outdoor events and tech meetups.	25	Female	09:00:00	2024-01-01
201	0812345678	Test	User201	Test participant for trigger	22	Male	15:06:14.291874	2025-04-17
13	0866666666	Frank	Friendly	Social butterfly and active participant.	23	Male	16:50:00	2024-01-01
10	0833333333	Charlie	Talkative	Loves networking and group chats.	27	Male	14:30:00	2024-01-01
9	0822222222	Bob	Quiet	Silent but curious participant.	26	Male	10:15:00	2024-01-01
6	0811111111	David	Blue	System Admin	32	Male	11:00:00	2025-04-10
12	0855555555	Eli	Elite	Tech-savvy and community builder.	35	Male	08:20:00	2024-01-01
14	0998765432	Kevin	Nguyen	Backend developer with interest in scalable systems and DevOps.	26	Male	10:45:00	2025-04-20
\.


--
-- Name: chat_doc_cid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.chat_doc_cid_seq', 8, true);


--
-- Name: event_eid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.event_eid_seq', 16, true);


--
-- Name: report_rid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.report_rid_seq', 6, true);


--
-- Name: users_uid_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_uid_seq', 14, true);


--
-- Name: admin admin_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_pkey PRIMARY KEY (uid);


--
-- Name: be_friend be_friend_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.be_friend
    ADD CONSTRAINT be_friend_pkey PRIMARY KEY (uid, fid);


--
-- Name: chat_doc chat_doc_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_doc
    ADD CONSTRAINT chat_doc_pkey PRIMARY KEY (cid);


--
-- Name: chat chat_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat
    ADD CONSTRAINT chat_pkey PRIMARY KEY (sender, receiver, cid);


--
-- Name: event event_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event
    ADD CONSTRAINT event_pkey PRIMARY KEY (eid);


--
-- Name: joined joined_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.joined
    ADD CONSTRAINT joined_pkey PRIMARY KEY (uid, eid);


--
-- Name: participant participant_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participant
    ADD CONSTRAINT participant_pkey PRIMARY KEY (uid);


--
-- Name: report report_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.report
    ADD CONSTRAINT report_pkey PRIMARY KEY (rid);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (uid);


--
-- Name: idx_events_start_time; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_events_start_time ON public.event USING btree (date);


--
-- Name: report trg_notify_moderator; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_notify_moderator AFTER INSERT ON public.report FOR EACH ROW EXECUTE FUNCTION public.notify_moderator_on_report();


--
-- Name: joined trg_prevent_overbooking; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER trg_prevent_overbooking BEFORE INSERT ON public.joined FOR EACH ROW EXECUTE FUNCTION public.prevent_overbooking();


--
-- Name: admin admin_uid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admin
    ADD CONSTRAINT admin_uid_fkey FOREIGN KEY (uid) REFERENCES public.users(uid) ON DELETE CASCADE;


--
-- Name: be_friend be_friend_fid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.be_friend
    ADD CONSTRAINT be_friend_fid_fkey FOREIGN KEY (fid) REFERENCES public.users(uid) ON DELETE CASCADE;


--
-- Name: be_friend be_friend_uid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.be_friend
    ADD CONSTRAINT be_friend_uid_fkey FOREIGN KEY (uid) REFERENCES public.users(uid) ON DELETE CASCADE;


--
-- Name: chat chat_cid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat
    ADD CONSTRAINT chat_cid_fkey FOREIGN KEY (cid) REFERENCES public.chat_doc(cid);


--
-- Name: chat chat_receiver_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat
    ADD CONSTRAINT chat_receiver_fkey FOREIGN KEY (receiver) REFERENCES public.users(uid) ON DELETE CASCADE;


--
-- Name: chat chat_sender_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat
    ADD CONSTRAINT chat_sender_fkey FOREIGN KEY (sender) REFERENCES public.users(uid) ON DELETE CASCADE;


--
-- Name: event event_uid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.event
    ADD CONSTRAINT event_uid_fkey FOREIGN KEY (uid) REFERENCES public.users(uid) ON DELETE CASCADE;


--
-- Name: joined joined_eid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.joined
    ADD CONSTRAINT joined_eid_fkey FOREIGN KEY (eid) REFERENCES public.event(eid);


--
-- Name: joined joined_uid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.joined
    ADD CONSTRAINT joined_uid_fkey FOREIGN KEY (uid) REFERENCES public.users(uid) ON DELETE CASCADE;


--
-- Name: participant participant_uid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participant
    ADD CONSTRAINT participant_uid_fkey FOREIGN KEY (uid) REFERENCES public.users(uid) ON DELETE CASCADE;


--
-- Name: report report_uid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.report
    ADD CONSTRAINT report_uid_fkey FOREIGN KEY (uid) REFERENCES public.users(uid) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

