import CategoriaModel from '../models/CategoriaModel.js';

export const criar = async (req, res) => {
    try {
        if (!req.body || !req.body.nome) {
            return res.status(400).json({ error: 'O campo "nome" é obrigatório!' });
        }

        const { nome } = req.body;

        const categoria = new CategoriaModel({ nome });
        const data = await categoria.criar();

        return res.status(201).json({ message: 'Categoria criada com sucesso!', data });
    } catch (error) {
        console.error('Erro ao criar categoria:', error);
        // Tratamento caso tentem criar uma categoria com nome repetido (Unique no Prisma)
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'Uma categoria with este nome já existe.' });
        }
        return res.status(500).json({ error: 'Erro interno ao salvar a categoria.' });
    }
};

export const buscarTodos = async (req, res) => {
    try {
        const registros = await CategoriaModel.buscarTodos();

        if (!registros || registros.length === 0) {
            return res.status(404).json({ message: 'Nenhuma categoria encontrada.' });
        }

        return res.status(200).json(registros);
    } catch (error) {
        console.error('Erro ao buscar categorias:', error);
        return res.status(500).json({ error: 'Erro ao buscar categorias.' });
    }
};

export const buscarPorId = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'O ID enviado não é um número válido.' });
        }

        const categoria = await CategoriaModel.buscarPorId(parseInt(id));

        if (!categoria) {
            return res.status(404).json({ error: 'Categoria não encontrada.' });
        }

        return res.status(200).json({ data: categoria });
    } catch (error) {
        console.error('Erro ao buscar categoria:', error);
        return res.status(500).json({ error: 'Erro ao buscar categoria.' });
    }
};

export const atualizar = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        if (!req.body || !req.body.nome) {
            return res.status(400).json({ error: 'Envie o campo "nome" para atualizar!' });
        }

        const categoria = await CategoriaModel.buscarPorId(parseInt(id));

        if (!categoria) {
            return res.status(404).json({ error: 'Categoria não encontrada para atualizar.' });
        }

        categoria.nome = req.body.nome;

        const data = await categoria.atualizar();

        return res.status(200).json({ message: `A categoria foi atualizada para "${data.nome}" com sucesso!`, data });
    } catch (error) {
        console.error('Erro ao atualizar categoria:', error);
        return res.status(500).json({ error: 'Erro ao atualizar categoria.' });
    }
};

export const deletar = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        const categoria = await CategoriaModel.buscarPorId(parseInt(id));

        if (!categoria) {
            return res.status(404).json({ error: 'Categoria não encontrada para deletar.' });
        }

        await categoria.deletar();

        return res.status(200).json({ message: `A categoria "${categoria.nome}" foi deletada com sucesso!`, deletado: categoria });
    } catch (error) {
        console.error('Erro ao deletar categoria:', error);
        // Tratamento caso a categoria tenha produtos vinculados a ela
        if (error.code === 'P2003') {
            return res.status(400).json({ error: 'Não é possível deletar uma categoria que possui produtos vinculados.' });
        }
        return res.status(500).json({ error: 'Erro ao deletar categoria.' });
    }
};