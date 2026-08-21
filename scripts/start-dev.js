const { spawn } = require('child_process');
const path = require('path');

function runAdbReverse() {
  const sdkRoot =
    process.env.ANDROID_HOME ||
    process.env.ANDROID_SDK_ROOT ||
    path.join(process.env.LOCALAPPDATA || '', 'Android', 'Sdk');

  const adbPath = path.join(sdkRoot, 'platform-tools', process.platform === 'win32' ? 'adb.exe' : 'adb');

  return new Promise((resolve) => {
    const child = spawn(adbPath, ['reverse', 'tcp:8081', 'tcp:8081'], {
      stdio: 'ignore',
      windowsHide: true,
    });

    const timeout = setTimeout(() => {
      child.kill();
      resolve(false);
    }, 3000);

    child.on('error', () => {
      clearTimeout(timeout);
      resolve(false);
    });
    child.on('exit', (code) => {
      clearTimeout(timeout);
      resolve(code === 0);
    });
  });
}

async function main() {
  const reversed = await runAdbReverse();
  if (reversed) {
    console.log('USB: adb reverse tcp:8081 tcp:8081 configurado.');
  }

  const expo = spawn('npx', ['expo', 'start', '--dev-client'], {
    stdio: 'inherit',
    shell: true,
    cwd: path.join(__dirname, '..'),
  });

  expo.on('exit', (code) => process.exit(code ?? 0));
}

main();
