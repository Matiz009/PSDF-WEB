const http = require('http');
const { readFile } = require('fs/promises');

const PORT = 3000;

const server = http.createServer(async (req, res) => {
    console.log('Request received');

    if (req.url === '/file') {
        try {
            const data = await readFile('./async_fs.js', 'utf8');

            console.log('File read successfully');

            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/plain');
            res.end(data);
        } catch (err) {
            console.error('Error reading file:', err);

            res.statusCode = 500;
            res.setHeader('Content-Type', 'text/plain');
            res.end('Internal Server Error');
        }

        return;
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello, World!');
});

server.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});