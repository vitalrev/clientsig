const HookedWeb3Provider = require("hooked-web3-provider");
const lightwallet = require("eth-lightwallet");
require("file-loader?name=../client_sig.html!../client_sig.html");
const Web3 = require("web3");
const Promise = require("bluebird");
const truffleContract = require("truffle-contract");
const $ = require("jquery");
// Not to forget our built contract
const metaCoinJson = require("../../build/contracts/MetaCoin.json");

// Supports Mist, and other wallets that provide 'web3'.
if (typeof web3 !== 'undefined') {
    // Use the Mist/wallet/Metamask provider.
    window.web3 = new Web3(web3.currentProvider);
} else {
    // Your preferred fallback.
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545')); 
}
Promise.promisifyAll(web3.eth, { suffix: "Promise" });
const MetaCoin = truffleContract(metaCoinJson);
MetaCoin.setProvider(web3.currentProvider);

var ks; // KeyStore

/*
var app = angular.module('metaCoinApp', []);

app.config(function ($locationProvider) {
  $locationProvider.html5Mode(true);
});
*/
const refreshBalance = function() {
        return MetaCoin.deployed()
        .then(deployed => {
            return deployed.getBalance.call(window.account, {from: window.account})
        }).then(value => { 
            $("#balance").html(value.valueOf());
        }).catch(function(e) {
            $("#status").html(e.toString());
            console.error(e);
        });
    };

const sendCoin = function() {
	let deployed;
	return MetaCoin.deployed()
    .then(_deployed => {
        deployed = _deployed;
        // .sendTransaction so that we get the txHash immediately.
        return _deployed.sendCoin.sendTransaction(
            $("input[name='receiver']").val(),
            // Giving a string is fine
            $("input[name='amount']").val(),
            { from: window.account });
    })
    .then(txHash => {
        $("#status").html("Transaction on the way " + txHash);
        // Now we wait for the tx to be mined.
        const tryAgain = () => web3.eth.getTransactionReceiptPromise(txHash)
            .then(receipt => receipt !== null ?
                receipt :
                // Let's hope we don't hit the max call stack depth
                Promise.delay(500).then(tryAgain));
        return tryAgain();
    })
    .then(receipt => {
        if (receipt.logs.length == 0) {
            console.error("Empty logs");
            console.error(receipt);
            $("#status").html("There was an error in the tx execution");
        } else {
            // Format the event nicely.
            console.log(deployed.Transfer().formatter(receipt.logs[0]).args);
            $("#status").html("Transfer executed");
        }
        refreshBalance();
    })
    .catch(e => {
        $("#status").html(e.toString());
        console.error(e);
    });

}

window.onload = function() {
  $("#send").click(sendCoin);

  console.log("If you need a new key, use this one");
  console.log(lightwallet.keystore.generateRandomSeed());
  // Example of seed 'unhappy nerve cancel reject october fix vital pulse cash behind curious bicycle'
  var seed = prompt('Enter your private key seed', '12 words long');;
  // the seed is stored in memory and encrypted by this user-defined password
  var password = prompt('Enter password to encrypt the seed', 'dev_password');

  lightwallet.keystore.deriveKeyFromPassword(password, function(err, _pwDerivedKey) {
        pwDerivedKey = _pwDerivedKey;
        ks = new lightwallet.keystore(seed, pwDerivedKey);

        // Create a custom passwordProvider to prompt the user to enter their
        // password whenever the hooked web3 provider issues a sendTransaction
        // call.
        ks.passwordProvider = function (callback) {
            var pw = prompt("Please enter password to sign your transaction", "dev_password");
            callback(null, pw);
        };

        var provider = new HookedWeb3Provider({
            // Let's pick the one that came with Truffle
            host: web3.currentProvider.host,
            transaction_signer: ks
        });
        web3.setProvider(provider);
        // And since Truffle v2 uses EtherPudding v3, we also need the line:
        MetaCoin.setProvider(provider);

        // Generate the first address out of the seed
        ks.generateNewAddress(pwDerivedKey);

        accounts = ks.getAddresses();
        account = "0x" + accounts[0];
        console.log("Your account is " + account);
        refreshBalance();
    });
}


