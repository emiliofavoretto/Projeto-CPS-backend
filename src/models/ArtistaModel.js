import prisma from '../lib/services/prismaClient.js';

export default class ArtistaModel {
    constructor({ id = null, nome, biografia, fotoPerfil, linkPortfolio } = {}) {
        this.id = id;
        this.nome = nome;
        this.biografia = biografia;
        this.fotoPerfil = fotoPerfil;
        this.linkPortfolio = linkPortfolio;
    }

    async criar() {
        return prisma.artista.create({
            data: {
                nome: this.nome,
                biografia: this.biografia,
                fotoPerfil: this.fotoPerfil,
                linkPortfolio: this.linkPortfolio,
            },
        });
    }

    async atualizar() {
        return prisma.artista.update({
            where: { id: this.id },
            data: { 
                nome: this.nome, 
                biografia: this.biografia, 
                fotoPerfil: this.fotoPerfil, 
                linkPortfolio: this.linkPortfolio 
            },
        });
    }

    async deletar() {
        return prisma.artista.delete({ where: { id: this.id } });
    }

    static async buscarTodos(filtros = {}) {
        const where = {};

        if (filtros.nome) {
            where.nome = { contains: filtros.nome, mode: 'insensitive' };
        }
        
        return prisma.artista.findMany({ 
            where,
            include: {
                produtos: true 
            }
        });
    }

    static async buscarPorId(id) {
        const data = await prisma.artista.findUnique({ 
            where: { id },
            include: {
                produtos: true
            }
        });
        
        if (!data) {
            return null;
        }
        return new ArtistaModel(data);
    }
}