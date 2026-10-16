import Link from 'next/link'

const links = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/defects', label: 'List Defect' },
  { href: '/master/pics', label: 'Master PIC' },
]

export function NavLinks() {
  return (
    <nav className="space-y-2 text-sm font-medium">
      {links.map((link) => (
        <Link key={link.href} className="block rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100" href={link.href}>
          {link.label}
        </Link>
      ))}
    </nav>
  )
}
