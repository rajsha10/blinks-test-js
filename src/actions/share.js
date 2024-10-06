'use strict';
// *********************************************************************************
// sol social media link sharing action
import { rpc, host } from '../config.js';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import mcswap from 'mcswap-js';
import Express from 'express';
var share_sol = Express.Router();
// *********************************************************************************

// *********************************************************************************
// Social media link sharing config
share_sol.get('/share-post-config', (req, res) => {
  let obj = {};
  obj.icon = "https://yourapp.com/images/social-icon.png"; // Change to your app icon
  obj.title = "Share your Social Media Post";
  obj.description = "Enter SOL amount and share your post.";
  obj.label = "share";
  obj.links = {
    actions: [
      {
        label: "Send",
        href: host + "/share-post-build?amount={amount}&postId={postId}",
        parameters: [
          {
            name: "amount",
            label: "SOL Amount",
          },
          {
            name: "postId",
            label: "Post ID",
          }
        ]
      }
    ]
  };
  res.json(obj);
});
// *********************************************************************************

// *********************************************************************************
// Social media link sharing tx
share_sol.route('/share-post-build').post(async function (req, res) {
  let err = {};

  if (typeof req.body.account == "undefined") {
    req.body.account = "7Z3LJB2rxV4LiRBwgwTcufAWxnFTVJpcoCMiCo8Z5Ere"; // default test account
  }
  if (typeof req.query.amount == "undefined" || req.query.amount == "<amount>" || isNaN(req.query.amount)) {
    req.query.amount = 0;
  }
  if (typeof req.query.postId == "undefined") {
    err.message = "Post ID is required";
    return res.status(400).json(err);
  }

  console.log("req.body.account", req.body.account);
  console.log("req.query.amount", req.query.amount);
  console.log("req.query.postId", req.query.postId);

  // Create instructions
  let lamports = req.query.amount * 1000000000;
  let from = new PublicKey(req.body.account);
  let to = new PublicKey("GUFxwDrsLzSQ27xxTVe4y9BARZ6cENWmjzwe8XPy7AKu");
  let shareIx = SystemProgram.transfer({
    fromPubkey: from,
    lamports: lamports,
    toPubkey: to
  });

  let _tx_ = {};
  _tx_.rpc = rpc;
  _tx_.account = req.body.account;
  _tx_.instructions = [shareIx]; 
  _tx_.signers = false; 
  _tx_.serialize = true;
  _tx_.encode = true;
  _tx_.metadata = {
    postId: req.query.postId,
    visitsLimit: 1000 
  };
  _tx_.table = false;
  _tx_.tolerance = 2;
  _tx_.compute = false;
  _tx_.fees = false;
  _tx_.priority = req.query.priority || "Medium";

  // Send transaction
  try {
    let tx = await mcswap.tx(_tx_);
    res.json({
      tx,
      link: `${host}/visit-post/${tx.id}`,
      postId: req.query.postId,
      visitsRemaining: 1000
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    err.message = "Failed to create Solana transaction for sharing post.";
    res.status(500).json(err);
  }
});
export { share_sol };
// *********************************************************************************

// *********************************************************************************
// Endpoint for tracking post visits and closing the link
share_sol.get('/visit-post/:id', async (req, res) => {
  try {
    const txId = req.params.id;

    // Fetch transaction details (assuming there's a function to track transactions)
    const txDetails = await mcswap.getTransaction(txId);

    // Check if visit limit reached
    if (txDetails.visitsRemaining <= 0) {
      return res.status(403).json({ message: "Link has reached its visit limit." });
    }

    // Decrement visitsRemaining
    txDetails.visitsRemaining--;

    // Redirect to your app or post page
    return res.redirect(`https://yourapp.com/post/${txDetails.postId}`);
  } catch (error) {
    console.error("Error fetching transaction:", error);
    res.status(500).json({ message: "Failed to visit post." });
  }
});
// *********************************************************************************
