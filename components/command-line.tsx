import { CopyButton } from './copy-button';

export function CommandLine({ command }: { command: string }) {
  return (
    <div className="cw-command">
      <span className="cw-command-prompt" aria-hidden="true">
        $
      </span>
      <code>{command}</code>
      <CopyButton text={command} label="Copy command" copiedLabel="Copied" />
    </div>
  );
}
