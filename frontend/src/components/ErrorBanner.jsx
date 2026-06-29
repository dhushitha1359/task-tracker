export default function ErrorBanner({ error, onDismiss }) {
  if (!error) return null

  return (
    <div className="error-banner">
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <strong>{error.message}</strong>
        <button className="secondary" onClick={onDismiss} style={{ padding: '2px 8px' }}>
          ✕
        </button>
      </div>
      {error.details && error.details.length > 0 && (
        <ul>
          {error.details.map((d, i) => (
            <li key={i}>{d}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
