import { Link } from "kaioken/router"

export function Navigation() {
  return (
    <nav style={{ padding: "20px" }}>
      <div style={{ display: "flex", gap: "20px" }}>
        <Link to="/" className="nav-link">
          Home
        </Link>
        <Link to="/about" className="nav-link">
          About
        </Link>
        <Link to="/users" className="nav-link">
          Users
        </Link>
      </div>
    </nav>
  )
}
