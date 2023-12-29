-- db/seeders/001_seed_users.sql

-- All users have the same password: 'password'

INSERT INTO users (username, password, email)
VALUES
    ('crud', '$2b$10$Q7BtUtyQIUBTOvz6oB4gB.fnfcigV5s9zyHLhZww8KBWI7cV99d4O', 'support@fleek.network'),
    ('paupenin', '$2b$10$Q7BtUtyQIUBTOvz6oB4gB.fnfcigV5s9zyHLhZww8KBWI7cV99d4O', 'paupenin@gmail.com')
;
