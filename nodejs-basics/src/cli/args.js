const parseArgs = () => {
  const args = process.argv.reduce((acc, val, idx, arr) => {
    if (val.startsWith('--')) {
      acc = acc.concat(`${val} is ${arr[idx + 1]}`);
    }
    return acc;
  }, []);
  console.log(args.join(', '));
};

parseArgs();