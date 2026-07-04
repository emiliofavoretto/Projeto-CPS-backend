import ArtistaModel from '../models/ArtistaModel.js';

export const criar = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ error: 'Corpo da requisição vazio. Envie os dados!' });
        }

        const { nome, biografia, fotoPerfil, linkPortfolio } = req.body;

        // Validações dos campos corretos do Schema
        if (!nome){
            return res.status(400).json({ error: 'O campo "nome" é obrigatório!' });
        }
        if (biografia === undefined || biografia === null) {
            return res.status(400).json({ error: 'O campo "biografia" é obrigatório!' });
        }
        if (fotoPerfil === undefined || fotoPerfil === null) {
            return res.status(400).json({ error: 'O campo "fotoPerfil" é obrigatório!' });
        }

        const artista = new ArtistaModel({ nome, biografia, fotoPerfil, linkPortfolio });
        const data = await artista.criar();

        return res.status(201).json({ message: 'Registro criado com sucesso!', data });
    } catch (error) {
        console.error('Erro ao criar:', error);
        return res.status(500).json({ error: 'Erro interno ao salvar o registro.' });
    }
};

export const buscarTodos = async (req, res) => {
    try {
        const registros = await ArtistaModel.buscarTodos(req.query);

        if (!registros || registros.length === 0) {
            return res.status(400).json({ message: 'Nenhum registro encontrado.' });
        }

        return res.status(200).json(registros);
    } catch (error) {
        console.error('Erro ao buscar:', error);
        return res.status(500).json({ error: 'Erro ao buscar registros.' });
    }
};

export const buscarPorId = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'O ID enviado não é um número válido.' });
        }

        const artista = await ArtistaModel.buscarPorId(parseInt(id));

        if (!artista) {
            return res.status(404).json({ error: 'Registro não encontrado.' });
        }

        return res.status(200).json({ data: artista });
    } catch (error) {
        console.error('Erro ao buscar:', error);
        return res.status(500).json({ error: 'Erro ao buscar registro.' });
    }
};

export const atualizar = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        if (!req.body) {
            return res.status(400).json({ error: 'Corpo da requisição vazio. Envie os dados!' });
        }

        const artista = await ArtistaModel.buscarPorId(parseInt(id));

        if (!artista) {
            return res.status(404).json({ error: 'Registro não encontrado para atualizar.' });
        }
        if (req.body.nome !== undefined) {
            artista.nome = req.body.nome;
        }
        if (req.body.biografia !== undefined) {
            artista.biografia = req.body.biografia;
        }
        if (req.body.fotoPerfil !== undefined) {
            artista.fotoPerfil = req.body.fotoPerfil; 
        }
        if (req.body.linkPortfolio !== undefined) {
            artista.linkPortfolio = req.body.linkPortfolio;
        }

        const data = await artista.atualizar();

        return res.status(200).json({ message: `O registro "${data.nome}" foi atualizado com sucesso!`, data });
    } catch (error) {
        console.error('Erro ao atualizar:', error);
        return res.status(500).json({ error: 'Erro ao atualizar registro.' });
    }
};

export const deletar = async (req, res) => {
    try {
        const { id } = req.params;

        if (isNaN(id)) {
            return res.status(400).json({ error: 'ID inválido.' });
        }

        const artista = await ArtistaModel.buscarPorId(parseInt(id));

        if (!artista) {
            return res.status(404).json({ error: 'Registro não encontrado para deletar.' });
        }

        await artista.deletar();

        return res.status(200).json({ message: `O registro "${artista.nome}" foi deletado com sucesso!`, deletado: artista });
    } catch (error) {
        console.error('Erro ao deletar:', error);
        return res.status(500).json({ error: 'Erro ao deletar registro.' });
    }
};