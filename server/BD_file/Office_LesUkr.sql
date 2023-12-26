INSERT INTO Office_LesUkr (Equipment, Quantity_pcs) VALUES ('Router Mikrotik RB 4011', '1');
INSERT INTO Office_LesUkr (Equipment, Quantity_pcs) VALUES ('Router Mikrotik RB952Ui', '1');
INSERT INTO Office_LesUkr (Equipment, Quantity_pcs) VALUES ('Switch', '1');
INSERT INTO Office_LesUkr (Equipment, Quantity_pcs) VALUES ('Wi-Fi', '3');
INSERT INTO Office_LesUkr (Equipment, Quantity_pcs) VALUES ('Медиаконвертер', '3');
INSERT INTO Office_LesUkr (Equipment, Quantity_pcs) VALUES ('Принтер лазерный цветной', '1');
INSERT INTO Office_LesUkr (Equipment, Quantity_pcs) VALUES ('Принтер лахерный ЧБ', '2');
INSERT INTO Office_LesUkr (Equipment, Quantity_pcs) VALUES ('Плотер', '1');
INSERT INTO Office_LesUkr (Equipment, Quantity_pcs) VALUES ('Сикртные ПК', '2');

CREATE TABLE Office_LesUkr (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    Equipment NVARCHAR(255),
    Quantity_pcs NVARCHAR(255),
);