DROP SEQUENCE if exists access_key_id_seq;

DROP table if exists access_key; 

DROP INDEX if exists i__btree__access_key_access_key_id_idx;
DROP INDEX if exists i__btree__access_key_access_key_value_idx;
DROP INDEX if exists i__btree__access_key_deleted_at_idx;
