-- PostgreSQL Database Schema for AstroFlix

-- Drop tables if they exist (for clean initialization)
DROP TABLE IF EXISTS bookmarks CASCADE;
DROP TABLE IF EXISTS episodes CASCADE;
DROP TABLE IF EXISTS series CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for frequently queried fields
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);

-- Series table
CREATE TABLE series (
    id SERIAL PRIMARY KEY,
    image_url TEXT NOT NULL,
    backdrop TEXT,
    title VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    genre VARCHAR(255),
    release_date DATE,
    status VARCHAR(100),
    rating NUMERIC(3, 1),
    total_episodes INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for series title searches
CREATE INDEX idx_series_title ON series(title);

-- Episodes table
CREATE TABLE episodes (
    id SERIAL PRIMARY KEY,
    url TEXT UNIQUE NOT NULL,
    title VARCHAR(255) UNIQUE NOT NULL,
    episode_number INTEGER NOT NULL,
    season INTEGER DEFAULT 1,
    series_id INTEGER REFERENCES series(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for episode queries
CREATE INDEX idx_episodes_series_id ON episodes(series_id);
CREATE INDEX idx_episodes_title ON episodes(title);

-- Bookmarks junction table (many-to-many relationship between users and series)
CREATE TABLE bookmarks (
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    series_id INTEGER REFERENCES series(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, series_id)
);

-- Create indexes for bookmark queries
CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX idx_bookmarks_series_id ON bookmarks(series_id);
