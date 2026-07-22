-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.login (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  Location character varying NOT NULL,
  Emp_name character varying,
  IP character varying,
  CONSTRAINT login_pkey PRIMARY KEY (id, Location)
);
CREATE TABLE public.attendance_completions (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  Location character varying NOT NULL,
  device_id character varying,
  Employee name character varying,
  selfie Image character varying,
  Stall Image character varying,
  IP Address character varying,
  CONSTRAINT attendance_completions_pkey PRIMARY KEY (id, Location)
);
CREATE TABLE public.app_logs (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  type character varying,
  message character varying,
  severity character varying,
  location character varying,
  CONSTRAINT app_logs_pkey PRIMARY KEY (id)
);
CREATE TABLE public.Login_history (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  Location character varying NOT NULL,
  IP character varying,
  Device ID character varying,
  CONSTRAINT Login_history_pkey PRIMARY KEY (Location),
  CONSTRAINT Login_history_Location_fkey FOREIGN KEY (Location) REFERENCES public.Login_history(Location)
);