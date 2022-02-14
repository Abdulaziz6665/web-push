create database push
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

create table users (
  user_id uuid not null default uuid_generate_v4() primary key,
  user_name varchar(32) not null,
  user_pass varchar(64) not null,
  created_at timestamptz default CURRENT_TIMESTAMP
);

create index users_idx on users(user_id)

create table chat (
  chat text,
  sender_user_id uuid not null references users(user_id),
  taked_user_id uuid not null references users(user_id),
  created_at timestamptz default CURRENT_TIMESTAMP
);

create table files (
  file_id uuid not null default uuid_generate_v4() primary key,
  file_link varchar(128),
  sender_user_id uuid not null references users(user_id),
  taked_user_id uuid not null references users(user_id),
  created_at timestamptz default CURRENT_TIMESTAMP
);

