interface NavbarProps {
  title: string
}

export function Navbar({ title }: NavbarProps) {
  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center px-6">
      <h2 className="text-base font-semibold text-gray-800">{title}</h2>
    </header>
  )
}