import { env } from 'node:process';

env.RSS_name1 = 'value1';
env.RSS_name2 = 'value2';

const parseEnv = () => {
  const array = Object.keys(env)
    .filter((key) => key.startsWith('RSS_'))
    .map((val) => `${val}=${env[val]}`);

  console.log(array.join('; '));
};

parseEnv();
