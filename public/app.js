App = {
  web3Provider: null,
  contracts: {},
  account: 0x0,
  loading: false,
  tokenPrice: 10,
  tokensAvailable: 750000,

  init: function() {
    console.log('app initialize');
    return App.initweb3();
  },

  initweb3: function() {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // If no injected web3 instance is detected, fallback to Ganache.
      App.web3Provider = new web3.providers.HttpProvider('http://127.0.0.1:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContracts();
  },

  initContracts: function() {
    $.getJSON("/contracts/MokaTokenSale.json", function(mokaTokenSale) {
      App.contracts.MokaTokenSale = TruffleContract(mokaTokenSale);
      App.contracts.MokaTokenSale.setProvider(App.web3Provider);
      App.contracts.MokaTokenSale.deployed().then(function(mokaTokenSale) {
        console.log("Moka Token Sale Address:", mokaTokenSale.address);
      });
    }).done(function() {
      $.getJSON("/contracts/MokaToken.json", function(mokaToken) {
        App.contracts.MokaToken = TruffleContract(mokaToken);
        App.contracts.MokaToken.setProvider(App.web3Provider);
        App.contracts.MokaToken.deployed().then(function(mokaToken) {
          console.log("Moka Token Address:", mokaToken.address);
        });
      })
    }).done(function(){
      App.listenForEvents();
      return App.render();
    })

  },

  // Listen for events emitted from the contract
    listenForEvents: function() {
      App.contracts.MokaTokenSale.deployed().then(function(instance) {
        instance.Sell({}, {
          fromBlock: 0,
          toBlock: 'latest',
        }).watch(function(error, event) {
          console.log("event triggered", event);
          App.render();
        })
      })
    },

  render: function() {
    if (App.loading) {
      return;
    }
    App.loading = true;

    var loader = $('#loader');
    var content = $('#content');

    loader.show();
    content.hide();
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $('#accountAddress').html("Your Account: " + account);
      }
    });


    App.contracts.MokaTokenSale.deployed().then(function(instance) {
      tokenSaleInstance = instance;
      return tokenSaleInstance.tokenPrice();
    }).then(function(tokenPrice){
      App.tokenPrice = tokenPrice;
      console.log(App.tokenPrice.toNumber());
      $('.token-price').html(web3.fromWei(App.tokenPrice , "ether").toNumber());
      return tokenSaleInstance.tokensSold();
    }).then(function(tokensSold) {
      App.tokensSold = tokensSold.toNumber();
      $('.tokens-sold').html(App.tokensSold);
      $('.tokens-available').html(App.tokensAvailable);

      var progressPercent = (Math.ceil(App.tokensSold) / App.tokensAvailable) * 100;
      $('#progress').css('width', progressPercent + '%');

      App.contracts.MokaToken.deployed().then(function(instance) {
        tokenInstance = instance;
        return tokenInstance.balanceOf(App.account);
      }).then(function(balance) {
        $('.dapp-balance').html(balance.toNumber());
        App.loading = false;
        loader.hide();
        content.show();
      })
    })
  },

  buyTokens: function(){
    $('#content').hide();
    $('#loader').show();
    var numberOfTokens = $('#numberOfTokens').val();
    App.contracts.MokaTokenSale.deployed().then(function(instance) {
      return instance.buyTokens(numberOfTokens, {
        from: App.account,
        value: numberOfTokens * App.tokenPrice,
        gas: 500000 // Gas limit
      });
    })
  }
}

$(function() {
  $(window).on('load', function() {
    App.init();
  })
});
