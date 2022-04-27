CREATE DATABASE alkemy_fullstack_js;

USE alkemy_fullstack_js;

-- Clients table

CREATE TABLE clients (
  ID_CLIENT int(11) NOT NULL,
  EMAIL varchar(30) NOT NULL,
  PASSWORD varchar(60) NOT NULL,
  FULLNAME varchar(30) NOT NULL,
  IS_VERIFIED tinyint(1) NOT NULL DEFAULT 0
);

-- Configurations

ALTER TABLE clients
  ADD PRIMARY KEY (ID_CLIENT),
  MODIFY ID_CLIENT int(11) NOT NULL AUTO_INCREMENT;

-- Operations tables

CREATE TABLE income (
  I_ID_OPERATION int(11) NOT NULL,
  CONCEPT varchar(60) NOT NULL,
  I_VALUE int(15) NOT NULL,
  CREATED_AT timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  CATEGORY varchar(30),
  ID_CLIENT int(11) NOT NULL,
  CONSTRAINT fk_income FOREIGN KEY (ID_CLIENT) REFERENCES clients(ID_CLIENT)
);

CREATE TABLE expenses (
  E_ID_OPERATION int(11) NOT NULL,
  CONCEPT varchar(60) NOT NULL,
  E_VALUE int(15) NOT NULL,
  CREATED_AT timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  CATEGORY varchar(30),
  ID_CLIENT int(11) NOT NULL,
  CONSTRAINT fk_expenses FOREIGN KEY (ID_CLIENT) REFERENCES clients(ID_CLIENT)
);

-- Configurations

ALTER TABLE income
  ADD PRIMARY KEY (I_ID_OPERATION),
  MODIFY I_ID_OPERATION int(11) NOT NULL AUTO_INCREMENT;

ALTER TABLE expenses
  ADD PRIMARY KEY (E_ID_OPERATION),
  MODIFY E_ID_OPERATION int(11) NOT NULL AUTO_INCREMENT;