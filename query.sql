CREATE DATABASE IF NOT EXISTS ueq;

USE ueq;

CREATE TABLE IF NOT EXISTS responses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(255),
    usia ENUM('< 20 tahun', '20 - 30 tahun', '30 - 40 tahun', '> 40 tahun') NOT NULL,
    gender VARCHAR(10),
    A1 INT, P1 INT, N1 INT,
    P2 INT, S1 INT, S2 INT,
    S3 INT, D1 INT, E1 INT,
    N2 INT, D2 INT, A2 INT,
    P3 INT, A3 INT, N3 INT,
    A4 INT, D3 INT, S4 INT,
    D4 INT, E2 INT, P4 INT,
    E3 INT, E4 INT, A5 INT,
    A6 INT, N4 INT
);
