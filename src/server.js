import http from "node:http";

import { json } from "./middlewares/json.js";
import { routes } from "./routes.js";
import { extractQueryParams } from "./utils/extract-query-params.js";

const server = http.createServer(async (request, response) => {
  const { method, url } = request;

  await json(request, response);

  const route = routes.find((route) => {
    return route.method === method && route.path.test(url);
  });

  if (route) {
    const routeParams = request.url.match(route.path);

    const { query, ...params } = routeParams.groups;

    request.params = params;
    request.query = query ? extractQueryParams(query) : {};

    return route.handler(request, response);
  }

  return response.writeHead(404).end("Not Found");
});

server.listen(3333);

// - HTTP
//     - Método HTTP;
//     - URL

// - GET, POST, PUT, PATCH, DELETE

// - GET => buscar um recurso do back-end
// - POST => criar um recurso no back-end
// - PUT => atualizar um recurso no back-end
// - PATCH => atualizar uma informação específica de um recurso no back-end
// -DELETE => deletar um recurso do back-end

// GET /users => buscar usuario
// POST /users => criar um usuário

// Stateful - Stateless

// Cabeçalhos (Request/response) => Metadados

// HTTP Status Code:

// - 100 a 199: resposta informativo;
// - 200 a 299: resposta de sucesso;
// - 300 a 399: mensagem de redirecionamento;
// - 400 a 499: erro de requisição do cliente;
// - 500 a 599: erro de resposta do servidor(erro inesperado);

// 3 formas do front enviar informações pra minha api:

// Query paramaters: http:localhost:3333/users?* userId=1&name-Murillo * (URL Stateful = filtros, paginação, busca)
// Route parameters: * GET/DELETE * http:localhost:3333/users/* 1 * (Identificação de recurso)
// Request body: http:localhost:3333/users Envio de informações de um formulário (HTTPs)
