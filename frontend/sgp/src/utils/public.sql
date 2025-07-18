--
-- PostgreSQL database dump
--

-- Dumped from database version 17.5
-- Dumped by pg_dump version 17.5

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


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: abastecimentoviatura; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.abastecimentoviatura (
    id integer NOT NULL,
    placa character varying,
    valor numeric,
    kilometroabastecimento character varying,
    plantao_id integer NOT NULL
);


ALTER TABLE public.abastecimentoviatura OWNER TO postgres;

--
-- Name: abastecimentoviatura_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.abastecimentoviatura ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.abastecimentoviatura_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: agentes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.agentes (
    id integer NOT NULL,
    nome character varying NOT NULL,
    plantao_id integer NOT NULL,
    cargo character varying
);


ALTER TABLE public.agentes OWNER TO postgres;

--
-- Name: agentes_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.agentes ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.agentes_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: motorista; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.motorista (
    id integer NOT NULL,
    nome character varying NOT NULL,
    plantao_id integer NOT NULL
);


ALTER TABLE public.motorista OWNER TO postgres;

--
-- Name: motorista_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.motorista ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.motorista_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: movimentacaoviatura; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.movimentacaoviatura (
    id integer NOT NULL,
    placa character varying NOT NULL,
    kminicial character varying,
    kmfinal character varying,
    plantao_id integer NOT NULL
);


ALTER TABLE public.movimentacaoviatura OWNER TO postgres;

--
-- Name: movimentacaoviatura_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.movimentacaoviatura ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.movimentacaoviatura_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: plantao; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.plantao (
    id integer NOT NULL,
    data_inicio timestamp without time zone NOT NULL,
    data_fim timestamp without time zone NOT NULL,
    observacoes text NOT NULL
);


ALTER TABLE public.plantao OWNER TO postgres;

--
-- Name: plantao_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.plantao ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.plantao_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: abastecimentoviatura abastecimentoviatura_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.abastecimentoviatura
    ADD CONSTRAINT abastecimentoviatura_pk PRIMARY KEY (id);


--
-- Name: agentes agentes_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agentes
    ADD CONSTRAINT agentes_pk PRIMARY KEY (id);


--
-- Name: motorista motorista_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.motorista
    ADD CONSTRAINT motorista_pk PRIMARY KEY (id);


--
-- Name: movimentacaoviatura movimentacaoviatura_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimentacaoviatura
    ADD CONSTRAINT movimentacaoviatura_pk PRIMARY KEY (id);


--
-- Name: plantao plantao_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.plantao
    ADD CONSTRAINT plantao_pk PRIMARY KEY (id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: abastecimentoviatura fk_abastecimentoviatura_plantao; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.abastecimentoviatura
    ADD CONSTRAINT fk_abastecimentoviatura_plantao FOREIGN KEY (plantao_id) REFERENCES public.plantao(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: agentes fk_agentes_plantao; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.agentes
    ADD CONSTRAINT fk_agentes_plantao FOREIGN KEY (plantao_id) REFERENCES public.plantao(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: motorista fk_motorista_plantao; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.motorista
    ADD CONSTRAINT fk_motorista_plantao FOREIGN KEY (plantao_id) REFERENCES public.plantao(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: movimentacaoviatura fk_movimentacaoviatura_plantao; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.movimentacaoviatura
    ADD CONSTRAINT fk_movimentacaoviatura_plantao FOREIGN KEY (plantao_id) REFERENCES public.plantao(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

