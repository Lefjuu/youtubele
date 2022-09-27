CREATE TABLE users (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(100) NOT NULL,
    profilePicture VARCHAR(255),
    coverPicture VARCHAR(255),
    followers VARCHAR ARRAY DEFAULT null,
    followings VARCHAR ARRAY DEFAULT null
);

CREATE TABLE users (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(100) NOT NULL,
    profilePicture VARCHAR(255),
    coverPicture VARCHAR(255),
    followers INTEGER[],
    followings INTEGER[]
);

CREATE TABLE videos (
    id BIGSERIAL NOT NULL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    video VARCHAR(255) NOT NULL,
    thumbnail VARCHAR(255) NOT NULL,
    author VARCHAR(50) NOT NULL,
    description TEXT,
    views INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    dislikes INTEGER DEFAULT 0,
    createdAt DATE default CURRENT_DATE
);
    -- timestamp timestamp default current_timestamp