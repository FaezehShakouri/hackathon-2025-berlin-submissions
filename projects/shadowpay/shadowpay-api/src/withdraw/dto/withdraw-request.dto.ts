import { IsString, IsNotEmpty, IsNumberString } from 'class-validator';

export class WithdrawRequestDto {
  @IsString()
  @IsNotEmpty()
  recipient: string;

  @IsNumberString()
  @IsNotEmpty()
  amount: string;
} 