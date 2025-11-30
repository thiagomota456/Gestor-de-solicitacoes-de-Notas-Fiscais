-- CreateTable
CREATE TABLE "solicitacoes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "cnpj" TEXT NOT NULL,
    "municipio" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "valor" REAL NOT NULL,
    "dataDesejada" DATETIME NOT NULL,
    "descricao" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE_EMISSAO',
    "numeroNF" TEXT,
    "dataEmissao" DATETIME
);
