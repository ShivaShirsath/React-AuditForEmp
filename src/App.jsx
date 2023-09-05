import { Routes, Route, Navigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import ItemList from "./components/ItemList";
import AuditLog from "./components/AuditLog";
import "react-bootstrap-toggle/dist/bootstrap2-toggle.css";
import Employee from "./components/Forms/Employee";
import Service from "./components/Forms/Service";
import Product from "./components/Forms/Product";
/*
 * Main application component.
 * Handles routing and navigation.
 */
function App() {
  return (
    <>
      {/* Global toast notifications */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={2}
        toastOptions={{
          icon: "✅",
          style: {
            borderRadius: "1.5dvmin",
            background: "hsla(0, 0%, 0%, 0.5)",
            backdropFilter: "blur(.25dvmin)",
            color: "#fff",
          },
        }}
      />
      {/* Header */}
      <header>
        <nav className="navbar navbar-expand-sm navbar-toggleable-sm navbar-dark border-bottom box-shadow mb-3 text-white">
          <div className="container">
            <a
              className="navbar-brand border-end fw-bolder"
              style={{
                color: "orange",
              }}
              href="/"
            >
              Employee Audit &nbsp;
            </a>
            <button
              className="navbar-toggler bg-success"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target=".navbar-collapse"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="navbar-collapse collapse d-sm-inline-flex justify-content-between">
              <ul className="navbar-nav flex-grow-1 fw-bolder">
                <li className="nav-item">
                  <Link className="nav-link text-light" to={"/emp"}>
                    Employees
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-light" to={"/service"}>
                    Services
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-light" to={"/product"}>
                    Products
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-success " to={"/audit"}>
                    Audit Log
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
      {/* Main content */}
      <div className="container">
        <Routes>
          {/* Route to EmployeeList component */}
          <Route
            path="/emp"
            element={<ItemList name="Employee" path="emp" />}
          />
          {/* Route to EmployeeForm component for editing */}
          <Route path="/emp/edit/:id" element={<Employee />} />
          {/* Route to EmployeeForm component for adding */}
          <Route path="/emp/add" element={<Employee />} />

          {/* Route to ServiceList component */}
          <Route
            path="/service"
            element={<ItemList name="Service" path="service" />}
          />
          {/* Route to ServiceForm component for editing */}
          <Route path="/service/edit/:id" element={<Service />} />
          {/* Route to ServiceForm component for adding */}
          <Route path="/service/add" element={<Service />} />

          {/* Route to ProductList component */}
          <Route
            path="/product"
            element={<ItemList name="Product" path="product" />}
          />
          {/* Route to ProductForm component for editing */}
          <Route path="/product/edit/:id" element={<Product />} />
          {/* Route to ProductForm component for adding */}
          <Route path="/product/add" element={<Product />} />
          
          {/* Route to AuditLog component */}
          <Route path="/audit" element={<AuditLog />} />
          {/* Default route */}
          <Route path="*" element={<Navigate to="/emp" />} />
        </Routes>
      </div>
      {/* Footer */}
      <footer className="border-top footer text-muted">
        <div className="container">&copy; 2023 - P99soft</div>
      </footer>
    </>
  );
}

export default App;
