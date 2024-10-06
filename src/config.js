'use strict';
import 'dotenv/config'

// *********************************************************************************
// server settings
var host = "switch_social.vercel.app";
host = "http://localhost";
var auto = "mcswap";
// *********************************************************************************

// *********************************************************************************
// no edit
if (host.includes("localhost")) { host = host + ":3000"; }
// *********************************************************************************

// *********************************************************************************
// localhost dev actions.json rules 
var rules = {
  "rules": [
    { "pathPattern": "/share-config", "apiPath": host + "/share-config" }, 
  ]
};
// *********************************************************************************

// *********************************************************************************
var rpc_file = "rpcs/rpcs.json";
var rpc_id = 0;
var rpc;
import fs from 'fs';
if (process.env.RPC) {
  rpc = process.env.RPC;
} else {
  var rpcs = JSON.parse(fs.readFileSync(rpc_file).toString());
  rpc = rpcs[rpc_id].url;
}
export var host, auto, rpc, rules;
// *********************************************************************************
