import os from 'os';

export function systemInfo(prop, currentFolder) {
  const arg = prop[0];
  switch (arg) {
    case '--EOL':
      console.log(JSON.stringify(os.EOL));
      console.log(`\nYou are currently in ${currentFolder}`);
      break;
    case '--cpus':
      console.log(os.cpus().reduce((acc, val) => {
        acc.push({model: val.model, speed: val.speed})
        return acc
      }, []));
      console.log(`\nYou are currently in ${currentFolder}`);
      break;
    case '--homedir':
      console.log(os.homedir());
      console.log(`\nYou are currently in ${currentFolder}`);
      break;
    case '--username':
      console.log(os.userInfo().username);
      console.log(`\nYou are currently in ${currentFolder}`);
      break;
    case '--architecture':
      console.log(os.arch());
      console.log(`\nYou are currently in ${currentFolder}`);
      break;
    default:
      console.log(
        'Operation fail, Please enter valid command (e.g. --EOL, --cpus, --homedir, --username, --architecture)'
      );
  }
}
