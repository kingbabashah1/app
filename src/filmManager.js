const fs = window.require('fs');
const path = window.require('path');
const os = window.require('os');

export function copyFileToUSB(filePath, callback) {
  const drives = getRemovableDrives();
  if (drives.length === 0) {
    callback(new Error('هیچ فلشی پیدا نشد!'));
    return;
  }
  const usbDrive = drives[0];
  const fileName = path.basename(filePath);
  const destPath = path.join(usbDrive, fileName);

  fs.copyFile(filePath, destPath, (err) => {
    callback(err, destPath);
  });
}

function getRemovableDrives() {
  if (os.platform() !== 'win32') return [];
  const possibleDrives = [];
  for (let i = 65; i <= 90; i++) {
    const drive = String.fromCharCode(i) + ':\\';
    try {
      if (fs.existsSync(drive)) {
        if (!fs.existsSync(path.join(drive, 'Windows')) && fs.readdirSync(drive).length < 100) {
          possibleDrives.push(drive);
        }
      }
    } catch {}
  }
  return possibleDrives;
}