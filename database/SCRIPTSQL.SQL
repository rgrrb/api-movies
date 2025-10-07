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