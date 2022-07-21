create database if not exists FieldOfMiracles;

use FieldOfMiracles;

create table if not exists Records(
	id int primary key auto_increment,
	name varchar(50) not null,
	score int unsigned not null
);


