import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import api from "../../utils/api";
import { toast } from "react-hot-toast";
import { Loader } from "../../assets/Loader";

const Service = () => {
  const { id } = useParams();
  const isEdit = id !== undefined;
  const [isDone, setIsDone] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [service, setService] = useState({
    name: "",
    type: "",
    info: "",
    provider: "",
  });
  const [Xservice, setXService] = useState({
    name: "",
    type: "",
    info: "",
    provider: "",
  });
  // Fetch existing service data on edit
  useEffect(() => {
    async function fetchService() {
      document.querySelector("dialog").showModal();
      try {
        const response = await api.get(`/service/${id}`);
        setXService(response.data);
        setService(response.data);
      } catch (error) {
        toast.error("Service not found!");
        setIsDone(true);
      }
      document.querySelector("dialog").close();
    }
    if (isEdit) {
      fetchService();
    }
  }, [id, isEdit]);

  // Input change and Validations
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setService((prevService) => ({
      ...prevService,
      [name]: value,
    }));
    setIsFormValid(true); // You can add your validation logic here
  };

  // Submit Update if isEdit else Submit Create
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFormValid) {
      try {
        if (isEdit) {
          await api.put(`/service/${id}`, [service, Xservice]);
          toast.success('Service Details Updated!');
        } else {
          await api.post('/service', service);
          toast.success('Service Created!');
        }
        document.querySelector('dialog').showModal();
        setTimeout(() => {
          document.querySelector('dialog').close();
          setIsDone(true);
        }, 1500);
      } catch (error) {
        console.error('Error submitting product:', error);
        toast.error(error);
      }
    } else {
      setIsFormValid(false);
    }
  };

  // Handle deleting data
  const handleDelete = async () => {
    if (confirm("Do you want to Delete this Service?")) {
      try {
        await api.delete(`/service/${id}`, { data: service });
        setIsDeleted(true);
      } catch (error) {
        console.error("Error deleting service:", error);
      }
    } else setIsFormValid(false);
  };

  // Redirect after successful submission or deletion
  if (isDone || isDeleted) {
    return <Navigate to="/service" />;
  }

  return (
    <>
      <dialog>
        <Loader />
      </dialog>
      <h2 className="mb-4">{isEdit ? "Edit" : "Create"} Service</h2>
      <form onSubmit={handleSubmit} className="p-3">
        <input type="hidden" name="ServiceId" />
        <div className="grid">
          <div>
            <span>Name</span>
            <span>
              <input
                type="text"
                name="name"
                value={service.name}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Service Name"
                required
              />
            </span>
          </div>
          <div>
            <span>Type</span>
            <span>
              <select
                name="type"
                value={service.type}
                onChange={handleInputChange}
                className="form-control"
                required
              >
                <option value="">-- Select a Type --</option>
                <option value="Consulting">Consulting</option>
                <option value="Support">Support</option>
                <option value="Development">Development</option>
                <option value="Maintenance">Maintenance</option>
                {/* Add more options as needed */}
              </select>
            </span>
          </div>
          <div>
            <span>Info</span>
            <span>
              <textarea
                name="info"
                value={service.info}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Service Info"
              />
            </span>
          </div>
          <div>
            <span>Provider</span>
            <span>
              <input
                type="text"
                name="provider"
                value={service.provider}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Service Provider"
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

export default Service;
