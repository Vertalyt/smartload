INSERT INTO Office_OMG_FS (Quantity, Location_Equipment, Note) VALUES ('17', 'Робоче місце(ПК,ноут)', '');
INSERT INTO Office_OMG_FS (Quantity, Location_Equipment, Note) VALUES ('5', 'БФП та принтери', '');
INSERT INTO Office_OMG_FS (Quantity, Location_Equipment, Note) VALUES ('49', 'НВРи та відеокамери', '2 НВРа та 47 камер');
INSERT INTO Office_OMG_FS (Quantity, Location_Equipment, Note) VALUES ('10', 'U-prox контроллери', '');
INSERT INTO Office_OMG_FS (Quantity, Location_Equipment, Note) VALUES ('5', 'ІР телефони', '');
INSERT INTO Office_OMG_FS (Quantity, Location_Equipment, Note) VALUES ('16', 'Точки доступу(WiFi)', '');
INSERT INTO Office_OMG_FS (Quantity, Location_Equipment, Note) VALUES ('22', 'Світчі, медіаконвертори та комутатори', '8 маленьких(5-8ми портових)');

CREATE TABLE Office_OMG_FS (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    Quantity NVARCHAR(255),
    Location_Equipment NVARCHAR(255),
    Note NVARCHAR(255),
);