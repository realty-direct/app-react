export default function MinimalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div>{children}</div>; // Renders children with no header or sidebar
}
