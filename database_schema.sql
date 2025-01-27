-- Creación de Tablas:

-- Tabla de administradores
CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Tabla de votantes
CREATE TABLE voters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    document VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    dob DATE NOT NULL,
    is_candidate TINYINT(1) NOT NULL DEFAULT 0,
    INDEX (is_candidate)
);

-- Tabla de votos
CREATE TABLE votes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    candidate_id INT NOT NULL,
    candidate_voted_id INT NOT NULL,
    date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (candidate_id) REFERENCES voters (id) ON DELETE CASCADE,
    FOREIGN KEY (candidate_voted_id) REFERENCES voters (id) ON DELETE CASCADE,
    INDEX (candidate_id),
    INDEX (candidate_voted_id)
);

-- Datos por defecto:

-- Insertar datos por defecto en la tabla admins
INSERT INTO admins (name, lastName, email, password) VALUES
('Admin-N', 'Admin-L', 'admin@gmail.com', '$2b$10$7PeG3WcpVLWUoMRwEc4wXeSigV4xIS4Uin2RJT0y5xGkge3XIZyda');

-- Insertar datos por defecto en la tabla voters (8 regulares y 2 candidatos)
INSERT INTO voters (document, name, lastName, dob, is_candidate) VALUES
('52685689', 'Juan', 'Pérez', '1990-01-01', 0),
('52698742', 'María', 'García', '1992-02-02', 0),
('48565214', 'Luis', 'Martínez', '1994-03-03', 0),
('42369856', 'Ana', 'López', '1996-04-04', 0),
('53598421', 'Carlos', 'Hernández', '1998-05-05', 0),
('54568478', 'Laura', 'Gómez', '2000-06-06', 0),
('54589856', 'Pablo', 'Díaz', '2002-07-07', 0),
('12345678', 'Damián', 'Etcheverrigaray', '1997-04-30', 0),
('26505632', 'Yamandú', 'Orsi', '1967-06-13', 1),
('16510320', 'Álvaro', 'Delgado', '1969-03-11', 1);

-- Insertar datos por defecto en la tabla votes
INSERT INTO votes (candidate_id, candidate_voted_id, date) VALUES
(9, 1, '2025-01-20 10:00:00'),
(10, 2, '2025-01-20 10:05:00'),
(9, 3, '2025-01-20 10:10:00');
