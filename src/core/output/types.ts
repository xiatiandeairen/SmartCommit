export interface OutputHandler {
  output(message: string): void | Promise<void>;
}
