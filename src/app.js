const express = require("express");
const cors = require("cors");
const Yup = require("yup");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", async (request, response) => {
  try {

    const schema = Yup.object().shape({
      url: Yup.string().url().required(),
      title: Yup.string().required(),
      techs: Yup.array().required(),
    })

    await schema.validate(request.body, {abortEarly: true});
    const {url, title, techs} = request.body; 
    const newRepository = {id: uuid(), url, title, techs, likes: 0};
    repositories.push(newRepository)

    return response.json(newRepository)

  } catch(err) {
    return response.status(400).json({error: err})
  }

});

app.put("/repositories/:id", async (request, response) => {
  try {
    const schema = Yup.object().shape({
      url: Yup.string().url().required(),
      title: Yup.string().required(),
      techs: Yup.array().required(),
    })

    await schema.validate(request.body, {abortEarly: true});

    const repositoryFound = repositories.find(repo => repo.id === request.params.id)

    if(!repositoryFound) {
      return response.status(400).json({error: "Repository not found!"})
    }
    const repositoryIndex = repositories.findIndex(repo => repo.id === request.params.id)
    const repositoryUpdated = {...repositoryFound, ...request.body}
    const {url, title, techs} = request.body;
    
    repositories.splice(repositoryIndex, 1, {...repositoryFound, url, title, techs})

    return response.json(repositoryUpdated)
    
  } catch (err) {
    const repositoryFound = repositories.find(repo => repo.id === request.params.id)
    return response.status(400).json(repositoryFound)
  }
});

app.delete("/repositories/:id", (request, response) => {
  const repositoryIndex = repositories.findIndex(repo => repo.id === request.params.id)
    
  if(repositoryIndex === -1) {
    return response.status(400).json({error: "Repository not found!"})
  }
    
  repositories.splice(repositoryIndex, 1)

  return response.status(204).json(undefined)
});

app.post("/repositories/:id/like", (request, response) => {

    const repositoryFound = repositories.find(repo => repo.id === request.params.id)
    
    if(!repositoryFound) {
      return response.status(400).json({error: "Repository not found!"})
    }

    const repositoryIndex = repositories.findIndex(repo => repo.id === request.params.id)
    const repositoryUpdated = {...repositoryFound, likes: repositoryFound.likes+1}
    repositories.splice(repositoryIndex, 1, repositoryUpdated)

    return response.json(repositoryUpdated)
  
});

module.exports = app;
