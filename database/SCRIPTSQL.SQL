-- Filme
CREATE TABLE tbl_filme(
	filme_id int PRIMARY KEY NOT NULL auto_increment,
	nome VARCHAR(100) NOT NULL,
	sinopse text,
	data_lancamento DATE,
	duracao time NOT NULL,
	orcamento decimal NOT NULL,
	trailer VARCHAR(200),
	capa VARCHAR(200) NOT NULL
);

INSERT INTO tbl_filme  (nome, sinopse, data_lancamento, duracao, orcamento, trailer, capa)
VALUES ('Django Livre', 'Django (Jamie Foxx) é um escravo liberto cujo passado brutal com seus antigos proprietários leva-o ao encontro do caçador de recompensas alemão Dr. King Schultz (Christoph Waltz). Schultz está em busca dos irmãos assassinos Brittle, e somente Django pode levá-lo a eles. O pouco ortodoxo Schultz compra Django com a promessa de libertá-lo quando tiver capturado os irmãos Brittle, vivos ou mortos. Ao realizar seu plano, Schultz libera Django, embora os dois homens decidam continuar juntos. Desta vez, Schultz busca os criminosos mais perigosos do sul dos Estados Unidos com a ajuda de Django. Dotado de um notável talento de caçador, Django tem como objetivo principal encontrar e resgatar Broomhilda (Kerry Washington), sua esposa, que ele não vê desde que ela foi adquirida por outros proprietários, há muitos anos. A busca de Django e Schultz leva-os a Calvin Candie (Leonardo DiCaprio)',
"2013-01-18", '02:44:00', 100000000.00, "https://www.youtube.com/watch?v=tivv135aGbc", "https://www.adorocinema.com/filmes/filme-190918/trailer-19416039/");

INSERT INTO tbl_filme  (nome, sinopse, data_lancamento, duracao, orcamento, trailer, capa)
VALUES ('Star Wars: O Despertar da Força', 'Em Star Wars: Episódio VII, décadas após a queda de Darth Vader e do Império, surge uma nova ameaça: a Primeira Ordem, uma organização sombria que busca minar o poder da República e que tem Kylo Ren (Adam Driver), o General Hux (Domhnall Gleeson) e o Líder Supremo Snoke (Andy Serkis) como principais expoentes. Eles conseguem capturar Poe Dameron (Oscar Isaac), um dos principais pilotos da Resistência, que antes de ser preso envia através do pequeno robô BB-8 o mapa de onde vive o mitológico Luke Skywalker (Mark Hamill). Ao fugir pelo deserto, BB-8 encontra a jovem Rey (Daisy Ridley), que vive sozinha catando destroços de naves antigas. Paralelamente, Poe recebe a ajuda de Finn (John Boyega), um stormtrooper que decide abandonar o posto repentinamente. Juntos, eles escapam do domínio da Primeira Ordem.',
"2015-12-17", '02:15:00', 447000000.00, "https://www.youtube.com/watch?v=sGbxmsDFVnE", "https://jpimg.com.br/uploads/2017/04/623162119-star-wars-vii-o-despertar-da-forca-ganha-poster-para-anunciar-trailer-oficial.jpg");

-- Filme


-- Genero
CREATE TABLE tbl_genero(
	genero_id int primary key auto_increment,
	nome VARCHAR(35) NOT NULL
);
insert into tbl_genero(nome) values('Comédia');
insert into tbl_genero(nome) values('Ação');
insert into tbl_genero(nome) values('Drama');
insert into tbl_genero(nome) values('Suspense');
insert into tbl_genero(nome) values('Terror');
insert into tbl_genero(nome) values('Ficção Científica');
insert into tbl_genero(nome) values('Romance');
insert into tbl_genero(nome) values('Documentário');
insert into tbl_genero(nome) values('Musical');
insert into tbl_genero(nome) values('Aventura');
-- Genero

-- Faixa etaria
CREATE TABLE tbl_faixa_etaria(
	faixa_etaria_id INT PRIMARY KEY AUTO_INCREMENT,
	nome VARCHAR(50) NOT NULL,
	classificacao_indicativa VARCHAR(150) NOT NULL,
	caracteristicas VARCHAR(255)

);

insert into tbl_faixa_etaria (nome, classificacao_indicativa, caracteristicas) values
('Livre', 'L', 'Conteúdo apropriado para todas as idades, sem restrições de tema, violência ou nudez.'),
('+10 anos', '10', 'Pode conter: Violência Fantasiosa ou leves, Linguagem Imprópria (leves), Temas leves.'),
('+12 anos', '12', 'Pode conter: Violência leve (assédio, bullying), Linguagem Obscena/Sexual (insinuação, nudez velada), Drogas Lícitas (referência).'),
('+14 anos', '14', 'Pode conter: Violência Moderada, Conteúdo Sexual (insinuação forte, nudez), Drogas Ilícitas (uso ou referência), Temas sensíveis.'),
('+16 anos', '16', 'Pode conter: Violência Extrema, Sexo Explícito ou Implícito, Drogas Ilícitas (uso intenso), Conteúdo Impactante, Nudez.'),
('+18 anos', '18', 'Conteúdo Extremo, Violência Gratuita (Tortura), Sexo Explícito, Temas de alta complexidade e impacto.');
-- Faixa etaria

