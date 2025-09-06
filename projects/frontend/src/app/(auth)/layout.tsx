import "./theme.css";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div data-theme="auth" className="min-h-screen">{children}</div>;
}
