import prisma from '../lib/services/prismaClient.js';

export default class CategoriaModel {
    constructor({ id = null, nome } = {}) {
        this.id = id;
        this.nome = nome;
    }

    async criar() {
        return prisma.categoria.create({
            data: { nome: this.nome },
        });
    }

    async atualizar() {
        return prisma.categoria.update({
            where: { id: this.id },
            data: { nome: this.nome },
        });
    }

    async deletar() {
        return prisma.categoria.delete({ where: { id: this.id } });
    }

    static async buscarTodos() {
        return prisma.categoria.findMany({
            include: { produtos: true } 
        });
    }

    static async buscarPorId(id) {
        const data = await prisma.categoria.findUnique({
            where: { id },
            include: { produtos: true }
        });
        if (!data) return null;
        return new CategoriaModel(data);
    }
}