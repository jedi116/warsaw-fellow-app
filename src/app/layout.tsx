import '@/styles/globals.css'
import '@mantine/core/styles.css'
import '@mantine/dates/styles.css'
import '@mantine/notifications/styles.css'
import type { Metadata } from 'next'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AppComponentsContextWrapper } from '@/context/AppComponentsContext'
import AppShell from '@/components/appshell'
import { MantineProvider, MantineColorSchemeScript } from '@/components/MantineProvider'
// Import the progress bar in a client component, not directly in the layout

export const metadata: Metadata = {
  title: 'Warsaw Ethiopian Fellowship',
  description: 'A welcoming community of believers gathering to worship, learn, and grow together in faith.',
  keywords: 'fellowship, church, ethiopia, christian, warsaw, community',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Use custom color scheme script that matches our provider */}
        <MantineColorSchemeScript />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body>
        <MantineProvider>
          <ToastContainer 
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
          <AppComponentsContextWrapper>
            <AppShell>{children}</AppShell>
          </AppComponentsContextWrapper>
        </MantineProvider>
      </body>
    </html>
  )
}