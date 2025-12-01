#!/bin/bash

# Verifica se o arquivo .env existe
if [ ! -f .env ]; then
    echo "Erro: Arquivo .env não encontrado!"
    echo "Crie um arquivo .env baseado no exemplo do README."
    exit 1
fi

echo "Iniciando a aplicação com Docker..."

# Build e Start dos containers
sudo docker-compose up --build -d

echo "Aguardando a aplicação iniciar..."
sleep 5

echo "Aplicação rodando em http://localhost:3120"
echo "Logs:"
sudo docker-compose logs -f
