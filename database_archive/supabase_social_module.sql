-- ==============================================================================
-- CELLA - MODULE MẠNG XÃ HỘI NỘI BỘ & ĐÁNH GIÁ (SUPABASE SQL)
-- Gồm: Đăng bài, Thích, Bình luận, Đánh giá nhân sự, Cập nhật ảnh bìa
-- ==============================================================================

-- 1. Bổ sung ảnh bìa (cover_url) cho bảng profiles (để thay đổi ảnh bìa)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cover_url TEXT DEFAULT 'https://images.unsplash.com/photo-1512496015851-a1dc8a477d70?auto=format&fit=crop&w=1200&q=80';

-- ==============================================================================
-- 2. BẢNG BÀI VIẾT (Posts)
-- Dùng cho trang cá nhân, đăng bài như Zalo/Facebook
CREATE TABLE IF NOT EXISTS posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT,
    image_url TEXT, -- Ảnh đính kèm bài viết
    likes_count INT DEFAULT 0,
    comments_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger tự động cập nhật ngày sửa (updated_at)
DROP TRIGGER IF EXISTS trg_posts_updated_at ON posts;
CREATE TRIGGER trg_posts_updated_at
BEFORE UPDATE ON posts
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ==============================================================================
-- 3. BẢNG LƯỢT THÍCH BÀI VIẾT (Post Likes)
CREATE TABLE IF NOT EXISTS post_likes (
    post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (post_id, user_id)
);

-- ==============================================================================
-- 4. BẢNG BÌNH LUẬN (Post Comments)
CREATE TABLE IF NOT EXISTS post_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

DROP TRIGGER IF EXISTS trg_post_comments_updated_at ON post_comments;
CREATE TRIGGER trg_post_comments_updated_at
BEFORE UPDATE ON post_comments
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ==============================================================================
-- 5. BẢNG ĐÁNH GIÁ NHÂN SỰ (Staff Reviews)
CREATE TABLE IF NOT EXISTS staff_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    content TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);


-- ==============================================================================
-- 6. PHÂN QUYỀN TRUY CẬP (Row Level Security)
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_reviews ENABLE ROW LEVEL SECURITY;

-- Post Policies
CREATE POLICY "Mọi người có thể xem bài viết" ON posts FOR SELECT USING (true);
CREATE POLICY "Tác giả có thể đăng bài" ON posts FOR INSERT WITH CHECK (auth.uid() = author_id OR auth.role() = 'authenticated');
CREATE POLICY "Tác giả sửa bài viết" ON posts FOR UPDATE USING (auth.uid() = author_id);
CREATE POLICY "Tác giả xóa bài viết" ON posts FOR DELETE USING (auth.uid() = author_id);

-- Like Policies
CREATE POLICY "Mọi người có thể xem lượt thích" ON post_likes FOR SELECT USING (true);
CREATE POLICY "Có thể thả tim" ON post_likes FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.role() = 'authenticated');
CREATE POLICY "Có thể bỏ thả tim" ON post_likes FOR DELETE USING (auth.uid() = user_id);

-- Comment Policies
CREATE POLICY "Mọi người có thể xem bình luận" ON post_comments FOR SELECT USING (true);
CREATE POLICY "Có thể bình luận" ON post_comments FOR INSERT WITH CHECK (auth.uid() = author_id OR auth.role() = 'authenticated');

-- Review Policies
CREATE POLICY "Mọi người có thể xem đánh giá" ON staff_reviews FOR SELECT USING (true);
CREATE POLICY "Có thể đánh giá nhân sự" ON staff_reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_id OR auth.role() = 'authenticated');
