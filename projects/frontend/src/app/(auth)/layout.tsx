import "./theme.css";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div data-theme="auth">{children}</div>;
}

