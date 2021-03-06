const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

const checkIdMiddleware = (request, response, next) => {
  const { id } = request.params;

  if (!id) return response.status(400).json({ error: "ID não informado" });

  const repository = repositories.filter(repository => repository.id === id);

  if (repository.length === 0) {
    return response.status(400).json({ error: "Não existe repositório com o ID informado" });
  }

  request.repository = repository;

  return next();
};

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };
  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id", checkIdMiddleware, (request, response) => {
  const { title, url, techs } = request.body;
  const { repository } = request;

  const index = repositories.indexOf(repository[0]);
  repositories[index].title = title ? title : repositories[index].title;
  repositories[index].url = url ? url : repositories[index].url;
  repositories[index].techs = techs && techs.length > 0 ? techs : repositories[index].techs;

  return response.json(repositories[index]);

});

app.delete("/repositories/:id", checkIdMiddleware, (request, response) => {
  const { repository } = request;

  const index = repositories.indexOf(repository[0]);

  repositories.splice(index, 1);

  return response.status(204).json(repositories);
});

app.post("/repositories/:id/like", checkIdMiddleware, (request, response) => {
  const { repository } = request;
  
  const index = repositories.indexOf(repository[0]);

  repositories[index].likes++;

  return response.json(repositories[index]);
});

module.exports = app;
