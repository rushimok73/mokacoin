App = {
  web3Provider: null,
  contracts: {},
  account: 0x0,
  loading: false

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
    })
    return App.render();
  },

  render: function() {
    if(App.loading){
      return;
    }
    App.loading = true;

    var loader  = $('#loader');
    var content = $('#content');

    loader.show();
    content.hide();
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $('#accountAddress').html("Your Account: " + account);
      }
    });
  }
}

$(function() {
  $(window).on('load', function() {
    App.init();
  })
});
