import React, { useState, useEffect } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import api from "../utils/api";
import $ from "jquery";
import "jquery-validation";
import "jquery-validation-unobtrusive";
import { toast } from "react-hot-toast";
import { Loader } from "../assets/Loader";

const EmployeeForm = () => {
  const { id } = useParams();
  const isEdit = id !== undefined;
  const [isDone, setIsDone] = useState(null);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [employee, setEmployee] = useState({
    name: "",
    phone: "",
    address: {
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  });
  const [Xemployee, setXEmployee] = useState({
    name: "",
    phone: "",
    address: {
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  });

  useEffect(() => {
    async function fetchEmployee() {
      try {
        const response = await api.get(`/emp/${id}`);
        setXEmployee(response.data);
        setEmployee(response.data);
      } catch (error) {
        toast.error(`Employee not Found !`);
        setIsDone(true);
      }
    }
    if (isEdit) {
      fetchEmployee();
    }
  }, [id, isEdit]);

  useEffect(() => {
    async function fetchCountries() {
      try {
        const response = await api.get("/emp/contries");
        setCountries(response.data);
      } catch (error) {
        console.error("Error fetching countries:", error);
        toast.error("Error fetching countries");
      }
    }
    fetchCountries();
    if (isEdit) {
      fetchStates(Xemployee.address.country);
      fetchCities(Xemployee.address.state);
    }
    $("#employeeForm").validate();
  }, []);

  async function fetchStates(countryName) {
    try {
      const response = await api.get(
        `/emp/states${countryName === "India" ? "?country_name=" + countryName : ""
        }`
      );
      setStates(response.data);
    } catch (error) {
      console.error("Error fetching states:", error);
      toast.error("Error fetching states");
    }
  }

  async function fetchCities(stateName) {
    try {
      const response = await api.get(
        `/emp/cities${stateName === "Maharashtra" || stateName === "Telangana"
          ? "?state_name=" + stateName
          : ""
        }`
      );
      setCities(response.data);
    } catch (error) {
      console.error("Error fetching cities:", error);
      toast.error("Error fetching cities");
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setIsFormValid($("#employeeForm").valid());
    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setEmployee((prevEmployee) => ({
        ...prevEmployee,
        address: {
          ...prevEmployee.address,
          [addressField]: value,
        },
      }));
    } else {
      setEmployee((prevEmployee) => ({
        ...prevEmployee,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsFormValid($("#employeeForm").valid());
    if (isFormValid) {
      try {
        if (isEdit) {
          await api.put(`/emp/${id}`, [employee, Xemployee]);
          toast((t) => (
            <span>
              Employee Details Updated !
              <button
                style={{
                  border: "none",
                  backgroundColor: "transparent",
                }}
                onClick={() => {
                  toast.dismiss(t.id);
                }}
              >
                ❌
              </button>
            </span>
          ));
        } else {
          await api.post("/emp", employee);
          toast((t) => (
            <span>
              Employee Created !
              <button
                style={{
                  border: "none",
                  backgroundColor: "transparent",
                }}
                onClick={() => {
                  toast.dismiss(t.id);
                }}
              >
                ❌
              </button>
            </span>
          ));
        }
        document.querySelector("dialog").showModal();
        setTimeout(() => {
          document.querySelector("dialog").close();
          setIsDone(true);
        }, 1500);
      } catch (error) {
        console.error("Error submitting employee:", error);
        toast.error(error);
      }
    }
  };

  const handleDelete = async () => {
    if (confirm("Do you want to Delete this Employee")) {
      try {
        await api.delete(`/emp/${id}`, { data: employee });
        setIsDeleted(true);
      } catch (error) {
        console.error("Error deleting employee:", error);
      }
    }
  };

  if (isDone || isDeleted) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <dialog>
        <Loader />
      </dialog>
      <h2>{isEdit ? "Edit Employee" : "Add Employee"}</h2>
      <form id="employeeForm" onSubmit={handleSubmit}>
        <input type="hidden" name="EmployeeID" />
        <table>
          <tbody>
            <tr>
              <th>Name</th>
              <td>
                <input
                  type="text"
                  name="name"
                  value={employee.name}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Full Name"
                  required
                  minLength="3"
                  maxLength="20"
                />
              </td>
            </tr>
            <tr>
              <th>Phone</th>
              <td>
                <input
                  type="number"
                  name="phone"
                  value={employee.phone}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Phone / Mobile"
                  required
                  pattern="^\d{10}$"
                  minLength="10"
                  maxLength="15"
                />
              </td>
            </tr>
            <tr>
              <th>Country</th>
              <td>
                <select
                  name="address.country"
                  value={employee.address.country}
                  onChange={(e) => {
                    handleInputChange(e);
                    fetchStates(e.target.value);
                  }}
                  className="form-control"
                  id="countryDropdown"
                  required
                >
                  <option value="" disabled>
                    --Select a Country--
                  </option>
                  {countries.map((country) => (
                    <option
                      key={country.country_short_name}
                      value={country.country_name}
                    >
                      {country.country_name}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
              <th>State</th>
              <td>
                <select
                  name="address.state"
                  value={employee.address.state}
                  onChange={(e) => {
                    handleInputChange(e);
                    fetchCities(e.target.value);
                  }}
                  className="form-control"
                  required
                >
                  <option value="" disabled>
                    --Select a State--
                  </option>
                  {states.map((state) => (
                    <option key={state.state_name} value={state.state_name}>
                      {state.state_name}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
              <th>City</th>
              <td>
                <select
                  name="address.city"
                  value={employee.address.city}
                  onChange={handleInputChange}
                  className="form-control"
                  required
                >
                  <option value="" disabled>
                    --Select a City--
                  </option>
                  {cities.map((city) => (
                    <option key={city.city_name} value={city.city_name}>
                      {city.city_name}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
              <th>Zip Code</th>
              <td>
                <input
                  type="number"
                  name="address.zipCode"
                  value={employee.address.zipCode}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Zip Code / Postal Code"
                  required
                  minLength="6"
                />
              </td>
            </tr>
            <tr>
              <th>
                <Link to={"/"} className="m-2 p-0 w-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="25"
                    fill="currentColor"
                    className="bi bi-arrow-left-square"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm11.5 5.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"
                    />
                  </svg>
                </Link>
              </th>
              <td
                style={{
                  display: "flex",
                  alignItems: "start",
                  justifyContent: "space-around",
                }}
              >
                <button
                  type="submit"
                  className="m-2 p-0 text-success"
                  style={{
                    background: "none",
                    border: "none",
                    opacity: isFormValid ? 1 : 0.3,
                  }}
                  disabled={!isFormValid}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="25"
                    fill="currentColor"
                    className="bi bi-file-earmark-check"
                    viewBox="0 0 16 16"
                  >
                    <path d="M10.854 7.854a.5.5 0 0 0-.708-.708L7.5 9.793 6.354 8.646a.5.5 0 1 0-.708.708l1.5 1.5a.5.5 0 0 0 .708 0l3-3z" />
                    <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z" />
                  </svg>
                </button>
                {isEdit && (
                  <button
                    onClick={handleDelete}
                    className="text-danger m-2 p-0 w-2"
                    style={{ border: "none", background: "none" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      fill="currentColor"
                      className="bi bi-person-x"
                      viewBox="0 0 16 16"
                    >
                      <path d="M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM8 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm.256 7a4.474 4.474 0 0 1-.229-1.004H3c.001-.246.154-.986.832-1.664C4.484 10.68 5.711 10 8 10c.26 0 .507.009.74.025.226-.341.496-.65.804-.918C9.077 9.038 8.564 9 8 9c-5 0-6 3-6 4s1 1 1 1h5.256Z" />
                      <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm-.646-4.854.646.647.646-.647a.5.5 0 0 1 .708.708l-.647.646.647.646a.5.5 0 0 1-.708.708l-.646-.647-.646.647a.5.5 0 0 1-.708-.708l.647-.646-.647-.646a.5.5 0 0 1 .708-.708Z" />
                    </svg>
                  </button>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </>
  );
};
export default EmployeeForm;
