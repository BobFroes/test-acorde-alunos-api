create schema etag_db;

use etag_db;

create table alunos (id bigint primary key auto_increment, nome varchar(255) not null, cpf varchar(11) not null unique, bairro varchar(100), cidade varchar(100), telefone varchar(9), status enum('Ativos', 'Inativos') default 'Ativos', criado_em timestamp not null default now(), editado_em timestamp not null default now() ON UPDATE now())engine=InnoDB default charset=utf8;

insert into alunos (id, nome, cpf, bairro, cidade, telefone) values (1, 'Joel', '40828149810', 'Centro', 'Cuiabá', '25253333'),
 (2, 'Alexandra Santana', '22222222222', 'Ipiranga', 'SP', '33332222'),
 (3, 'Angelo Márcio M. de Sales', '99999999999', 'Arapoanga', 'Planaltina', '11223355'),
 (4, 'Arthur José', '33333333333', 'Centro', 'Vitória da Conquista', '55446622');


