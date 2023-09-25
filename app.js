const express = require('express');
const Web3 = require('web3');
const ejs = require('ejs'); // Require EJS
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Specify the views directory
app.set('views', path.join(__dirname, 'public'));

// Ethereum node URL (Infura)
const ethereumUrl =
  'https://mainnet.infura.io/v3/8a92efa87d8e47f98ed7a6bed564c764';

// Initialize Web3 with the provider
const web3 = new Web3(new Web3.providers.HttpProvider(ethereumUrl));

// Serve static files (HTML, CSS, JavaScript)
app.use(express.static('public'));

// Define a route handler for the root path
app.get('/', (req, res) => {
  res.render('index', { transactions: [] }); // Render the index.ejs template
});

// Parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define a route for handling form submissions
app.post('/search', (req, res) => {
  const walletAddress = req.body.wallet_address;
  const startBlock = parseInt(req.body.start_block);

  // Call the fetchTransactions function to get transaction data
  const transactions = fetchTransactions(walletAddress, startBlock);

  // Render the index.ejs template with the transaction data
  res.render('index', { transactions });
});

// Define the fetchTransactions function
function fetchTransactions(walletAddress, startBlock) {
  const transactions = [];
  const currentBlock = web3.eth.getBlockNumber();
  for (
    let blockNumber = startBlock;
    blockNumber <= currentBlock;
    blockNumber++
  ) {
    const block = web3.eth.getBlock(blockNumber, true);
    if (block && block.transactions) {
      block.transactions.forEach((tx) => {
        if (tx.to && tx.to.toLowerCase() === walletAddress.toLowerCase()) {
          transactions.push(tx);
        }
      });
    }
  }
  return transactions;
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
