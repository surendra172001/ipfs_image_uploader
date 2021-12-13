import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";
import ipfs from "./ipfs";

import "./App.css";

class App extends Component {
  state = {
    buffer: null,
    ipfsHash: "",
    web3: null,
    accounts: null,
    contract: null,
  };

  constructor(props) {
    super(props);
    this.captureFile = this.captureFile.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address
      );
      // Set web3, accounts, and contract to the state, and then proceed with an
      this.setState({ web3, accounts, contract: instance });
      // example of interacting with the contract's methods.
      const ipfsHash = await this.state.contract.methods.get().call();
      this.setState({ ipfsHash });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  async onSubmit(event) {
    event.preventDefault();
    try {
      const { path: ipfsHash } = await ipfs.add(this.state.buffer);
      const { accounts, contract } = this.state;
      await contract.methods.set(ipfsHash).send({ from: accounts[0] });
      this.setState({ ipfsHash: ipfsHash });
      // console.log(this.state.ipfsHash);
    } catch (error) {
      console.log(error);
    }
  }

  captureFile(event) {
    console.log("Capture file...");
    event.preventDefault();
    const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) });
      console.log("BUFFER", this.state.buffer);
    };
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    return (
      <div className="App">
        <h1>IPFS File System</h1>
        <h2>You Image</h2>
        <div>
          <img
            src={`https://ipfs.io/ipfs/${this.state.ipfsHash}`}
            style={{ height: 500, width: 500 }}
          />
        </div>

        <form onSubmit={this.onSubmit}>
          <input type="file" onChange={this.captureFile} />
          <input type="submit" />
        </form>
      </div>
    );
  }
}

export default App;
