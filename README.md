# commitgen

Auto-generate Conventional Commit messages from staged Git changes.

## Usage

```bash
# Generate commit message (requires staged changes)
npx commitgen generate

# Copy to clipboard
npx commitgen generate --copy

# Use remote model
npx commitgen generate --model remote

# Verbose logging
npx commitgen generate --verbose
```

## Options

- `--model, -m` - `local` (default) or `remote`
- `--style, -s` - `conventional` (default) or `custom`
- `--copy, -c` - Copy generated message to clipboard
- `--verbose, -v` - Enable debug logging

## Config

Create `.commitgenrc.json` in project root:

```json
{
  "model": "local",
  "style": "conventional",
  "output": "stdout",
  "remote": {
    "baseUrl": "https://api.example.com"
  }
}
```

For remote API, set `COMMITGEN_API_URL` and `COMMITGEN_API_KEY` env vars, or use config above.

Or add `commitgen` field to `package.json`.

## Development

```bash
npm install
npm run build
npm test
```
