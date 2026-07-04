import prisma from '../lib/services/prismaClient.js';

export default class ProdutoModel {
    constructor({ id = null, nome, descricao, urlImagem, artistaId, categoriaId } = {}) {
        this.id = id;
        this.nome = nome;
        this.descricao = descricao;
        this.urlImagem = urlImagem;
        this.artistaId = artistaId;
        this.categoriaId = categoriaId;
    }

    async criar() {
        return prisma.produto.create({
            data: {
                nome: this.nome,
                descricao: this.descricao,
                urlImagem: this.urlImagem,
                artistaId: this.artistaId,
                categoriaId: this.categoriaId,
            },
        });
    }

    async atualizar() {
        return prisma.produto.update({
            where: { id: this.id },
            data: { 
                nome: this.nome, 
                descricao: this.descricao, 
                urlImagem: this.urlImagem,
                artistaId: this.artistaId,
                categoriaId: this.categoriaId,
            },
        });
    }

    async deletar() {
        return prisma.produto.delete({ where: { id: this.id } });
    }

    static async buscarTodos(filtros = {}) {
        const where = {};

        if (filtros.nome) {
            where.nome = { contains: filtros.nome, mode: 'insensitive' };
        }

        // Se quiser filtrar produtos por uma categoria específica na URL (ex: ?categoriaId=2)
        if (filtros.categoriaId) {
            where.categoriaId = parseInt(filtros.categoriaId);
        }

        // Se quiser filtrar produtos por um artista específico na URL (ex: ?artistaId=5)
        if (filtros.artistaId) {
            where.artistaId = parseInt(filtros.artistaId);
        }
        
        return prisma.produto.findMany({
            where,
            include: {
                artista: true,   // Traz as informações do artista dono do produto
                categoria: true  // Traz o nome da categoria (ex: "Camisetas")
            }
        });
    }

    static async buscarPorId(id) {
        const data = await prisma.produto.findUnique({ 
            where: { id },
            include: {
                artista: true,
                categoria: true
            }
        });
        
        if (!data) {
            return null;
        }
        return new ProdutoModel(data);
    }
}