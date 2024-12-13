const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

// Define the home directory and download folder
const homeDirectory = require('os').homedir();
const downloadFolder = path.join(homeDirectory, 'Downloads');

// Define the folder names for each file type
const folders = {
    '.txt': 'docs',
    '.pdf': 'pdf',
    '.png': 'images',
    '.PNG': 'images',
    '.jpg': 'images',
    '.JPG': 'images',
    '.jpeg': 'images',
    '.gif': 'images',
    '.svg': 'images',
    '.mp4': 'videos',
    '.mov': 'videos',
    '.avi': 'videos',
    '.mp3': 'audio',
    '.wav': 'audio',
    '.zip': 'archives',
    '.rar': 'archives',
    '.7z': 'archives',
    '.exe': 'apps',
    '.dmg': 'apps',
    '.pkg': 'apps',
    '.deb': 'apps',
    '.iso': 'apps',
    '.css': 'code',
    '.html': 'code',
    '.js': 'code',
    '.json': 'code',
    '.py': 'code',
    '.java': 'code',
    '.c': 'code',
    '.cpp': 'code',
    '.h': 'code',
    '.hpp': 'code', 
    '.sh': 'code',
    '.md': 'code',
    '.csv': 'data',
    '.xls': 'data',
    '.xlsx': 'data',
    '.sql': 'db',
    '.db': 'db',
    '.db3': 'db',
    '.sqlite': 'db',
    '.sqlite3': 'db',
    '.dat': 'data',
    '.xml': 'xml',
    '.log': 'logs',
    '.ppt': 'presentations',
    '.pptx': 'presentations',
    '.key': 'presentations',
    '.pages': 'docs',
    '.numbers': 'sheets',
    '.ai': 'design',
    '.psd': 'design',
    '.sketch': 'design',
    '.fig': 'design',
    '.pdf': 'docs',
    '.PDF': 'docs',
    '.doc': 'docs',
    '.docx': 'docs',
    '.xls': 'data',
    '.xlsx': 'data'
};



// Define the archive folder
const archiveFolder = '_Archive';
const archiveFolderPath = path.join(downloadFolder, archiveFolder);

// Create the archive folder if it doesn't exist
if (!fs.existsSync(archiveFolderPath)) {
    fs.mkdirSync(archiveFolderPath);
}

// Function to move files to a specific folder
function moveFile(filePath, targetFolder) {
    const filename = path.basename(filePath);
    const destination = path.join(targetFolder, filename);

    if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder);
    }

    fs.renameSync(filePath, destination);
}

// Function to organize files
function organizeFiles() {
    const currentTime = Date.now();

    fs.readdirSync(downloadFolder).forEach((filename) => {
        const filePath = path.join(downloadFolder, filename);

        // Check if the item is a file
        if (fs.statSync(filePath).isFile()) {
            const fileAge = currentTime - fs.statSync(filePath).mtime.getTime();

            // Check if file is older than 90 days (in milliseconds: 90 * 24 * 60 * 60 * 1000)
            if (fileAge > 90 * 24 * 60 * 60 * 1000) {
                moveFile(filePath, archiveFolderPath);
                return;
            }

            // Get the file extension
            const extension = path.extname(filename);

            // If the file extension is in the dictionary of folder names, move the file
            if (folders.hasOwnProperty(extension)) {
                const folderName = folders[extension];
                const folderPath = path.join(downloadFolder, folderName);

                moveFile(filePath, folderPath);
            }
        }
    });
}

// Watch for changes in the Downloads folder using chokidar
const watcher = chokidar.watch(downloadFolder, {
    persistent: true,
    ignoreInitial: true, // Ignore initial add events
    awaitWriteFinish: true // Wait for file write to finish
});

watcher.on('add', (filePath) => {
    console.log(`File added: ${filePath}`);
    organizeFiles();
});

// Initial organization when the script starts
organizeFiles();
