interface IEncryption {
  hash(password: string, saltRounds: number): Promise<string>;
  compare(password: string, hash: string): Promise<boolean>;
}

export default IEncryption;
