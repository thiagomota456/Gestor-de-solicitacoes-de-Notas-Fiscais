# Gestor de Solicitações de Notas Fiscais

API para gestão e emissão de Notas Fiscais de serviço.

![Node.js](https://img.shields.io/badge/Node.js-v20-green)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)
![License](https://img.shields.io/badge/License-ISC-yellow)

## Tecnologias

A stack foi escolhida visando **performance**, **segurança de tipos** e **manutenibilidade**.

-   **Runtime:** [Node.js](https://nodejs.org/) (v20+) - Escolhido por ser a tecnologia solicitada e oferecer excelente performance para I/O.
-   **Linguagem:** [TypeScript](https://www.typescriptlang.org/) (Strict mode enabled) - Garante segurança de tipos e reduz bugs em tempo de desenvolvimento.
-   **Framework:** [Express](https://expressjs.com/) - Minimalista, robusto e amplamente adotado pela comunidade.
-   **ORM:** [Prisma](https://www.prisma.io/) - Facilita a interação com o banco de dados, oferece type-safety e migrações simples. Fácil adaptação para bancos mais robustos (PostgreSQL/MySQL) em produção.
-   **Banco de Dados:** SQLite - Escolhido pela facilidade de configuração (zero-config), portabilidade e estrutura SQL, ideal para desenvolvimento e testes.
-   **Validação:** [Zod](https://zod.dev/) - Biblioteca poderosa para validação de schemas e inferência de tipos.
-   **Logs:** [Pino](https://github.com/pinojs/pino) - Logger de alta performance com saída estruturada em JSON.
-   **Testes:** [Jest](https://jestjs.io/) + [Supertest](https://github.com/ladjs/supertest) - Framework de testes maduro e largamente utilizado para garantir a qualidade do código.

## Instalação e Execução

### Pré-requisitos
-   Node.js (v20 ou superior)
-   NPM

### Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto (ou use o padrão para SQLite):
```env
DATABASE_URL="file:./dev.db"
LOG_LEVEL="info"
EXTERNAL_API_TOKEN="87451e7c-48bc-48d1-a038-c16783dd404c"
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

## Testes

O projeto possui uma suíte de testes de integração cobrindo os principais fluxos.

```bash
npm test
```
*Nota: Os testes rodam sequencialmente (`-i`) para evitar conflitos no banco de dados SQLite.*

### Postman
Para testes manuais, você pode importar o arquivo `postman_collection.json` incluído na raiz do projeto. Ele contém todas as requisições configuradas e scripts de teste automatizados.

## Decisões de Arquitetura

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
-   **Integração Externa:** A emissão de NF é feita de forma síncrona na API, mas a arquitetura foi desenhada pensando em desacoplamento, permitindo fácil migração para processamento assíncrono com filas.

## Documentação da API

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
  "numeroNF": "2024001",
  "dataEmissao": "2024-11-30T10:00:00.000Z"
}
```
### Proposta de Arquitetura Assíncrona

![Diagrama de Arquitetura](Diagrama%20de%20Arquitetura/diagrama.png)

Abaixo, o fluxo detalhado da proposta de arquitetura para processamento assíncrono:

1.  **Cliente (Frontend)**
    *   **Função:** Interface visual que envia o comando (`POST`) e escuta atualizações via `WebSocket`.
    *   **Objetivo:** Separar a **ação** (envio) da **observação** (status), garantindo que a interface não trave aguardando resposta.

2.  **API Gateway (Backend Síncrono)**
    *   **Função:** Recebe a requisição, valida, persiste o estado inicial e despacha para a fila.
    *   **Objetivo:** Garantir **responsividade**. Retorna `HTTP 202 Accepted` imediatamente, liberando o cliente enquanto o processamento ocorre em background.

3.  **Message Broker (Fila)**
    *   **Função:** Buffer (ex: RabbitMQ, Redis) que armazena tarefas.
    *   **Objetivo:** **Escalabilidade** e **Segurança**. Absorve picos de tráfego e desacopla a API dos processadores (Workers).

4.  **Workers (Zona de Processamento Assíncrono)**
    *   **Função:** Serviços independentes que consomem da fila e executam a regra de negócio.
    *   **Objetivo:** Permitir **escalabilidade horizontal** e execução de tarefas com tempos variados sem bloquear o sistema principal.

5.  **Banco de Dados (Persistência)**
    *   **Função:** Armazena o estado atual ("PENDENTE", "EMITIDA", "ERRO").
    *   **Objetivo:** Fonte única da verdade e garantia de persistência em caso de falhas nos componentes voláteis.

6.  **WebSocket Service (Tempo Real)**
    *   **Função:** Canal direto com o navegador do cliente.
    *   **Objetivo:** Notificar o cliente instantaneamente ("Push") assim que o processamento é concluído, eliminando a necessidade de *polling* (requisições repetitivas).

---
Desenvolvido por Thiago Mota.
