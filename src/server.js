import express from 'express';
import 'dotenv/config';
import artistaRoutes from './routes/artistaRoute.js';
import categoriaRoutes from './routes/categoriaRoute.js'; 
import produtoRoutes from './routes/produtoRoute.js';    

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('🚀 API funcionando');
});

// Rotas da API
app.use('/api/artista', artistaRoutes);
app.use('/api/categoria', categoriaRoutes);
app.use('/api/produto', produtoRoutes);     

app.use((req, res) => {
    res.status(404).json({ error: 'Rota não encontrada' });
});

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});