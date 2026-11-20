"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="en-IN">
      <body style={{ fontFamily: "system-ui, sans-serif", display: "grid", placeItems: "center", minHeight: "100dvh", margin: 0, background: "#07080a", color: "#f3f4f6" }}>
        <main style={{ textAlign: "center", padding: 24 }}>
          <h1 style={{ fontWeight: 500 }}>Something went wrong.</h1>
          <button onClick={reset} style={{ marginTop: 16, padding: "10px 20px", borderRadius: 999, border: 0, background: "#f3f4f6", color: "#07080a", cursor: "pointer" }}>
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
