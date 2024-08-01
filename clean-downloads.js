const fs = require('fs');
const path = require('path');
const chokidar = require('chokidar');

// Define the home directory and download folder
const homeDirectory = require('os').homedir();
const downloadFolder = path.join(homeDirectory, 'Downloads');

// Define the folder names for each file type
const folders = {
    '.txt': 'Text Files',
    '.pdf': 'PDF Files',
    '.png': 'Image Files',
    '.PNG': 'Image Files',
    '.jpg': 'Image Files',
    '.JPG': 'Image Files',
    '.jpeg': 'Image Files',
    '.webp': 'Image Files',
    '.svg': 'Image Files',
    '.doc': 'Word Documents',
    '.mov': 'Videos',
    '.mp4': 'Videos',
    '.xlsx': 'Spreadsheets',
    '.csv': 'Spreadsheets',
    '.zip': 'Zip Files',
    '.dmg': 'Installers',
    '.docx': 'Word Documents',
    '.pages': 'Pages Documents',
    '.saver': 'Screensavers',
    '.pptx': 'PowerPoint Presentations',
    '.duck': 'Cyberduck Bookmarks',
    '.apk': 'Android Apps',
    '.ai': 'Adobe Illustrator Files',
    '.gif': 'GIF Files',
    '.pkg': 'Installers',
    '.flow': 'Figma Files',
    '.psd': 'Photoshop Files',
    '.MP4': 'Videos',
    '.sql': 'SQL Files',
    '.numbers': 'Spreadsheets',
    '.bz2': 'Compressed Files',
   '.duck': 'Cyberduck Bookmarks',
    '.apk': 'Android Apps',
    '.ai': 'Adobe Illustrator Files',
    '.gif': 'GIF Files',
    '.pkg': 'Installers',
    '.flow': 'Figma Files',
    '.psd': 'Photoshop Files',
    '.mp4': 'Videos',
    '.sql': 'SQL Files',
    '.numbers': 'Spreadsheets',
    '.bz2': 'Compressed Files',
    '.txt': 'Text Files',
    '.pdf': 'PDF Files',
    '.docx': 'Word Documents',
    '.xlsx': 'Excel Files',
    '.pptx': 'PowerPoint Presentations',
    '.html': 'HTML Files',
    '.css': 'CSS Files',
    '.js': 'JavaScript Files',
    '.zip': 'ZIP Archives',
    '.rar': 'RAR Archives',
    '.exe': 'Executable Files',
    '.dmg': 'Disk Images',
    '.iso': 'ISO Files',
    '.mp3': 'Audio Files',
    '.wav': 'WAV Files',
    '.avi': 'AVI Videos',
    '.mkv': 'MKV Videos',
    '.mov': 'MOV Videos',
    '.flv': 'FLV Videos',
    '.ts': 'MPEG Transport Stream Videos',
    '.eps': 'Encapsulated PostScript Files',
    '.svg': 'Scalable Vector Graphics',
    '.json': 'JSON Files',
    '.xml': 'XML Files',
    '.yaml': 'YAML Files',
    '.md': 'Markdown Files',
    '.py': 'Python Scripts',
    '.java': 'Java Source Files',
    '.c': 'C Source Files',
    '.cpp': 'C++ Source Files',
    '.php': 'PHP Files',
    '.rb': 'Ruby Files',
    '.pl': 'Perl Scripts',
    '.go': 'Go Files',
    '.swift': 'Swift Files',
    '.sh': 'Shell Scripts',
    '.bat': 'Batch Files',
    '.log': 'Log Files',
    '.ini': 'Configuration Files',
    '.conf': 'Configuration Files',
    '.yml': 'YAML Files',
    '.pem': 'PEM Certificate Files',
    '.crt': 'Certificate Files',
    '.key': 'Key Files',
    '.sql': 'SQL Files',
    '.db': 'Database Files',
    '.bak': 'Backup Files',
    '.tmp': 'Temporary Files',
    '.saver': 'Screensavers',
    '.hex': 'Keyboard Config'
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
