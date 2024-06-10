export const timer = async (delayInSeconds = 5) => {
  const delay = () =>
    new Promise((resolve) => setTimeout(resolve, delayInSeconds * 1000));
  console.log(`Starting timer for ${delayInSeconds} seconds...`);
  await delay();
  console.log("Timer completed.");
};
