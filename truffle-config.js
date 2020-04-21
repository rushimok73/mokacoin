// Tells us how to connect to the local Blockchain

module.exports={
  networks: {
    development: {
      host: "127.0.0.1",
      port: "7545",
      network_id: "*"  //match any netword id
    }
  }
}
