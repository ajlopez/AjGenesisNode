
var fs = require('fs');
var path = require('path');

function removeDirSync(dirname) {
    if (!fs.existsSync(dirname))
        return;
        
    var filenames = fs.readdirSync(dirname);
    
    filenames.forEach(function (filename) {
        filename = path.join(dirname, filename);
        
        if (isDirectory(filename))
            removeDirSync(filename);
        else
            removeFileSync(filename);
    });
    
    fs.rmdirSync(dirname);
}

function removeFileSync(filename) {
    fs.unlinkSync(filename);
}

function isDirectory(filename)
{
    try {
        var stats = fs.lstatSync(filename);
        return stats.isDirectory();
    }
    catch (err)
    {
        return false;
    }
}

module.exports = {
    isDirectory: isDirectory,
    removeFile: removeFileSync,
    removeDirectory: removeDirSync
}