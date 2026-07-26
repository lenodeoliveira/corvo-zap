interface IContentEncryption {
    encryptContent(content: string): string;
    decryptContent(encryptedContent: string): string;
  }
  
  export default IContentEncryption;
  