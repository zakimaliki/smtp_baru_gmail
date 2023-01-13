CREATE DATABASE TOKO;

CREATE TABLE product(
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    stock INT NOT NULL,
    price INT NOT NULL,
    photo VARCHAR NOT NULL,
    description VARCHAR NOT NULL
);

CREATE TABLE product(
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    stock INT NOT NULL,
    price INT NOT NULL,
);

CREATE TABLE category(
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL
);

CREATE TABLE transaksi(
    id SERIAL PRIMARY KEY,
    adress VARCHAR NOT NULL,
    transaksi_detail_id INT REFERENCES transaksi_detail (id)
);

CREATE TABLE transaksi_detail(
    id SERIAL PRIMARY KEY,
    total INT NOT NULL,
    payment_id INT REFERENCES payment(id)
);

CREATE TABLE payment(
    id SERIAL PRIMARY KEY,
    amount INT NOT NULL
);

CREATE TABLE users(
    id VARCHAR PRIMARY KEY,
    email VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    fullname VARCHAR,
    role VARCHAR
);

DROP TABLE product CASCADE;

SELECT * FROM category;

SELECT * FROM category WHERE id=1;

SELECT product.name,product.stock,product.price,category.name as category
FROM product
INNER JOIN category
ON product.category_id = category.id;

INSERT INTO category(id,name) VALUES(1,'kursi');

INSERT INTO users(id, email,password,fullname) VALUES(1,'maiki@zaki.com','123456','zakimaiki');
INSERT INTO product(id,name,stock,price,photo,description) VALUES(1,'baju',10,20000,'aaa','baru');
INSERT INTO product(name,stock,price) VALUES('baju',10,20000,);


INSERT INTO category(name) VALUES('kursi');

UPDATE category SET name ='furniture' WHERE id=1;

DELETE FROM category WHERE id=1;

ALTER TABLE users ADD role VARCHAR;

ALTER TABLE product ADD description VARCHAR(255) AFTER price;

create table users(
id 			    text 	not null,
email 			text 	not null,
password  		text 	not null,
phone 			text 	,
username        text    ,
name 			text    ,
picture 		text 	,
status     		text 	,
verify          text not null ,
created_on 		timestamp default CURRENT_TIMESTAMP not null	,
updated_on 		timestamp default CURRENT_TIMESTAMP not null	,
primary key (id) 
);



CREATE  FUNCTION update_updated_on_users()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_on = now();
    RETURN NEW;
END;
$$ language 'plpgsql';


CREATE TRIGGER update_users_updated_on
    BEFORE UPDATE
    ON
        users
    FOR EACH ROW
EXECUTE PROCEDURE update_updated_on_users();


create table users_verification (
    id text not null ,
    users_id text ,
    token text ,
    created_on timestamp default CURRENT_TIMESTAMP not null	,
    constraint 	users foreign key(users_id) 	references 	users(id) ON DELETE CASCADE,
primary key (id)
)
