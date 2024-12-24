'use client'
 
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body className="min-h-screen">
        <h2>Algo salio mal!</h2>
        <button onClick={() => reset()}>Try again</button>
      </body>
    </html>
  )
}