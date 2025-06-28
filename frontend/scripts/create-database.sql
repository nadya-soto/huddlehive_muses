-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create spaces table
CREATE TABLE IF NOT EXISTS spaces (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    description TEXT,
    website VARCHAR(255),
    phone VARCHAR(50),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    indoor BOOLEAN DEFAULT true,
    outdoor BOOLEAN DEFAULT false,
    wifi BOOLEAN DEFAULT false,
    parking BOOLEAN DEFAULT false,
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create accessibility_features table
CREATE TABLE IF NOT EXISTS accessibility_features (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(10)
);

-- Create space_features junction table
CREATE TABLE IF NOT EXISTS space_features (
    space_id INTEGER REFERENCES spaces(id) ON DELETE CASCADE,
    feature_id INTEGER REFERENCES accessibility_features(id) ON DELETE CASCADE,
    PRIMARY KEY (space_id, feature_id)
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    space_id INTEGER REFERENCES spaces(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_spaces_location ON spaces(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_spaces_type ON spaces(type);
CREATE INDEX IF NOT EXISTS idx_reviews_space ON reviews(space_id);
CREATE INDEX IF NOT EXISTS idx_space_features_space ON space_features(space_id);
