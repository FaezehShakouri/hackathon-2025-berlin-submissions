import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';

@Injectable()
export class WithdrawService {
  private readonly logger = new Logger(WithdrawService.name);
  private readonly provider: ethers.JsonRpcProvider;
  private readonly wallet: ethers.Wallet;
  private readonly contract: ethers.Contract;

  constructor(private readonly configService: ConfigService) {
    const rpcUrl = this.configService.get<string>('RPC_URL');
    const privateKey = this.configService.get<string>('PRIVATE_KEY');
    const contractAddress = this.configService.get<string>('CONTRACT_ADDRESS');

    if (!rpcUrl || !privateKey || !contractAddress) {
      throw new Error('Missing required environment variables: RPC_URL, PRIVATE_KEY, CONTRACT_ADDRESS');
    }

    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.wallet = new ethers.Wallet(privateKey, this.provider);
    
    const contractAbi = [
      'function withdraw(address recipient, uint256 amount) external',
      'event WithdrawProcessed(address indexed recipient, uint256 amount)'
    ];

    this.contract = new ethers.Contract(contractAddress, contractAbi, this.wallet);

    this.logger.log(`Withdraw service initialized. Wallet address: ${this.wallet.address}`);
  }

  async withdraw(recipient: string, amount: string): Promise<string> {
    this.logger.log(`Attempting to withdraw ${amount} to ${recipient}`);
    
    try {
      const amountInSmallestUnit = ethers.parseUnits(amount, 6);

      const tx = await this.contract.withdraw(recipient, amountInSmallestUnit);
      this.logger.log(`Withdrawal transaction sent. Hash: ${tx.hash}`);
      
      await tx.wait();
      this.logger.log(`Withdrawal transaction confirmed. Hash: ${tx.hash}`);

      return tx.hash;
    } catch (error) {
      this.logger.error('Error during withdrawal:', error);
      throw new Error(`Withdrawal failed: ${error.message}`);
    }
  }
} 