# Desafio Técnico para a Vaga de Desenvolvedor Fullstack Jr

Este repositório contém o desafio técnico, concluído após o prazo estabelecido, para a vaga de Desenvolvedor Fullstack Jr.

## Configuração do Ambiente

1. Clone este repositório.
2. Instale o Xampp.
3. Substitua o MariaDB pelo MySQL 8 seguindo as instruções desta postagem: [Stack Overflow - Substituir o MariaDB pelo MySQL 8](https://stackoverflow.com/a/58973750).
4. Converta o arquivo `database.sql` fornecido junto com o desafio para UTF-8. Você pode usar o Notepad++ para fazer essa conversão.
5. Importe o arquivo `database.sql` convertido no banco de dados.
6. Abra dois prompts de comando.
7. Em um prompt, navegue até a pasta `client`.
8. No outro prompt, navegue até a pasta `server`.
9. Execute o comando `npm start` em ambos os terminais.
10. O front-end estará sendo executado em `http://localhost:3000` ou `http://127.0.0.1:3000`.
11. O back-end estará sendo executado em `http://localhost:5000` ou `http://127.0.0.1:5000`.
12. Caso não deseje definir uma senha para acesso ao banco de dados, remova a senha no arquivo `server\src\utils\sequelize.ts`.
    Obs.: Também é possível usar `npm start` na raiz do projeto. A minha preferência por dois prompts de comando é para visualizar eventuais erros separadamente.

## Utilização do Sistema

- A interface é constituída de uma dropzone para selecionar o arquivo CSV para upload.
- Clique no botão de validação para verificar eventuais inconsistências nos reajustes conforme as normas estabelecidas.
- Existem três tabelas que são populadas sob demanda.
- Utilize o campo de filtro para pesquisar produtos pelo nome.
- Ao selecionar um arquivo e clicar em "Validar", a tabela de produtos validados é populada com os produtos, seus dados e destaque visual para produtos válidos e inválidos. Os produtos inválidos são acompanhados de sua respectiva mensagem de erro.
- Selecione um arquivo e clique em "Atualizar Preços" para realizar a validação. Se todos os produtos estiverem dentro das especificações, os dados são inseridos no banco de dados e atualizados na lista de produtos à direita. Os produtos atualizados também são exibidos em uma tabela específica de produtos que foram reajustados.
