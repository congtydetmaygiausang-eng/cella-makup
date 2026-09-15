-- ==============================================================================
-- CELLA MIGRATION SCRIPT - PHASE 1 CLEANUP (DROP UNUSED TABLES)
-- M?c tiêu: Xóa v?t lý các b?ng không s? d?ng trong Giai do?n 1.
-- ==============================================================================

DROP TABLE IF EXISTS makeup_looks CASCADE;
DROP TABLE IF EXISTS look_favorites CASCADE;
DROP TABLE IF EXISTS look_reviews CASCADE;
DROP TABLE IF EXISTS cosmetic_products CASCADE;
DROP TABLE IF EXISTS look_products CASCADE;
DROP TABLE IF EXISTS look_video_steps CASCADE;
DROP TABLE IF EXISTS attendances CASCADE;
DROP TABLE IF EXISTS payrolls CASCADE;
