import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import api from "../../utils/api";
import $ from "jquery";
import "jquery-validation";
import "jquery-validation-unobtrusive";
import { toast } from "react-hot-toast";
import { Loader } from "../../assets/Loader";
/*
 * Component for adding or editing employee details.
 * Fetches data, handles form submissions, and validation.
 */
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

  // Fetch existing employee data on edit
  useEffect(() => {
    async function fetchEmployee() {
      document.querySelector("dialog").showModal();
      try {
        const response = await api.get(`/emp/${id}`);
        setXEmployee(response.data);
        setEmployee(response.data);
      } catch (error) {
        toast.error(`Employee not Found !`);
        setIsDone(true);
      }
      document.querySelector("dialog").close();
    }
    if (isEdit) {
      fetchEmployee();
    }
  }, [id, isEdit]);

  // Fetch countries and initial states
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

  // Fetch states based on selected country
  async function fetchStates(countryName) {
    try {
      const response = await api.get(
        `/emp/states${countryName === "India" ? "?country_name=" + countryName : ""
        }`
      );
      setStates(response.data);
      if (employee.address.state) {
        setEmployee((prevEmployee) => ({
          ...prevEmployee,
          address: {
            ...prevEmployee.address,
            ['state']: '',
          },
        }));
        setIsFormValid(false);
      }
    } catch (error) {
      console.error("Error fetching states:", error);
      toast.error("Error fetching states");
    }
  }

  // Fetch cities based on selected state
  async function fetchCities(stateName) {
    try {
      const response = await api.get(
        `/emp/cities${stateName === "Maharashtra" || stateName === "Telangana"
          ? "?state_name=" + stateName
          : ""
        }`
      );
      setCities(response.data);
      if (employee.address.city) {
        setEmployee((prevEmployee) => ({
          ...prevEmployee,
          address: {
            ...prevEmployee.address,
            ['city']: '',
          },
        }));
        setIsFormValid(false);
      }
    } catch (error) {
      console.error("Error fetching cities:", error);
      toast.error("Error fetching cities");
    }
  }

  // for Input change and Validations
  const handleInputChange = (e) => {
    const { name, value } = e.target;
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
    setIsFormValid($("#employeeForm").valid());
  };

  // Submit Update if isEdit else Submint Create
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
    } else {
      setIsFormValid(false);
    }
  };

  // for Deleting data
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

  // Redirect after successful submission or deletion
  if (isDone || isDeleted) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <dialog>
        <Loader />
      </dialog>
      <h2 className="mb-4">{isEdit ? "Edit" : "Create"} Employee</h2>
      <form id="employeeForm" onSubmit={handleSubmit} className="p-3">
        <input type="hidden" name="EmployeeID" />
        <div className="grid">
          <div>
            <span>Name</span>
            <span>
              <input
                type="text"
                name="name"
                value={employee.name}
                onChange={handleInputChange}
                onInput={(e) => {
                  e.target.value = e.target.value.replace(/[^A-Za-z\s]/g, "");
                }}
                className="form-control"
                placeholder="Full Name"
                required
                minLength="3"
                maxLength="20"
              />
            </span>
          </div>
          <div>
            <span>Phone</span>
            <span>
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
            </span>
          </div>
          <div>
            <span>Country</span>
            <span>
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
            </span>
          </div>
          <div>
            <span>State</span>
            <span>
              <select
                name="address.state"
                value={employee.address.state}
                onChange={(e) => {
                  handleInputChange(e);
                  fetchCities(e.target.value);
                }}
                id="stateDropdown"
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
            </span>
          </div>
          <div>
            <span>City</span>
            <span>
              <select
                name="address.city"
                value={employee.address.city}
                onChange={handleInputChange}
                className="form-control"
                id="citiDropdown"
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
            </span>
          </div>
          <div>
            <span>Zip Code</span>
            <span>
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
            </span>
          </div>
          <div>
            <span>
              <button
                onClick={() => setIsDone(true)}
                className="btn btn-primary btn-sm"
              >
                <i className="bi bi-arrow-left-square"></i> Back
              </button>
            </span>
            <span
              style={{
                display: "flex",
                alignItems: "start",
                justifyContent: "start",
                gap: '1dvmin'
              }}
            >
              <button
                type="submit"
                className="btn btn-sm btn-success"
                style={{
                  opacity: isFormValid ? 1 : 0.3,
                }}
                disabled={!isFormValid}
              >
                <i className="bi bi-file-earmark-check"></i> {isEdit ? "Save" : "Create"}
              </button>
              {isEdit && (
                <button
                  onClick={handleDelete}
                  className="btn btn-sm btn-danger"
                >
                  <i className="bi bi-person-x"></i> Delete
                </button>
              )}
            </span>
          </div>
        </div>
      </form>
    </>
  );
};
export default EmployeeForm;
