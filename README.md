# Desafio Sequelize — CRUD com Node.js + Sequelize + MySQL

API REST com 3 CRUDs completos: Usuários, Produtos e Pedidos.

## Tecnologias

- Node.js
- Express
- Sequelize
- MySQL
- dotenv

## Como rodar o projeto

### 1. Clone o repositório

```bash
git clone https://github.com/jefersonbrendo/desafio-sequelize.git
cd desafio-sequelize
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure o banco de dados

Crie o banco no MySQL:

```sql
CREATE DATABASE desafio_sequelize;
```

### 4. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto com base no `.env.example`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=desafio_sequelize
DB_DIALECT=mysql
PORT=3000
```

### 5. Inicie o servidor

```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3000`. As tabelas serão criadas automaticamente.

---

## Testando com Postman

### Instalação

Baixe e instale o Postman em [postman.com/downloads](https://www.postman.com/downloads/).

### Como fazer requisições

1. Abra o Postman e clique em **New → HTTP**
2. Selecione o **método** (GET, POST, PUT, DELETE) no dropdown
3. Digite a **URL** (ex: `http://localhost:3000/usuarios`)
4. Para POST e PUT: clique na aba **Body → raw → JSON** e cole o JSON
5. Clique em **Send**

### Ordem recomendada para testar

**Passo 1 — Crie um usuário**

- Método: `POST`
- URL: `http://localhost:3000/usuarios`
- Body:
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "123456"
}
```

**Passo 2 — Crie um produto**

- Método: `POST`
- URL: `http://localhost:3000/produtos`
- Body:
```json
{
  "nome": "Notebook",
  "preco": 2500.00,
  "estoque": 10
}
```

**Passo 3 — Crie um pedido**

- Método: `POST`
- URL: `http://localhost:3000/pedidos`
- Body:
```json
{
  "usuario_id": 1,
  "produto_id": 1,
  "quantidade": 2
}
```

> Use os `id`s retornados nas respostas anteriores.

### Dica

Salve cada requisição clicando em **Save** e organize em uma **Collection** chamada `Desafio Sequelize` para não precisar redigitar toda vez.

---

## Rotas da API

### Usuários

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/usuarios` | Cria um usuário |
| GET | `/usuarios` | Lista todos os usuários |
| GET | `/usuarios/:id` | Busca usuário por ID |
| PUT | `/usuarios/:id` | Atualiza um usuário |
| DELETE | `/usuarios/:id` | Remove um usuário |

**Exemplo de body (POST/PUT):**
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "123456"
}
```

---

### Produtos

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/produtos` | Cria um produto |
| GET | `/produtos` | Lista todos os produtos |
| GET | `/produtos/:id` | Busca produto por ID |
| PUT | `/produtos/:id` | Atualiza um produto |
| DELETE | `/produtos/:id` | Remove um produto |

**Exemplo de body (POST/PUT):**
```json
{
  "nome": "Notebook",
  "preco": 2500.00,
  "estoque": 10
}
```

---

### Pedidos

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/pedidos` | Cria um pedido |
| GET | `/pedidos` | Lista todos os pedidos |
| GET | `/pedidos/:id` | Busca pedido por ID |
| PUT | `/pedidos/:id` | Atualiza a quantidade do pedido |
| DELETE | `/pedidos/:id` | Remove um pedido |

**Exemplo de body (POST):**
```json
{
  "usuario_id": 1,
  "produto_id": 1,
  "quantidade": 2
}
```

**Exemplo de body (PUT):**
```json
{
  "quantidade": 3
}
```

---

## Regras de negócio

- Pedido deve estar vinculado a um usuário existente
- Pedido deve estar vinculado a um produto existente
- Não é possível criar pedido com quantidade maior que o estoque disponível
- O estoque é descontado automaticamente ao criar um pedido
- O estoque é devolvido automaticamente ao deletar um pedido
- Ao atualizar a quantidade do pedido, o estoque é ajustado automaticamente
