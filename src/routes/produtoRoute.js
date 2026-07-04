import express from 'express';
import * as controller from '../controllers/produtoController.js';
import artistaRouter from './routes/artistaRouter.js';
import categoriaRouter from './routes/categoriaRouter.js';
import produtoRouter from './routes/produtoRouter.js'; // O arquivo que você acabou de mandar

const app = express();
const router = express.Router();

// Middleware para o Express entender JSON no corpo (req.body) das requisições
app.use(express.json());

// Registrando as rotas do seu coletivo
app.use('/artistas', artistaRouter);
app.use('/categorias', categoriaRouter);
app.use('/produtos', produtoRouter); 

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando redondo na porta ${PORT}!`);
});

export default router;