-- Ator
CREATE TABLE tbl_ator(
    ator_id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(150) NOT NULL,
    data_nascimento DATE NOT NULL,
    altura DECIMAL(4,2) NULL,
    peso DECIMAL(6,3) NULL
);

INSERT INTO tbl_ator (nome, data_nascimento, altura, peso) values
('João Silva', '1985-04-12', 1.82, 80.500),
('Mariana Costa', '1990-09-23', 1.68, 60.200),
('Carlos Souza', '1978-12-05', 1.75, 82.300),
('Fernanda Lima', '1995-07-18', 1.70, 58.000),
('Ricardo Alves', '1988-03-09', 1.85, 90.700);
-- Ator

-- Diretor
CREATE TABLE tbl_diretor(
    diretor_id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(120) NOT NULL,
    data_nascimento DATE NOT NULL,
    altura DECIMAL(4,2) NULL,
    peso DECIMAL(6,3) NULL
);

INSERT INTO tbl_diretor (nome, data_nascimento, altura, peso) values
('Paulo Mendes', '1970-06-22', 1.80, 85.000),
('Luciana Prado', '1982-11-14', 1.65, 59.200),
('André Rocha', '1975-02-03', 1.78, 76.500),
('Carla Monteiro', '1988-01-28', 1.60, 55.100),
('Eduardo Reis', '1969-09-10', 1.83, 88.400);
-- Diretor

-- Estudio
CREATE TABLE tbl_estudio(
    estudio_id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(120) NOT NULL,
    cnpj VARCHAR(14) NOT NULL,
    logradouro VARCHAR(120) NOT NULL,
    bairro VARCHAR(50) NOT NULL,
    cidade VARCHAR(20) NOT NULL,
    complemento VARCHAR(20) NOT NULL
);

INSERT INTO tbl_estudio (nome, cnpj, logradouro, bairro, cidade, complemento) values
('CineMax Produções', '12345678000199', 'Av. Paulista, 1000', 'Bela Vista', 'São Paulo', 'Conj. 12'),
('Estúdio Aurora', '98765432000145', 'Rua das Flores, 200', 'Centro', 'Rio de Janeiro', 'Sala 3'),
('Vision Filmes', '11223344000177', 'Av. Atlântica, 1500', 'Copacabana', 'Rio de Janeiro', 'Bloco A'),
('Luz e Som Studios', '55667788000133', 'Rua XV de Novembro, 85', 'Centro', 'Curitiba', 'Andar 2'),
('Horizonte Filmes', '44332211000166', 'Rua das Acácias, 55', 'Jardins', 'São Paulo', 'Sala 8');

-- Estudio

-- Personagem

-- Personagem

CREATE TABLE tbl_personagem(
    personagem_id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(150) NOT NULL,
    data_nascimento DATE NOT NULL,
    altura DECIMAL(4,2) NOT NULL,
    peso DECIMAL(5,2) NOT NULL,
    descricao VARCHAR(255) NOT NULL,
    personalidade VARCHAR(150) NOT NULL,
    habilidades VARCHAR(150) NOT NULL
);

insert into tbl_personagem 
(nome, data_nascimento, altura, peso, descricao, personalidade, habilidades) values
('Miguel Duarte', '1998-02-15', 1.80, 78.50, 
 'Ex-policial que busca justiça após um crime misterioso.', 
 'Corajoso, determinado e leal.', 
 'Combate corpo a corpo e investigação.'),

('Laura Pires', '2001-06-09', 1.65, 55.20, 
 'Jovem hacker que usa suas habilidades para expor corrupção.', 
 'Inteligente, sarcástica e independente.', 
 'Programação e infiltração digital.'),

('Pedro Ramos', '1995-11-30', 1.75, 70.00, 
 'Explorador em busca de artefatos antigos.', 
 'Aventureiro, curioso e otimista.', 
 'Escalada, arqueologia e sobrevivência.'),

('Sofia Martins', '2000-04-25', 1.68, 58.30, 
 'Médica que enfrenta dilemas éticos durante uma pandemia.', 
 'Empática, racional e resiliente.', 
 'Medicina e liderança sob pressão.'),

('Rafael Torres', '1992-09-07', 1.82, 82.10, 
 'Ex-soldado recrutado para uma missão de resgate internacional.', 
 'Disciplinado, reservado e estrategista.', 
 'Tiroteio e táticas militares.');

-- Personagem