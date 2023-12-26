INSERT INTO Office_Kagar (Equipment, Quantity_pcs) VALUES ('Router Mikrotik RB 2011', '1');
INSERT INTO Office_Kagar (Equipment, Quantity_pcs) VALUES ('Switch', '1');
INSERT INTO Office_Kagar (Equipment, Quantity_pcs) VALUES ('Wi-Fi', '2');
INSERT INTO Office_Kagar (Equipment, Quantity_pcs) VALUES ('Принтер лазерный ЧБ', '2');

CREATE TABLE DC_Accounts (
    ID INT Office_Kagar(1,1) PRIMARY KEY,
    Equipment NVARCHAR(255),
    Quantity_pcs NVARCHAR(255),
);