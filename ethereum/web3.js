import Web3 from "web3";

let web3;

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  // Aqui nós definimos quando está no navegador e o metamask está rodando.
  window.ethereum.request({ method: "eth_requestAccounts" });
  web3 = new Web3(window.ethereum);
} else {
  // Nós estamos no servidor ou o usuário não tem metamask.
  const provider = new Web3.providers.HttpProvider(
    "https://rinkeby.infura.io/v3/b6d82d0e191e41c992e81d4218212a3e"
  );
  web3 = new Web3(provider);
}

export default web3;