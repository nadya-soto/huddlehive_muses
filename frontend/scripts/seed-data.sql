-- Insert accessibility features
INSERT INTO accessibility_features (name, description, icon) VALUES
('accessible_restrooms', 'Accessible Restrooms', '🚻'),
('inclusive_restrooms', 'Inclusive Restrooms', '🏳️‍⚧️'),
('braille', 'Braille Options', '⠃'),
('lift_access', 'Lift Access', '🛗'),
('step_free', 'Step-Free Access', '♿'),
('auditory_support', 'Auditory Support', '🔊'),
('calm_spaces', 'Calm Spaces', '🧘'),
('trained_staff', 'Trained Staff', '👥'),
('culturally_inclusive', 'Culturally Inclusive', '🌍')
ON CONFLICT DO NOTHING;

-- Insert sample spaces
INSERT INTO spaces (name, type, address, description, latitude, longitude, indoor, outdoor, wifi, parking) VALUES
('Central Community Library', 'library', '123 Main St, Downtown', 'A welcoming library with extensive accessibility features and quiet study areas.', 51.5074, -0.1278, true, false, true, true),
('Harmony Café', 'cafe', '456 Oak Ave, Midtown', 'Cozy café with outdoor seating and a commitment to cultural inclusivity.', 51.5154, -0.1426, true, true, true, false),
('Riverside Park Pavilion', 'park', '789 River Rd, Riverside', 'Beautiful park pavilion perfect for outdoor gatherings and peaceful reflection.', 51.4994, -0.1270, false, true, false, true)
ON CONFLICT DO NOTHING;

-- Link spaces with accessibility features
INSERT INTO space_features (space_id, feature_id) 
SELECT s.id, f.id 
FROM spaces s, accessibility_features f 
WHERE (s.name = 'Central Community Library' AND f.name IN ('step_free', 'braille', 'accessible_restrooms'))
   OR (s.name = 'Harmony Café' AND f.name IN ('accessible_restrooms', 'culturally_inclusive'))
   OR (s.name = 'Riverside Park Pavilion' AND f.name IN ('step_free', 'calm_spaces'))
ON CONFLICT DO NOTHING;
