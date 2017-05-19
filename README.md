# clientsig
Ethereum projects

After clone/download from this code, install pakages:  

    npm install web3 truffle-contract bluebird jquery --save
    npm install webpack --save-dev
    npm install file-loader --save-dev
    npm install hooked-web3-provider
    npm install eth-lightwallet

Run testrpc in other terminal tab/window:  
```testrpc```  
  
Deploy smart contract into testrpc:  
```truffle migrate --reset```  
  
Build WebApp:  
```truffle build```
  
Run PHP http server:  
```php -S 0.0.0.0:8000 -t ./build/app```
  
Web Site index.html works with testrpc accounts and running with accounts[0] as user account:  
```localhost:8000/index.html```  
  
Web Site client_sig.html creates bei load a new account with private key seed and password (ask with prompt). Attention, the new account doesn't have ether or meta coins!  
```localhost:8000/client_sig.html```   
You can transfer ether from other account (on index.html) to the new account address (see JS console on client_sig.html) 