export default function Footer() {
  return (
    <footer
      className="text-center py-4 shadow-inner"
      style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}
    >
      <p className="text-sm">© {new Date().getFullYear()} YouTube. All rights reserved.</p>
    </footer>
  )
}
