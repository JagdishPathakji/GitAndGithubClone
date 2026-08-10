const fs = require("fs")
const path = require("path")

const config = path.join(require("os").homedir(),".girgit","config.json")

function checkGlobalConfig() {
    return fs.existsSync(config)
}

function getGlobalConfig() {
    if(checkGlobalConfig()) {
        const configData = JSON.parse(fs.readFileSync(config,"utf-8"))
        if(configData.username && configData.email && configData.token)
        return configData
    }

    return null
}

function checkforgirgit() {
    const girgitPath = path.join(process.cwd(),".girgit")
    return fs.existsSync(girgitPath)
}

module.exports = {
    checkGlobalConfig,
    getGlobalConfig,
    checkforgirgit
}