import React, { Component } from "react";
import MultipleStorageContract from "./contracts/MultipleStorage.json";
import getWeb3 from "./getWeb3";
import ipfs from "./ipfs";
import Header from "./components/Header";
import Footer from "./components/Footer";
import AddImage from "./components/AddImage";

class App extends Component {
  state = {
    buffer: null,
    ipfsHashes: [],
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

      console.log(accounts);

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = MultipleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        MultipleStorageContract.abi,
        deployedNetwork && deployedNetwork.address
      );
      // Set web3, accounts, and contract to the state, and then proceed with an
      this.setState({ web3, accounts, contract: instance });
      // example of interacting with the contract's methods.
      const stringHashes = await this.state.contract.methods.get().call();
      if (stringHashes.length) {
        const ipfsHashes = stringHashes.split(",");
        this.setState({ ipfsHashes });
      }
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
      // console.log(ipfsHash);
      const { accounts, contract } = this.state;
      await contract.methods.add(ipfsHash).send({ from: accounts[0] });

      const newHashesArray = [...this.state.ipfsHashes, ipfsHash];
      this.setState({ ipfsHashes: newHashesArray });
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

  renderImage(imageHash) {
    return (
      <img
        key={imageHash}
        src={`https://ipfs.io/ipfs/${imageHash}`}
        style={{ height: 300, width: 300 }}
      />
    );
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }

    return (
      <div className="d-flex align-items-center justify-content-center flex-column">
        <Header />
        <h1 className="text-center">IPFS Image Uploader</h1>
        <AddImage captureFile={this.captureFile} onSubmit={this.onSubmit} />

        <div className="border border-danger border-5 my-5 p-5 w-50 rounded">
          <div className="container d-flex flex-column align-items-center">
            <pre>
              {this.state.ipfsHashes.length === 0 && "No Images Uploaded yet"}
            </pre>
            {this.state.ipfsHashes &&
              this.state.ipfsHashes.map((hash) => this.renderImage(hash))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
