import { Routes, Route, Navigate } from 'react-router-dom';
import EmployeeList from './components/Employees/EmployeeList';
import EmployeeForm from './components/Employees/EmployeeForm';
import AuditLog from './components/AuditLog';
import { Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ServicesList from './components/Services/ServicesList';
import ProductList from './components/Products/ProductList';
import ProductForm from './components/Products/ProductForm';
import ServicesForm from './components/Services/ServicesForm';
import 'react-bootstrap-toggle/dist/bootstrap2-toggle.css'
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
            <a className="navbar-brand border-end fw-bolder" style={{
              color: 'orange'
            }} href='/'>Employee Audit &nbsp;</a>
            <button className="navbar-toggler bg-success" type="button" data-bs-toggle="collapse" data-bs-target=".navbar-collapse" aria-controls="navbarSupportedContent"
              aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="navbar-collapse collapse d-sm-inline-flex justify-content-between">
              <ul className="navbar-nav flex-grow-1 fw-bolder">
                <li className="nav-item">
                  <Link className="nav-link text-light" to={'/'}>Employees</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-light" to={'/services'}>Services</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-light" to={'/products'}>Products</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-success " to={'/audit'}>Audit Log</Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      </header>
      {/* Main content */}
      <div className="container">
        {/* Route to EmployeeList component */}
        <Routes>
          <Route
            path="/"
            element={
              <EmployeeList />
            }
          />
          {/* Route to EmployeeForm component for editing */}
          <Route
            path="/edit/:id"
            element={
              <EmployeeForm />
            }
          />
          {/* Route to EmployeeForm component for adding */}
          <Route
            path="/add"
            element={
              <EmployeeForm />
            }
          />

            <Route
              path="/services"
              element={
                <ServicesList />
              }
            />
            {/* Route to EmployeeForm component for editing */}
            <Route
              path="/service/edit/:id"
              element={
                <ServicesForm />
              }
            />
            {/* Route to EmployeeForm component for adding */}
            <Route
              path="/service/add"
              element={
                <ServicesForm />
              }
            />

              <Route
                path="/products"
                element={
                  <ProductList />
                }
              />
              {/* Route to EmployeeForm component for editing */}
              <Route
                path="/product/edit/:id"
                element={
                  <ProductForm />
                }
              />
              {/* Route to EmployeeForm component for adding */}
              <Route
                path="/product/add"
                element={
                  <ProductForm />
                }
              />
          {/* Route to AuditLog component */}
          <Route
            path="/audit"
            element={
              <AuditLog />
            }
          />
          {/* Default route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      {/* Footer */}
      <footer className="border-top footer text-muted">
        <div className="container">
          &copy; 2023 - P99soft
        </div>
      </footer>
    </>
  );
}

export default App;