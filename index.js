import dotenv from "dotenv";
import fetch from "node-fetch";
import fs from "fs/promises";
dotenv.config();

async function main() {
  const REP = parseInt(process.env.REP);
  console.log(`GENERATING A LIST OF ${50 * REP} TOKENS...`);
  console.log(`STARTING AT OFFSET ${process.env.OFFSET} SORTED BY ${process.env.SORT}...`);
  let tokens = [];
  let offset = parseInt(process.env.OFFSET);
  for (let i = 0; i < REP; i++) {
    const options = { method: "GET", headers: { "x-chain": "solana", "X-API-KEY": process.env.BIRDEYE_API_KEY } };
    const response = await fetch(`https://public-api.birdeye.so/public/tokenlist?sort_by=v24hUSD&sort_type=${process.env.SORT}&offset=${offset}`, options);
    const body = await response.json();
    console.log(`FETCHED 50 TOKENS, REQUEST OFFSET: ${offset} DONE...`);
    const tokenList = body.data.tokens;
    tokens = [...tokens, ...tokenList];
    offset += 50;
  }
  console.log("DONE FETCHING TOKENS...");
  console.log("WRITING TO FILE...");
  tokens = tokens.map((token) => token.address);
  await fs.writeFile("./tokens.json", JSON.stringify(tokens, null, 2));
  console.log("WRITING TO FILE SUCCESS! CHECK tokens.json...");
}

main();
