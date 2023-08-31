import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import api from "../../utils/api";
import $ from "jquery";
import "jquery-validation";
import "jquery-validation-unobtrusive";
import { toast } from "react-hot-toast";
import { Loader } from "../../assets/Loader";
/*
 * Component for adding or editing service details.
 * Fetches data, handles form submissions, and validation.
 */
const ProductForm = () => {
  const { id } = useParams();
  const isEdit = id !== undefined;
  const [isDone, setIsDone] = useState(null);

  const [isFormValid, setIsFormValid] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [service, setService] = useState({
    name: '',
    type: '', //(Consulting, Support, Development, Maintenance, etc.)
    info: '',
    tech: '',
    provider: '',
  });
  const [Xservice, setXService] = useState({
    name: '',
    type: '', //(Consulting, Support, Development, Maintenance, etc.)
    info: '',
    tech: '',
    provider: '',
  });

  // Fetch existing service data on edit
  useEffect(() => {
    async function fetchService() {
      document.querySelector("dialog").showModal();
      try {
        const response = await api.get(`/emp/${id}`);
        setXService(response.data);
        setService(response.data);
      } catch (error) {
        toast.error(`Service not Found !`);
        setIsDone(true);
      }
      document.querySelector("dialog").close();
    }
    if (isEdit) {
      fetchService();
    }
  }, [id, isEdit]);

  // Fetch countries and initial states
  useEffect(() => {
    $("#serviceForm").validate();
  }, []);

  // for Input change and Validations
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setService((prevService) => ({
      ...prevService,
      [name]: value,
    }));
    setIsFormValid($("#serviceForm").valid());
  };

  // Submit Update if isEdit else Submint Create
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsFormValid($("#serviceForm").valid());
    if (isFormValid) {
      try {
        if (isEdit) {
          await api.put(`/service/${id}`, [service, Xservice]);
          toast((t) => (
            <span>
              Service Details Updated !
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
          await api.post("/emp", service);
          toast((t) => (
            <span>
              Service Created !
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
        console.error("Error submitting service:", error);
        toast.error(error);
      }
    } else {
      setIsFormValid(false);
    }
  };

  // for Deleting data
  const handleDelete = async () => {
    if (confirm("Do you want to Delete this Service")) {
      try {
        await api.delete(`/service/${id}`, { data: service });
        setIsDeleted(true);
      } catch (error) {
        console.error("Error deleting service:", error);
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
      <h2 className="mb-4">{isEdit ? "Edit" : "Create"} Service</h2>
      <form id="serviceForm" onSubmit={handleSubmit} className="p-3">
        <input type="hidden" name="ServiceID" />
        <div className="grid">
          <div>
            <span>Name</span>
            <span>
              <input
                type="text"
                name="name"
                value={service.name}
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
                value={service.phone}
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
                value={service.address}
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

              </select>
            </span>
          </div>
          <div>
            <span>State</span>
            <span>
              <select
                name="address.state"
                value={service.address}
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

              </select>
            </span>
          </div>
          <div>
            <span>City</span>
            <span>
              <select
                name="address.city"
                value={service.address}
                onChange={handleInputChange}
                className="form-control"
                id="citiDropdown"
                required
              >
                <option value="" disabled>
                  --Select a City--
                </option>

              </select>
            </span>
          </div>
          <div>
            <span>Zip Code</span>
            <span>
              <input
                type="number"
                name="address.zipCode"
                value={service.address}
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
export default ProductForm;
