import { Injectable } from "@nestjs/common";
import IEncryption from "../../interfaces/cript.interface";
import * as bcrypt from 'bcryptjs';

@Injectable()
export class CryptInfraService implements IEncryption {
  hash(password: string, saltRounds: number): Promise<string> {
    return bcrypt.hash(password, saltRounds);
  }

  compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}   