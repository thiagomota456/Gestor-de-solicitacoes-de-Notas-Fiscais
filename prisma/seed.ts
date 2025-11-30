import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Iniciando o seed do banco de dados...');

    await prisma.solicitacao.deleteMany();

    const dadosMock = [
        {
            cnpj: '12.345.678/0001-01',
            municipio: 'São Paulo',
            estado: 'SP',
            valor: 1500.00,
            dataDesejada: new Date('2024-12-01T10:00:00Z'),
            descricao: 'Consultoria de TI - Fase 1',
            status: 'PENDENTE_EMISSAO' as const
        },
        {
            cnpj: '98.765.432/0001-02',
            municipio: 'Rio de Janeiro',
            estado: 'RJ',
            valor: 250.50,
            dataDesejada: new Date('2024-12-02T14:30:00Z'),
            descricao: 'Manutenção de Computadores',
            status: 'PENDENTE_EMISSAO' as const
        },
        {
            cnpj: '11.111.111/0001-11',
            municipio: 'Belo Horizonte',
            estado: 'MG',
            valor: 5000.00,
            dataDesejada: new Date('2024-12-05T09:00:00Z'),
            descricao: 'Desenvolvimento Web Site',
            status: 'PENDENTE_EMISSAO' as const
        },
        {
            cnpj: '22.222.222/0001-22',
            municipio: 'Curitiba',
            estado: 'PR',
            valor: 120.00,
            dataDesejada: new Date('2024-12-10T11:00:00Z'),
            descricao: 'Licença de Software Mensal',
            status: 'PENDENTE_EMISSAO' as const
        },
        {
            cnpj: '33.333.333/0001-33',
            municipio: 'Porto Alegre',
            estado: 'RS',
            valor: 850.00,
            dataDesejada: new Date('2024-12-12T16:00:00Z'),
            descricao: 'Treinamento Corporativo',
            status: 'PENDENTE_EMISSAO' as const
        },
        {
            cnpj: '44.444.444/0001-44',
            municipio: 'Salvador',
            estado: 'BA',
            valor: 300.00,
            dataDesejada: new Date('2024-12-15T10:00:00Z'),
            descricao: 'Suporte Técnico Remoto',
            status: 'PENDENTE_EMISSAO' as const
        },

        {
            cnpj: '55.555.555/0001-55',
            municipio: 'Campinas',
            estado: 'SP',
            valor: 10000.00,
            dataDesejada: new Date('2024-11-01T10:00:00Z'),
            descricao: 'Projeto de Arquitetura de Software',
            status: 'EMITIDA' as const,
            numeroNF: '2024001',
            dataEmissao: new Date('2024-11-01T10:05:00Z')
        },
        {
            cnpj: '66.666.666/0001-66',
            municipio: 'Recife',
            estado: 'PE',
            valor: 2000.00,
            dataDesejada: new Date('2024-11-05T15:00:00Z'),
            descricao: 'Serviços de Marketing Digital',
            status: 'EMITIDA' as const,
            numeroNF: '2024002',
            dataEmissao: new Date('2024-11-05T15:10:00Z')
        },
        {
            cnpj: '77.777.777/0001-77',
            municipio: 'Florianópolis',
            estado: 'SC',
            valor: 450.00,
            dataDesejada: new Date('2024-11-10T09:00:00Z'),
            descricao: 'Hospedagem de Sites Anual',
            status: 'EMITIDA' as const,
            numeroNF: '2024003',
            dataEmissao: new Date('2024-11-10T09:30:00Z')
        },
        {
            cnpj: '88.888.888/0001-88',
            municipio: 'Manaus',
            estado: 'AM',
            valor: 7500.00,
            dataDesejada: new Date('2024-11-15T14:00:00Z'),
            descricao: 'Consultoria Logística',
            status: 'EMITIDA' as const,
            numeroNF: '2024004',
            dataEmissao: new Date('2024-11-15T14:15:00Z')
        },
        {
            cnpj: '99.999.999/0001-99',
            municipio: 'Fortaleza',
            estado: 'CE',
            valor: 3200.00,
            dataDesejada: new Date('2024-11-20T11:00:00Z'),
            descricao: 'Auditoria de Sistemas',
            status: 'EMITIDA' as const,
            numeroNF: '2024005',
            dataEmissao: new Date('2024-11-20T11:45:00Z')
        },

        {
            cnpj: '10.101.010/0001-00',
            municipio: 'Brasília',
            estado: 'DF',
            valor: 15000.00,
            dataDesejada: new Date('2024-10-01T08:00:00Z'),
            descricao: 'Contrato Governamental - Cancelado',
            status: 'CANCELADA' as const
        },
        {
            cnpj: '20.202.020/0001-20',
            municipio: 'Goiânia',
            estado: 'GO',
            valor: 600.00,
            dataDesejada: new Date('2024-10-15T13:00:00Z'),
            descricao: 'Serviço pontual - Desistência',
            status: 'CANCELADA' as const
        },
        {
            cnpj: '30.303.030/0001-30',
            municipio: 'Vitória',
            estado: 'ES',
            valor: 900.00,
            dataDesejada: new Date('2024-10-20T10:00:00Z'),
            descricao: 'Reparo Elétrico - Erro cadastro',
            status: 'CANCELADA' as const
        },
        {
            cnpj: '40.404.040/0001-40',
            municipio: 'Natal',
            estado: 'RN',
            valor: 1100.00,
            dataDesejada: new Date('2024-10-25T16:00:00Z'),
            descricao: 'Locação de Equipamentos',
            status: 'CANCELADA' as const
        }
    ];

    for (const item of dadosMock) {
        await prisma.solicitacao.create({
            data: item
        });
    }

    console.log(`Seed concluído! ${dadosMock.length} solicitações criadas.`);
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
