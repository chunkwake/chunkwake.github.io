import { appVersion, gitConfig, mcVersion } from '@/lib/shared';

export function StatusBar() {
  return (
    <div className="cw-statusbar" aria-hidden="true">
      <div className="cw-statusbar-left">
        <span className="cw-statusbar-item">
          <span className="cw-statusbar-dot" />
          chunkwake {appVersion}
        </span>
        <span className="cw-statusbar-item">MC {mcVersion}</span>
        <span className="cw-statusbar-item">{gitConfig.branch}</span>
      </div>
      <div className="cw-statusbar-right">
        <span className="cw-statusbar-item">utf-8</span>
        <span className="cw-statusbar-item">rust + jvm</span>
      </div>
    </div>
  );
}
