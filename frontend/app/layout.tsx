import './globals.css'

export const metadata = {
  title: 'FeedPulse',
  description: ' AI-Powered Product Feedback Platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
