const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const zlib = require('zlib');

// The SDK automatically picks up ~/.aws/credentials
const s3Client = new S3Client({ region: process.env.AWS_REGION || "ap-south-1" });
const BUCKET_NAME = "girgit-project"; 

async function getS3Object(key) {
    try {
        const command = new GetObjectCommand({ Bucket: BUCKET_NAME, Key: key });
        const response = await s3Client.send(command);
        const byteArray = await response.Body.transformToByteArray();
        return Buffer.from(byteArray);
    } catch (err) {
        if (err.name === 'NoSuchKey') return null;
        throw err;
    }
}

async function getGitObject(prefix, oid) {
    const key = `${prefix}/objects/${oid}`;
    const compressed = await getS3Object(key);
    if (!compressed) return null;
    
    // Decompress zlib
    const decompressed = zlib.inflateSync(compressed);
    
    // Format: "type size\0content"
    const nullIdx = decompressed.indexOf(0);
    const header = decompressed.subarray(0, nullIdx).toString('utf-8');
    const [type, size] = header.split(' ');
    const content = decompressed.subarray(nullIdx + 1);
    
    return { type, size: parseInt(size), content };
}

async function getHeadRef(prefix) {
    const key = `${prefix}/HEAD`;
    const data = await getS3Object(key);
    if (!data) return null;
    const content = data.toString('utf-8').trim();
    if (content.startsWith("ref: ")) {
        return content.split("ref: ")[1];
    }
    return content;
}

async function getRefOid(prefix, refPath) {
    const key = `${prefix}/${refPath}`;
    const data = await getS3Object(key);
    if (!data) return null;
    return data.toString('utf-8').trim();
}

// Parses a tree object content into an array of entries
function parseTree(content) {
    const entries = [];
    let i = 0;
    while (i < content.length) {
        const spaceIdx = content.indexOf(32, i); // ' '
        const nullIdx = content.indexOf(0, spaceIdx);
        if (spaceIdx === -1 || nullIdx === -1) break;
        
        const mode = content.subarray(i, spaceIdx).toString('utf-8');
        const name = content.subarray(spaceIdx + 1, nullIdx).toString('utf-8');
        const oidHex = content.subarray(nullIdx + 1, nullIdx + 21).toString('hex');
        
        entries.push({ mode, name, oid: oidHex, type: mode === '40000' ? 'tree' : 'blob' });
        i = nullIdx + 21;
    }
    return entries;
}

// Parses a commit object content
function parseCommit(content) {
    const text = content.toString('utf-8');
    const lines = text.split('\n');
    let tree = null;
    let parent = null;
    let author = null;
    let message = "";
    
    let i = 0;
    for (; i < lines.length; i++) {
        if (lines[i] === "") break;
        const [key, ...rest] = lines[i].split(' ');
        const val = rest.join(' ');
        if (key === 'tree') tree = val;
        else if (key === 'parent') parent = val;
        else if (key === 'author') author = val;
    }
    
    message = lines.slice(i + 1).join('\n').trim();
    
    return { tree, parent, author, message };
}

module.exports = {
    getGitObject,
    getHeadRef,
    getRefOid,
    parseTree,
    parseCommit
};
