export class VaultData {
  static readonly minimumLength = 1;
  static readonly maximumLength = 500;

  private constructor(private readonly string: string) {}

  static create(string: string) {
    if (
      string.length < VaultData.minimumLength 
      || 
      string.length > VaultData.maximumLength
    ) {
      return new Error(`Creating VaultData from string: String violates length invariants. Minimum length: ${this.minimumLength}. Maximum length: ${this.maximumLength}. Provided string's length: ${string.length}. Provided string: ${string}`);
    }
  
    return new VaultData(string);
  }
  
  toString(): string {
    return this.string;
  }

  isEqualTo(rhs: VaultData): boolean {
    return this.string === rhs.string;
  }
} 