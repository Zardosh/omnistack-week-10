const { Router } = require('express');
const DevController = require('./controllers/DevController');
const SearchController = require('./controllers/SearchController');

const routes = Router();

// métodos HTTP: GET - pegar info, 
// POST - criar info, PUT - editar,
// DELETE - deletar

// Tipos de parâmetros:
// Query Params: req.query (Filtros, ordenação, paginação...)
// Route Params: req.params (Identificar um recurso na alteração ou remoção)
// Body:  req.body (Dados para criação ou alteração de um registro)

routes.get('/devs', DevController.index);
routes.post('/devs', DevController.store);
routes.put('/devs/:github_username', DevController.update);
routes.delete('/devs/:github_username', DevController.destroy);

routes.get('/search', SearchController.index);

module.exports = routes;
