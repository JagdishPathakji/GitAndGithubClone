const User = require("../database/models/userModel");
const Repository = require("../database/models/repoModel");
const jwt = require("jsonwebtoken");
const s3Git = require("./s3GitHelper");

// Helper to authenticate user from cookie
const getUser = async (req) => {
    const token = req.cookies.token;
    if (!token) return null;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        return await User.findOne({ email: decoded.email });
    } catch {
        return null;
    }
}

const createRepo = async (req, res) => {
    try {
        const user = await getUser(req);
        if (!user) return res.status(401).json({ status: false, message: "Unauthorized" });

        const { name, description, isPrivate } = req.body;
        if (!name) return res.status(400).json({ status: false, message: "Repository name is required" });

        const exists = await Repository.findOne({ name, owner: user._id });
        if (exists) return res.status(400).json({ status: false, message: "Repository name already exists" });

        // Build S3 Prefix: username/repoName
        const s3Prefix = `${user.username}/${name}`;

        const repo = new Repository({
            name,
            description,
            isPrivate: !!isPrivate,
            owner: user._id,
            s3Prefix
        });

        await repo.save();
        
        return res.status(201).json({ status: true, message: "Repository created", repo });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: "Internal server error" });
    }
}

const getUserRepos = async (req, res) => {
    try {
        const user = await getUser(req);
        if (!user) return res.status(401).json({ status: false, message: "Unauthorized" });

        const repos = await Repository.find({ owner: user._id }).sort({ createdAt: -1 });
        return res.status(200).json({ status: true, repos });
    } catch (error) {
        return res.status(500).json({ status: false, message: "Internal server error" });
    }
}

const getRepoDetails = async (req, res) => {
    try {
        const { username, repoName } = req.params;
        
        // Find owner
        const owner = await User.findOne({ username });
        if (!owner) return res.status(404).json({ status: false, message: "User not found" });

        const repo = await Repository.findOne({ name: repoName, owner: owner._id });
        if (!repo) return res.status(404).json({ status: false, message: "Repository not found" });

        // Optionally, check if it has a HEAD ref in S3 to know if it's empty
        const headRef = await s3Git.getHeadRef(repo.s3Prefix);
        const isEmpty = !headRef;

        return res.status(200).json({ status: true, repo, isEmpty, s3Prefix: repo.s3Prefix });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: "Internal server error" });
    }
}

const getRepoFiles = async (req, res) => {
    try {
        const { username, repoName } = req.params;
        const owner = await User.findOne({ username });
        const repo = await Repository.findOne({ name: repoName, owner: owner?._id });
        if (!repo) return res.status(404).json({ status: false, message: "Repository not found" });

        let oid = req.query.oid; // if browsing sub-folder
        
        if (!oid) {
            // Get root tree
            const headRef = await s3Git.getHeadRef(repo.s3Prefix);
            if (!headRef) return res.status(200).json({ status: true, files: [] }); // Empty repo
            
            const headOid = await s3Git.getRefOid(repo.s3Prefix, headRef);
            if (!headOid) return res.status(200).json({ status: true, files: [] });

            const commitObj = await s3Git.getGitObject(repo.s3Prefix, headOid);
            if (!commitObj) return res.status(404).json({ status: false, message: "Commit not found" });

            const commit = s3Git.parseCommit(commitObj.content);
            oid = commit.tree;
        }

        const treeObj = await s3Git.getGitObject(repo.s3Prefix, oid);
        if (!treeObj || treeObj.type !== 'tree') {
            return res.status(404).json({ status: false, message: "Tree not found" });
        }

        const entries = s3Git.parseTree(treeObj.content);
        return res.status(200).json({ status: true, files: entries });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: "Internal server error" });
    }
}

const getRepoCommits = async (req, res) => {
    try {
        const { username, repoName } = req.params;
        const owner = await User.findOne({ username });
        const repo = await Repository.findOne({ name: repoName, owner: owner?._id });
        if (!repo) return res.status(404).json({ status: false, message: "Repository not found" });

        const headRef = await s3Git.getHeadRef(repo.s3Prefix);
        if (!headRef) return res.status(200).json({ status: true, commits: [] });
        
        let currentOid = await s3Git.getRefOid(repo.s3Prefix, headRef);
        const commits = [];

        // Traverse history (limit to 50 for performance)
        for (let i = 0; i < 50; i++) {
            if (!currentOid) break;
            const commitObj = await s3Git.getGitObject(repo.s3Prefix, currentOid);
            if (!commitObj) break;

            const commit = s3Git.parseCommit(commitObj.content);
            commits.push({
                oid: currentOid,
                message: commit.message,
                author: commit.author,
            });
            currentOid = commit.parent;
        }

        return res.status(200).json({ status: true, commits });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: "Internal server error" });
    }
}

const getBlobContent = async (req, res) => {
    try {
        const { username, repoName, oid } = req.params;
        const owner = await User.findOne({ username });
        const repo = await Repository.findOne({ name: repoName, owner: owner?._id });
        if (!repo) return res.status(404).json({ status: false, message: "Repository not found" });

        const blobObj = await s3Git.getGitObject(repo.s3Prefix, oid);
        if (!blobObj || blobObj.type !== 'blob') {
            return res.status(404).json({ status: false, message: "Blob not found" });
        }

        // Return as string for display
        return res.status(200).json({ status: true, content: blobObj.content.toString('utf-8') });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: "Internal server error" });
    }
}

module.exports = {
    createRepo,
    getUserRepos,
    getRepoDetails,
    getRepoFiles,
    getRepoCommits,
    getBlobContent
};
