# Gestor de Solicitações de Notas Fiscais

API para gestão e emissão de Notas Fiscais de serviço.

![Node.js](https://img.shields.io/badge/Node.js-v20-green)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)
![License](https://img.shields.io/badge/License-ISC-yellow)

## 🛠 Tecnologias

A stack foi escolhida visando **performance**, **segurança de tipos** e **manutenibilidade**.

-   **Runtime:** [Node.js](https://nodejs.org/) (v20+) - Escolhido por ser a tecnologia solicitada e oferecer excelente performance para I/O.
-   **Linguagem:** [TypeScript](https://www.typescriptlang.org/) (Strict mode enabled) - Garante segurança de tipos e reduz bugs em tempo de desenvolvimento.
-   **Framework:** [Express](https://expressjs.com/) - Minimalista, robusto e amplamente adotado pela comunidade.
-   **ORM:** [Prisma](https://www.prisma.io/) - Facilita a interação com o banco de dados, oferece type-safety e migrações simples. Fácil adaptação para bancos mais robustos (PostgreSQL/MySQL) em produção.
-   **Banco de Dados:** SQLite - Escolhido pela facilidade de configuração (zero-config), portabilidade e estrutura SQL, ideal para desenvolvimento e testes.
-   **Validação:** [Zod](https://zod.dev/) - Biblioteca poderosa para validação de schemas e inferência de tipos.
-   **Logs:** [Pino](https://github.com/pinojs/pino) - Logger de alta performance com saída estruturada em JSON.
-   **Testes:** [Jest](https://jestjs.io/) + [Supertest](https://github.com/ladjs/supertest) - Framework de testes maduro e largamente utilizado para garantir a qualidade do código.

## 🚀 Instalação e Execução

### Pré-requisitos
-   Node.js (v20 ou superior)
-   NPM

### Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto (ou use o padrão para SQLite):
```env
DATABASE_URL="file:./dev.db"
LOG_LEVEL="info"
```

### Passo a passo

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/thiagomota456/Gestor-de-solicitacoes-de-Notas-Fiscais.git
    cd Gestor-de-solicitacoes-de-Notas-Fiscais
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configuração do Banco de Dados:**
    O projeto utiliza SQLite, então o arquivo do banco será criado localmente.
    ```bash
    # Gera o cliente Prisma e cria as tabelas
    npx prisma migrate dev --name init
    
    # (Opcional) Popula o banco com dados de teste
    npx prisma db seed
    ```

4.  **Execute a aplicação:**
    ```bash
    # Modo de desenvolvimento (com hot-reload)
    npm run dev
    
    # Modo de produção
    npm run build
    npm start
    ```
    O servidor iniciará em `http://localhost:3120`.

## 🧪 Testes

O projeto possui uma suíte de testes de integração cobrindo os principais fluxos.

```bash
npm test
```
*Nota: Os testes rodam sequencialmente (`-i`) para evitar conflitos no banco de dados SQLite.*

## 🏛 Decisões de Arquitetura

-   **Estrutura de Pastas:**
    ```
    src/
    ├── controllers/    # Lógica de entrada e saída da API
    ├── lib/            # Configurações de infraestrutura (Prisma)
    ├── schemas/        # Validações de dados (Zod)
    ├── tests/          # Testes de integração
    ├── utils/          # Funções auxiliares (Loggers, Validadores)
    ├── routes.ts       # Definição das rotas
    └── server.ts       # Ponto de entrada da aplicação
    ```
-   **Validação de Dados:** Utilização do `Zod` na camada de entrada (Controllers) para garantir que apenas dados válidos cheguem à lógica de negócios, retornando erros 400 claros para o cliente.
-   **Tratamento de Erros:** Blocos `try/catch` nos controllers com logging estruturado via `Pino` para facilitar a depuração sem expor detalhes sensíveis ao cliente.
-   **Integração Externa:** A emissão de NF é feita de forma síncrona na API, mas a arquitetura foi desenhada pensando em desacoplamento (conforme diagrama de arquitetura disponível na pasta `Diagrama de Arquitetura`), permitindo fácil migração para processamento assíncrono com filas.

## 📚 Documentação da API

### 1. Criar Solicitação
**POST** `/solicitacoes`

Cria uma nova solicitação de Nota Fiscal.

**Body:**
```json
{
  "cnpj": "12.345.678/0001-90",
  "municipio": "São Paulo",
  "estado": "SP",
  "valor": 1500.00,
  "dataDesejada": "2024-12-01T10:00:00Z",
  "descricao": "Consultoria de TI"
}
```

**Exemplo cURL:**
```bash
curl -X POST http://localhost:3120/solicitacoes \
  -H "Content-Type: application/json" \
  -d '{
    "cnpj": "12.345.678/0001-90",
    "municipio": "São Paulo",
    "estado": "SP",
    "valor": 1500.00,
    "dataDesejada": "2024-12-01T10:00:00Z",
    "descricao": "Consultoria de TI"
  }'
```

### 2. Listar Solicitações
**GET** `/solicitacoes`

Retorna todas as solicitações cadastradas.

### 3. Buscar Solicitação
**GET** `/solicitacoes/:id`

Retorna os detalhes de uma solicitação específica.

### 4. Emitir Nota Fiscal
**POST** `/solicitacoes/:id/emitir`

Dispara o processo de emissão da Nota Fiscal integrando com a API externa.

**Retorno (Sucesso):**
```json
{
  "id": "...",
  "status": "EMITIDA",
  "numeroNF": "2024001",
  "dataEmissao": "2024-11-30T10:00:00.000Z",
  ...
}
```

---
Desenvolvido por Thiago Mota.
