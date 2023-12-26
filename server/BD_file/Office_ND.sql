INSERT INTO Office_ND (Amount, Equipment, Note, Note2, Type) VALUES ('36','Робоче місце(ПК,ноут)', 'Всі роб. місця, які пам''ятаю по БМСу та ПБМу, й на об''єктах', 'а також 3 ПК в Охорони(АТП, Услад та БМС) та 2 ПК в Ю.Петрика в офісі(первичне налаштування робив я і один раз до війни їздив до них були проблеми з ПК)', 'ПБМ\БМС в НД');
INSERT INTO Office_ND (Amount, Equipment, Note, Note2, Type) VALUES ('20','БФП та принтери', 'ще 4 на об''єках (Вільногірськ, ДП Антонов, Чортків та Глиниця)', 'також є ще один БФП в офісі Ю.Петрика, на нього заправляю картриджі та проводив первичні налаштування, його не рахував', 'ПБМ\БМС в НД');
INSERT INTO Office_ND (Amount, Equipment, Note, Note2, Type) VALUES ('16(з НВРом)','НВРи та відеокамери', '', '', 'ПБМ\БМС в НД');
INSERT INTO Office_ND (Amount, Equipment, Note, Note2, Type) VALUES ('27(з контроллером)','Система охорони Аякс', 'Контроллер, датчики руху, реле перемикання,пульти, тревожні кн. та ретранслятори', '', 'ПБМ\БМС в НД');
INSERT INTO Office_ND (Amount, Equipment, Note, Note2, Type) VALUES ('17','ІР телефони', '', '', 'ПБМ\БМС в НД');
INSERT INTO Office_ND (Amount, Equipment, Note, Note2, Type) VALUES ('12','Точки доступу(WiFi)', 'одна з 13, вимкнена на вишці біля складу та одна працює на МАС\БАС тому тут 12', '', 'ПБМ\БМС в НД');
INSERT INTO Office_ND (Amount, Equipment, Note, Note2, Type) VALUES ('11','Світчі, медіаконвертори та комутатори', ' та 7 маленьких(5-ти портових) по кабінетах', '', 'ПБМ\БМС в НД');
INSERT INTO Office_ND (Amount, Equipment, Note, Note2, Type) VALUES ('6','Робоче місце(ПК,ноут)', '', '', 'МАС\БАС в НД');
INSERT INTO Office_ND (Amount, Equipment, Note, Note2, Type) VALUES ('2','БФП та принтери', 'і ще 1 вдома в М.Берляк(наш робочий)', '', 'МАС\БАС в НД');
INSERT INTO Office_ND (Amount, Equipment, Note, Note2, Type) VALUES ('5(з НВРом)','ВІдеокамери та НВР в АТП(сушка зерна)', '', '', 'МАС\БАС в НД');
INSERT INTO Office_ND (Amount, Equipment, Note, Note2, Type) VALUES ('2','Система охорони Аякс', '', '', 'МАС\БАС в НД');
INSERT INTO Office_ND (Amount, Equipment, Note, Note2, Type) VALUES ('5','ІР телефони', '', '', 'МАС\БАС в НД');
INSERT INTO Office_ND (Amount, Equipment, Note, Note2, Type) VALUES ('1','Точки доступу(WiFi)', '', '', 'МАС\БАС в НД');
INSERT INTO Office_ND (Amount, Equipment, Note, Note2, Type) VALUES ('4','Світчі та роутер', '2 меленьких(5-ти портових) в офісі та роутер й світч де відеонагляд АТП', '', 'МАС\БАС в НД');

CREATE TABLE Office_ND (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    Amount NVARCHAR(255),
    Note NVARCHAR(255),
    Note2 NVARCHAR(255),
);