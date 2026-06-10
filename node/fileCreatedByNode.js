
import { readFile, writeFile, appendFile, unlink } from 'node:fs/promises';

// async function handleFile() {
//   try {
//     // 1. Write a file
//     await writeFile('example.txt', 'Hello World!', 'utf8');
    
//     // 2. Read a file
//     const data = await readFile('example.txt', 'utf8');
//     console.log(data);
    
//     // 3. Append data
//     await appendFile('example.txt', '\nNew content added.    ');
    
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
 

writeFileAsync('./textFile.txt', textData).then(()=>{
    console.log('File written successfully');
}).catch((err)=>{
    console.error('Error writing file:', err);
}).finally(()=>{
    console.log('File operation completed');
});

