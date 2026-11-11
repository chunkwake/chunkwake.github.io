export default function RootPage() {
  return (
    <>
      <meta httpEquiv="refresh" content="0; url=/ru/" />
      <div className="cw-404">
        <span className="cw-404-code">chunkwake</span>
        <h1>Загрузка</h1>
        <p>
          Если перенаправление не сработало, откройте <a href="/ru/">русскую</a> или{' '}
          <a href="/en/">английскую</a> версию.
        </p>
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html: "location.replace('/ru/' + location.hash)",
        }}
      />
    </>
  );
}
