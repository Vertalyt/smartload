INSERT INTO DC_Accounts (Accounts, Active_accounts) VALUES ('xatanet.ua', '0');
INSERT INTO DC_Accounts (Accounts, Active_accounts) VALUES ('hbg.systems', '0');
INSERT INTO DC_Accounts (Accounts, Active_accounts) VALUES ('vechir.ua', '0');
INSERT INTO DC_Accounts (Accounts, Active_accounts) VALUES ('campus.in.ua', '0');
INSERT INTO DC_Accounts (Accounts, Active_accounts) VALUES ('hbg.com.ua', '0');
INSERT INTO DC_Accounts (Accounts, Active_accounts) VALUES ('mas.net.ua', '0');
INSERT INTO DC_Accounts (Accounts, Active_accounts) VALUES ('bas.in.ua', '0');
INSERT INTO DC_Accounts (Accounts, Active_accounts) VALUES ('pbm.in.ua', '0');
INSERT INTO DC_Accounts (Accounts, Active_accounts) VALUES ('bms.in.ua', '0');
INSERT INTO DC_Accounts (Accounts, Active_accounts) VALUES ('agropk.com.ua', '0');
INSERT INTO DC_Accounts (Accounts, Active_accounts) VALUES ('axicore.com.ua', '0');
INSERT INTO DC_Accounts (Accounts, Active_accounts) VALUES ('vechir.in.ua', '0');
INSERT INTO DC_Accounts (Accounts, Active_accounts) VALUES ('vpn.dev', '0');
INSERT INTO DC_Accounts (Accounts, Active_accounts) VALUES ('local.biz', '0');
INSERT INTO DC_Accounts (Accounts, Active_accounts) VALUES ('ext.dev', '0');
INSERT INTO DC_Accounts (Accounts, Active_accounts) VALUES ('ids.in.ua', '0');
INSERT INTO DC_Accounts (Accounts, Active_accounts) VALUES ('axicore.ua', '0');


CREATE TABLE DC_Accounts (
    ID INT IDENTITY(1,1) PRIMARY KEY,
    Accounts NVARCHAR(255),
    Active_accounts NVARCHAR(255),
);