import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { FaCaretRight } from "react-icons/fa6";
import "./adminNavbar.css";

const AdminNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleIsOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav>
      <ul className="admin-navbar-links m-hide">
        <li className="admin-navbar-link">
          <Link
            href="/admin"
            className={`${pathname == "/admin" ? "active" : ""}`}
          >
            Dashboard
          </Link>
        </li>
        <li className="admin-navbar-link">
          <Link
            href="/admin/orders"
            className={`${pathname == "/admin/orders" ? "active" : ""}`}
          >
            Orders
          </Link>
        </li>
        <li className="admin-navbar-link">
          <Link
            href="/admin/items"
            className={`${pathname == "/admin/items" ? "active" : ""}`}
          >
            Items
          </Link>
        </li>
        <li className="admin-navbar-link">
          <Link
            href="/admin/inventory"
            className={`${pathname == "/admin/inventory" ? "active" : ""}`}
          >
            Inventory
          </Link>
        </li>
        <li className="admin-navbar-link">
          <Link
            href="/admin/additem"
            className={`${pathname == "/admin/additem" ? "active" : ""}`}
          >
            Add Item
          </Link>
        </li>
        <li className="admin-navbar-link">
          <Link
            href="/admin/sales"
            className={`${pathname == "/admin/sales" ? "active" : ""}`}
          >
            Sales
          </Link>
        </li>
        <li className="admin-navbar-link">
          <Link
            href="/admin/settings"
            className={`${pathname == "/admin/settings" ? "active" : ""}`}
          >
            Settings
          </Link>
        </li>
      </ul>
      <div className="m-show m-admin-nav-container">
        <button
          className={`m-show m-admin-nav-button ${
            isOpen && "m-admin-menu-opened"
          }`}
          onClick={toggleIsOpen}
        >
          <span className="m-admin-nav-turn">
            <FaCaretRight /> Menu
          </span>
        </button>
        {isOpen && (
          <ul className="m-admin-navbar-links m-show">
            <li className="m-admin-navbar-link">
              <Link
                className={`${pathname == "/admin" ? "active" : ""}`}
                href="/admin"
              >
                Dashboard
              </Link>
            </li>
            <li className="m-admin-navbar-link">
              <Link
                className={`${pathname == "/admin/orders" ? "active" : ""}`}
                href="/admin/orders"
              >
                Orders
              </Link>
            </li>
            <li className="m-admin-navbar-link">
              <Link
                className={`${pathname == "/admin/items" ? "active" : ""}`}
                href="/admin/items"
              >
                Items
              </Link>
            </li>
            <li className="m-admin-navbar-link">
              <Link
                className={`${pathname == "/admin/inventory" ? "active" : ""}`}
                href="/admin/inventory"
              >
                Inventory
              </Link>
            </li>
            <li className="m-admin-navbar-link">
              <Link
                className={`${pathname == "/admin/additem" ? "active" : ""}`}
                href="/admin/additem"
              >
                Add Item
              </Link>
            </li>
            <li className="m-admin-navbar-link">
              <Link
                className={`${pathname == "/admin/sales" ? "active" : ""}`}
                href="/admin/sales"
              >
                Sales
              </Link>
            </li>
            <li className="m-admin-navbar-link">
              <Link
                className={`${pathname == "/admin/settings" ? "active" : ""}`}
                href="/admin/settings"
              >
                Settings
              </Link>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default AdminNavbar;
