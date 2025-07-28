import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar navbar-expand-sm bg-light">
      <div className="container-fluid">
        <h1 className="display-5">Friends manager</h1>
      </div>
      <div className="container-fluid justify-content-end">
        <ul className="navbar-nav">
          <li className="nav-item">
            <Link className="nav-link btn btn-dark" to="/friends">
              Manage your friends!
            </Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link btn btn-dark" to="/categories">
              Friends' categories
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
