export type ModelType = 'local' | 'remote';
export type CommitStyle = 'conventional' | 'custom';
export type OutputType = 'stdout' | 'clipboard' | 'auto';

export interface CommitgenConfig {
  model?: ModelType;
  style?: CommitStyle;
  output?: OutputType;
  verbose?: boolean;
  remote?: {
    baseUrl?: string;
    apiKey?: string;
  };
}

export const DEFAULT_CONFIG: Required<Omit<CommitgenConfig, 'remote'>> & {
  remote?: CommitgenConfig['remote'];
} = {
  model: 'local',
  style: 'conventional',
  output: 'stdout',
  verbose: false,
};
