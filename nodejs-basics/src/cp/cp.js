import { fork } from 'child_process';

const spawnChildProcess = async (args) => {
    const child = fork('script.js', args, {cwd: './files', silent: true})

    process.stdin.pipe(child.stdin)

    child.stdout.pipe(process.stdout);
};

spawnChildProcess(['Freddie','John', 'Keith']);