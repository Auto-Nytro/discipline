export class VaultName {
  static readonly minimumLength = 1;
  static readonly maximumLength = 300;
  
  private constructor(private readonly string: string) {}

  static create(string: string) {
    if (
      string.length < VaultName.minimumLength 
      || 
      string.length > VaultName.maximumLength
    ) {
      return new Error(`Creating VaultName from string: String violates length invariants. Minimum length: ${this.minimumLength}. Maximum length: ${this.maximumLength}. Provided string's length: ${string.length}. Provided string: ${string}`);
    }
  
    return new VaultName(string);
  }
  
  toString(): string {
    return this.string
  }
  
  isEqualTo(rhs: VaultName): boolean {
    return this.string === rhs.string;
  }
}
