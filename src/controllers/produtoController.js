import ProdutoModel from '../models/ProdutoModel.js';

export const criar = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ error: 'Corpo da requisição vazio. Envie os dados!' });
        }

        const { nome, descricao, urlImagem, artistaId, categoriaId } = req.body;

        // Validações básicas de campos obrigatórios do Schema
        if (!nome) return res.status(400).json({ error: 'O campo "nome" é obrigatório!' });
        if (!urlImagem) return res.status(400).json({ error: 'O campo "urlImagem" é obrigatório!' });
        if (!artistaId) return res.status(400).json({ error: 'O campo "artistaId" (ID do criador) é obrigatório!' });
        if (!categoriaId) return res.status(400).json({ error: 'O campo "categoriaId" é obrigatório!' });

        // Passando todos os campos necessários para a instância do Model
        const produto = new ProdutoModel({ nome, descricao, urlImagem, artistaId, categoriaId });
        const data = await produto.criar();

        return res.status(201).json({ message: 'Produto criado com sucesso!', data });
    } catch (error) {
        console.error('Erro ao criar Produto:', error);
        return res.status(500).json({ error: 'Erro interno ao salvar o produto.' });
    }
};

export const buscarTodos = async (req, res) => {
    try {
        const registros = await ProdutoModel.buscarTodos();

        if (!registros || registros.length === 0) {
            return res.status(404).json({ message: 'Nenhum Produto encontrado.' });
        }

        return res.status(200).json(registros);
    } catch (error) {
        console.error('Erro ao buscar Produto:', error);
        return res.status(500).json({ error: 'Erro ao buscar Produto.' });
    }
};

export const buscarPorId = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'O ID enviado não é um número válido.' });
        }

        const produto = await ProdutoModel.buscarPorId(parseInt(id));

        if (!produto) {
            return res.status(404).json({ error: 'Produto não encontrado.' });
        }

        return res.status(200).json({ data: produto });
    } catch (error) {
        console.error('Erro ao buscar produto:', error);
        return res.status(500).json({ error: 'Erro ao buscar produto.' });
    }
};

export const atualizar = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        if (!req.body) {
            return res.status(400).json({ error: 'Corpo da requisição vazio.' });
        }

        const produto = await ProdutoModel.buscarPorId(parseInt(id));

        if (!produto) {
            return res.status(404).json({ error: 'Produto não encontrado para atualizar.' });
        }

        // Atualiza dinamicamente apenas os campos que forem enviados no corpo
        if (req.body.nome !== undefined) produto.nome = req.body.nome;
        if (req.body.descricao !== undefined) produto.descricao = req.body.descricao;
        if (req.body.urlImagem !== undefined) produto.urlImagem = req.body.urlImagem;
        if (req.body.artistaId !== undefined) produto.artistaId = req.body.artistaId;
        if (req.body.categoriaId !== undefined) produto.categoriaId = req.body.categoriaId;

        const data = await produto.atualizar();

        return res.status(200).json({ message: `O Produto "${data.nome}" foi atualizado com sucesso!`, data });
    } catch (error) {
        console.error('Erro ao atualizar produto:', error);
        return res.status(500).json({ error: 'Erro ao atualizar Produto.' });
    }
};

export const deletar = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        const produto = await ProdutoModel.buscarPorId(parseInt(id));

        if (!produto) {
            return res.status(404).json({ error: 'Produto não encontrado para deletar.' });
        }

        await produto.deletar();

        return res.status(200).json({ message: `O Produto "${produto.nome}" foi deletado com sucesso!` });
    } catch (error) {
        console.error('Erro ao deletar Produto:', error);
        return res.status(500).json({ error: 'Erro ao deletar Produto.' });
    }
};