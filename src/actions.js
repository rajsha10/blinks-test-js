// *********************************************************************************
// name: solana-action-express
// author: @SolDapper
// repo: github.com/McDegens-DAO/solana-action-express
// *********************************************************************************

// *********************************************************************************
// initialize server
import { host, auto, rules } from './config.js';
import open from 'open';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { share_sol } from './actions/share_sol.js'; // Import the share_sol action

const app = express();
app.use(bodyParser.json());
app.options('*', cors({
  "methods": ["GET,PUT,POST,OPTIONS"],
  "allowedHeaders": ['Content-Type, Authorization, Content-Encoding, Accept-Encoding'],
  "preflightContinue": true,
  "optionsSuccessStatus": 204
}));
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Encoding, Accept-Encoding');
  res.setHeader('Content-Encoding', 'compress');
  res.setHeader('Content-Type', 'application/json');
  next();
});
// initialize server
// *********************************************************************************

// *********************************************************************************
// include only the share_sol action
app.use("/", share_sol); // Use the share_sol action only
// include actions
// *********************************************************************************

// *********************************************************************************
app.get("/actions.json", (req, res) => {
  res.send(JSON.stringify(rules)); // This may need to be updated if actions change
});
app.get("/", (req, res) => {
  res.send(JSON.stringify('solana-action-express server'));
});
app.listen(process.env.PORT || 3000, async () => {
  console.log("solana-action-express is running!");
  if (host.includes("localhost") && auto != false) {
    open("https://dial.to/?action=solana-action:" + host + "/" + auto);
  }
});
// *********************************************************************************
