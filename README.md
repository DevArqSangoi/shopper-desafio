# shopper-desafio
Desafio técnico para vaga de dev fullstack jr

1) Clonar este repositório.
2) Instalar o Xampp.
3) Substituir o MariaDB pelo Mysql 8 seguindo as instruções desta postagem: https://stackoverflow.com/a/58973750
4) Converter para UTF-8 o arquivo database.sql fornecido junto do desafio, sugiro usar o Notepad++.
5) Importar o database.sql no banco de dados.
6) Abrir dois prompts de comando.
7) Em um terminal navegar para a pasta client.
8) No outro terminal navegar para a pasta server.
9) Executar npm start em ambos os terminais.
10) O front-end vai estar sendo executado em http://localhost:3000 ou http://127.0.0.1:3000.
11) O back-end vai estar sendo executado em http://localhost:5000 ou http://127.0.0.1:5000.
12) Se não desejarem definir uma senha para acesso ao banco de dados, remover a senha no arquivo server\src\utils\sequelize.ts.

Obs.: Também é possível usar npm start na raiz do projeto, a minha preferência de dois prompt de comando é para visualizar eventuais erros separadamente.
