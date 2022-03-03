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
  chat_id uuid not null default uuid_generate_v4() primary key,
  chat text,
  file_link varchar(128),
  sender_user_id uuid not null references users(user_id) on delete cascade,
  taked_user_id uuid not null references users(user_id) on delete cascade,
  created_at timestamptz default CURRENT_TIMESTAMP
);

create index chat_idx on chat(chat_id);

create table web_push (
  user_id uuid not null references users(user_id) on delete cascade,
  endpoint_b text not null,
  expiration_time varchar(16),
  p256dh varchar(128) not null,
  auth varchar(64) not null
);