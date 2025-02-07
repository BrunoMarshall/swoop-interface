const { Harmony } = require('@harmony-js/core');
const { ChainID, ChainType } = require('@harmony-js/utils');

const GAS_LIMIT = 6721900;
const GAS_PRICE = 1000000000;

export class Hmy {
  client: typeof Harmony;
  network: string;
  url!: string;
  explorerUrl!: string;
  chainType: typeof ChainType;
  chainId: typeof ChainID;
  gasPrice: number;
  gasLimit: number;

  constructor(network: string, gasLimit: number = GAS_LIMIT, gasPrice: number = GAS_PRICE) {
    this.network = network.toLowerCase();
    this.gasLimit = gasLimit;
    this.gasPrice = gasPrice;
    this.setClient(this.network);
  }

  private setClient(network: string) {
    switch (this.network) {
      case 'testnet':
        console.log('Using the testnet network...\n');
        this.url = "https://api.s0.b.hmny.io";
        this.explorerUrl = "https://explorer.pops.one/#";
        this.chainType = ChainType.Harmony;
        this.chainId = ChainID.HmyTestnet;
        break;
      
      case 'mainnet':
        console.log('Using the mainnet network...\n');
        this.url = "https://api.s0.t.hmny.io";
        this.explorerUrl = "https://explorer.harmony.one/#";
        this.chainType = ChainType.Harmony;
        this.chainId = ChainID.HmyMainnet;
        break;
      
      default:
        console.log('Please enter a valid network - testnet or mainnet.');
        throw new Error('NetworkRequired');
    }

    this.client = new Harmony(
      this.url,
      {
        chainType: this.chainType,
        chainId: this.chainId,
      }
    );
  }

  public gasOptions(): any {
    return {
      gasPrice: this.gasPrice,
      gasLimit: this.gasLimit,
    }
  }

  public getBech32Address(address: string): string {
    return this.client.crypto.getAddress(address).bech32;
  }

  public getBase16Address(address: string): string {
    return this.client.crypto.fromBech32(address);
  }

  public getBalance(address: string) {
    return this.client.blockchain.getBalance({ address });
  }

  public async getBlockNumber() {
    let res = await this.client.blockchain.getBlockNumber();
    let currentBlockHex = res && res.result;
    let currentBlockNumber = this.client.utils.hexToNumber(currentBlockHex);
    return currentBlockNumber;
  }
}
