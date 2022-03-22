const routes = require('next-routes')();

routes
    .add('/campanhas/nova', '/campanhas/nova')
    .add('/campanhas/:address', '/campanhas/show')
    .add('/campanhas/:address/gastos', '/campanhas/gastos/index')
    .add('/campanhas/:address/gastos/novo', '/campanhas/gastos/novo');

module.exports = routes;
