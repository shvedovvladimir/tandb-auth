CREATE SEQUENCE token_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

create table if not exists token (
    token_id bigint NOT NULL PRIMARY KEY DEFAULT nextval('token_id_seq'::regclass),
    access_key character varying(255),
    token_value text,
    token_type character varying(255) DEFAULT 'SIMPLE_TOKEN',
    token_meta jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone,
    expires_in bigint
);

create index if not exists i__btree__token_value_idx
	on token (token_value);

create index if not exists i__btree__token_access_key_idx
	on token (access_key);

create index if not exists i__btree__token_deleted_at_idx
	on token (deleted_at);

create index if not exists i__btree__token_token_id_idx
	on token (token_id);

create index if not exists i__btree__token_expires_in_idx
	on token (expires_in);
