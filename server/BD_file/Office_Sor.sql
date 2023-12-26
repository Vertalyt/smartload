INSERT INTO Office_Sor (Equipment, Quantity_pcs, Note) VALUES ('Router Mikrotik RB 4011', '1', '');
INSERT INTO Office_Sor (Equipment, Quantity_pcs, Note) VALUES ('Switch', '10', '');
INSERT INTO Office_Sor (Equipment, Quantity_pcs, Note) VALUES ('Wi-Fi', '10', '');
INSERT INTO Office_Sor (Equipment, Quantity_pcs, Note) VALUES ('Медиаконвертер', '1', '');
INSERT INTO Office_Sor (Equipment, Quantity_pcs, Note) VALUES ('Starlink (набор)', '1', '');
INSERT INTO Office_Sor (Equipment, Quantity_pcs, Note) VALUES ('NVR', '1', '');
INSERT INTO Office_Sor (Equipment, Quantity_pcs, Note) VALUES ('Видео Камеры', '7', '');
INSERT INTO Office_Sor (Equipment, Quantity_pcs, Note) VALUES ('DHI-VTO2101E-P-S1 (вызывная панель)', '1', '');
INSERT INTO Office_Sor (Equipment, Quantity_pcs, Note) VALUES ('DHI-VTH5421EW-H (Домофон)', '1', '');
INSERT INTO Office_Sor (Equipment, Quantity_pcs, Note) VALUES ('Контроллер Uprox', '5', '');
INSERT INTO Office_Sor (Equipment, Quantity_pcs, Note) VALUES ('Принтер лазерный цветной', '2', '1 - на первом этаже у юристов 2 - в пристройке - отдел Болабко');
INSERT INTO Office_Sor (Equipment, Quantity_pcs, Note) VALUES ('Принтер лахерный ЧБ', '9', '');
INSERT INTO Office_Sor (Equipment, Quantity_pcs, Note) VALUES ('Плотер', '1', 'Отдел Болабко');

CREATE TABLE DC_Accounts (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    Equipment NVARCHAR(255),
    Quantity_pcs NVARCHAR(255),
    Note NVARCHAR(255),
);