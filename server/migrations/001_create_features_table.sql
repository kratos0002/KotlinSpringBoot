-- Create features table
CREATE TABLE IF NOT EXISTS features (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  votes INTEGER DEFAULT 0,
  category TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial features
INSERT INTO features (name, description, icon, votes, category) VALUES
  ('Pet Service Directory', 'Find and book local pet services like grooming, walking, and sitting', 'paw-print', 0, 'services'),
  ('Pet Owner Community', 'Connect with other pet owners in your area', 'users', 0, 'community'),
  ('Pet Health Tracker', 'Keep track of your pet''s health records and appointments', 'heart', 0, 'health'),
  ('Lost & Found Pets', 'Report and find lost pets in your neighborhood', 'search', 0, 'safety'); 