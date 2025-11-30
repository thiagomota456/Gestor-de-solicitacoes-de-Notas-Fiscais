import { z } from 'zod';
import { validarCNPJ } from '../utils/validators'; // Sua função validadora

export const solicitacaoSchema = z.object({
    cnpj: z.string()
        .transform((val) => val.replace(/[^\d]+/g, '')) // Limpa máscara
        .refine((val) => val.length === 14, "O CNPJ deve ter 14 dígitos")
        .refine((val) => validarCNPJ(val), "CNPJ inválido (Dígitos verificadores)"),

    municipio: z.string().min(3, "Município inválido"),

    estado: z.string().length(2).toUpperCase(),

    valor: z.number().positive(),

    dataDesejada: z.string().datetime(),

    descricao: z.string().min(5)
});