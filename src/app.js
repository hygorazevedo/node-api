const express = require("express");
const cors = require("cors");
const { v4: uuid, validate } = require("uuid");

const app = express();

const logRequests = (request, response, next) => {
  const { method, url } = request;
  const logText = `[${method}] ${url}`;

  console.time(logText);
  next();
  console.timeEnd(logText);
};

const validateId = (request, response, next) => {
  const { id } = request.params;

  if (!validate(id)) {
    return response.status(400).json({ error: "Invalid repository ID." });
  }

  return next();
};

const validateIdExistance = (request, response, next) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0) {
    return response.status(404).send();
  }

  return next();
};

app.use("/repositories/:id", [validateId, validateIdExistance]);
app.use(logRequests);
app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { url, title, techs } = request.body;

  const reposity = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(reposity);

  return response.json(reposity);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  const repository = {
    id,
    title,
    url,
    techs,
    likes: 0,
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  let likes = repositories[repositoryIndex].likes;

  likes += 1;

  repositories[repositoryIndex].likes = likes;

  return response.json({ likes });
});

module.exports = app;
