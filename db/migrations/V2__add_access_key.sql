CREATE SEQUENCE access_key_id_seq
	INCREMENT BY 1
	MINVALUE 1
	MAXVALUE 2147483647
	START 1
	CACHE 1
	NO CYCLE;

create table if not exists access_key (
    access_key_id bigint NOT NULL PRIMARY KEY DEFAULT nextval('access_key_id_seq'::regclass),
    access_key_value character varying(255) NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    deleted_at timestamp with time zone
);

create index if not exists i__btree__access_key_access_key_id_idx
	on access_key (access_key_id);

create index if not exists i__btree__access_key_access_key_value_idx
	on access_key (access_key_value);

create index if not exists i__btree__access_key_deleted_at_idx
	on access_key (deleted_at);
