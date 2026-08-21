const express = require("express")
const mainRouter = express.Router()
const userRouter = require("./user.router")
const repoRouter = require("./repo.router")

mainRouter.use(userRouter)
mainRouter.use(repoRouter)

mainRouter.get("/", (req,res)=> {
    res.send("I am server")
})

module.exports = mainRouter