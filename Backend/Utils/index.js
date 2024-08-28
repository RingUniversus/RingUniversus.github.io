const ethers = require("ethers");
const ABI = require("./abi.json");

const getRandomNumber = (min, max) => {
  return Math.round(Math.random() * (max - min) + min);
};

async function main() {
  // const ethersProvider = new ethers.WebSocketProvider(
  //   `wss://opbnb-testnet-rpc.bnbchain.org/`,
  //   undefined,
  //   { polling: true }
  // );
  const ethersProvider = new ethers.JsonRpcProvider(
    `https://opbnb-testnet-rpc.bnbchain.org/`,
    undefined,
    { polling: true }
  );

  const wallet = new ethers.Wallet(
    "0x432c51999cec3c07aa5f5c785177ac8f95b1432704072ef79ce47491a16f9c44",
    ethersProvider
  );
  console.log(wallet);
  // wallet.connect(ethersProvider)
  // The Contract object
  const contract = new ethers.Contract(
    "0x153968CC8ebd22fA4A04018E1Bf79F23947A7004",
    ABI,
    wallet
  );

  contract.on("TestEvent", async (timestamp) => {
    console.log(timestamp);
    console.log(await contract.listenerCount());
    console.log(await contract.listeners());
  });
  contract.on(
    "MoveStopped",
    async (player, startCoords, endCoords, timestamp, claimable) => {
      console.log("Start generate random number");
      console.log(player, startCoords, endCoords, timestamp, claimable);
      try {
        await contract.testFillRandomWords(player, getRandomNumber(1, 1000), [
          getRandomNumber(10000, 20000),
          getRandomNumber(10000, 20000),
          getRandomNumber(10000, 20000),
          getRandomNumber(10000, 20000),
          getRandomNumber(10000, 20000),
          getRandomNumber(10000, 20000),
        ]);
      } catch (e) {
        console.log(" > Error: ", e);
      }
      console.log("Generate finished!");
      console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    }
  );

  // setInterval(async () => {
  //   console.log("Call function");
  //   const tx = await contract.testEventEmit();
  //   await tx.wait();

  //   console.log(tx);
  // }, 10000);
}

main();
