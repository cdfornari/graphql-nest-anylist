import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CryptService {
  /**
   * @param input value to hash
   * @param salt number of salt rounds for hashing
   */
  hash(input: string, salt: number = 10): string {
    return bcrypt.hashSync(input, salt);
  }

  /**
   * @param input value to compare
   * @param hash hash to compare with
   */
  compare(input: string, hash: string): boolean {
    return bcrypt.compareSync(input, hash);
  }
}
