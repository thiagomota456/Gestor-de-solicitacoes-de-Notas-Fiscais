```flowchart TD
    %% --- Definição de Estilos ---
    style User fill:#e1f5fe,stroke:#01579b,stroke-width:2px,color:#000
    style API fill:#fff9c4,stroke:#fbc02d,stroke-width:2px,color:#000
    style DB fill:#e0e0e0,stroke:#616161,stroke-width:2px,color:#000
    style Queue fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px,stroke-dasharray: 5 5,color:#000
    style WS fill:#ffebee,stroke:#c62828,stroke-width:2px,color:#000
    style Workers fill:#f1f8e9,stroke:#33691e,stroke-width:2px,color:#000

    %% --- Nós Principais ---
    User(("Cliente(Frontend)"))
    API["API Gateway(Backend Síncrono)"]
    DB[("Banco de Dados(Persistência)")]
    Queue{{"Message Broker(Fila Assíncrona)"}}
    WS["WebSocket Service(Tempo Real)"]

    %% --- Grupo de Workers ---
    subgraph Workers ["Zona de Processamento Assíncrono"]
        %% Aqui deixamos LR para eles ficarem lado a lado dentro da vertical
        direction LR
        WorkerA["Worker A"]
        WorkerB["Worker B"]
        WorkerC["Worker C"]
    end

    %% --- Fluxo do Diagrama ---
    
    %% 1. Entrada
    User ====> |"1. POST (Inicia Ação)"| API
    API -.-> |"2. HTTP 202 (Retorna ID)"| User
    
    %% 2. Distribuição
    API ==> |"3. Publica Tarefas"| Queue
    API -...-> |"Salva Estado Inicial"| DB
    
    Queue ==> WorkerA
    Queue ==> WorkerB
    Queue ==> WorkerC
    
    %% 3. Processamento e Atualização
    WorkerA --> |update| DB
    WorkerB --> |update| DB
    WorkerC --> |update| DB
    
    WorkerA -..-> |"Evento OK"| WS
    WorkerB -..-> |"Evento OK"| WS
    WorkerC -..-> |"Evento OK"| WS
    
    %% 4. Retorno
    User ===> |"4. Conecta (Listen ID)"| WS
    WS ===> |"5. Push: Status Final"| User
    ```
