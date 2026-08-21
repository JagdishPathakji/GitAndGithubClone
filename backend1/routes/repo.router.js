const express = require("express");
const repoRouter = express.Router();
const repoController = require("../controllers/repoController");

repoRouter.post("/repo/create", repoController.createRepo);
repoRouter.get("/user/repos", repoController.getUserRepos);

repoRouter.get("/repo/:username/:repoName", repoController.getRepoDetails);
repoRouter.get("/repo/:username/:repoName/files", repoController.getRepoFiles);
repoRouter.get("/repo/:username/:repoName/commits", repoController.getRepoCommits);
repoRouter.get("/repo/:username/:repoName/blob/:oid", repoController.getBlobContent);

module.exports = repoRouter;
