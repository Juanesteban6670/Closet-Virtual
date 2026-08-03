import { Link } from 'react-router-dom'

export function LoginPage() {
  return <AuthPlaceholder title="Welcome back" alternate="Need an account?" link="/register" label="Register" />
}

function AuthPlaceholder({ title, alternate, link, label }: { title: string; alternate: string; link: string; label: string }) {
  return <main className="auth-page"><section className="auth-card"><h1>{title}</h1><p>Authentication will be available soon.</p><Link to={link}>{alternate} {label}</Link></section></main>
}
