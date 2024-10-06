import { Router } from 'express';
import { PublicKey, SystemProgram, Connection, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';
import mcswap from 'mcswap-js';

const share_sol = Router();
const rpc = "localhost:3000/sol";
const connection = new Connection(rpc);

// Function to handle sharing a post
share_sol.post('/share-post', async (req, res) => {
  const { userAccount, postLink, postTitle, postContent } = req.body;

  if (!userAccount || !postLink || !postTitle || !postContent) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  try {
    // Create a unique link for the post
    const uniqueLink = `https://your-app.com/post/${postLink}?share=true`; // Change URL as needed

    // Track the number of visits
    let visits = 0;

    const trackVisits = (currentVisits) => {
      if (currentVisits >= 1000) {
        console.log('Link closed for further visits.');
      }
    };

    // Simulate a visit
    visits += 1;
    trackVisits(visits);

    // Redirect to Solflare wallet for transaction
    const recipient = new PublicKey("GUFxwDrsLzSQ27xxTVe4y9BARZ6cENWmjzwe8XPy7AKu");
    const lamports = amount * 1000000000;

    const from = new PublicKey(userAccount);
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: from,
        toPubkey: recipient,
        lamports: lamports,
      })
    );

    // Send the transaction
    const signature = await sendAndConfirmTransaction(connection, transaction, { from });

    res.json({
      message: 'Post shared successfully!',
      uniqueLink: uniqueLink,
      transactionSignature: signature,
    });
  } catch (error) {
    console.error('Error sharing post:', error);
    res.status(500).json({ error: 'Failed to share post.' });
  }
});

export { share_sol };
