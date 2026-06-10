import { readFile, writeFile, appendFile, unlink } from 'node:fs/promises';

// async function handleFile() {
//   try {
//     // 1. Write a file
//     await writeFile('example.txt', 'Hello World!', 'utf8');
    
//     // 2. Read a file
//     const data = await readFile('example.txt', 'utf8');
//     console.log(data);
    
//     // 3. Append data
//     await appendFile('example.txt', '\nNew content added.');
    
//     // 4. Delete a file
//     await unlink('example.txt');
    
//   } catch (err) {
//     console.error('File operation failed:', err);
//   }
// }

// handleFile();

async function writeFileAsync(path,data,encoding='utf8') {
    await writeFile(path, data, encoding);
}

async function readFileAsync(path, encoding='utf8') {
    const data = await readFile(path, encoding);
    return data;
}


// let textData = `This is a sample text file created using async/await in Node.js. lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.`; 
// writeFileAsync('./textFile.txt', textData).then(()=>{
//     console.log('File written successfully');
// }).catch((err)=>{
//     console.error('Error writing file:', err);
// }).finally(()=>{
//     console.log('File operation completed');
// });


readFileAsync('./index.js').then((data)=>{
    console.log('File read successfully:');
    console.log(data);
}).catch((err)=>{
    console.error('Error reading file:', err);
}).finally(()=>{
    console.log('File operation completed');
});