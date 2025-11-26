export const metadata = {
    title: 'Auth App',
    description: 'Authentication with Google and Email',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    )
}
