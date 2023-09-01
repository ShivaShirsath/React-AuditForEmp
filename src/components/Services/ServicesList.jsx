import { useEffect, useState } from "react";
import api from "../../utils/api";
import { Link } from "react-router-dom";
import { Loader } from "../../assets/Loader";
/*
 * Component displaying a list of services.
 * Fetches services data from the API and provides actions like creating, editing and deleting.
 */
function ServicesList() {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch services on component mount
  useEffect(() => {
    async function fetchServices() {
      setIsLoading(true);
      const response = await api.get("/service");
      setServices(response.data);
      setTimeout(() => {
        document.querySelector("dialog").close();
        setIsLoading(false);
      }, 1500);
    }
    fetchServices();
  }, []);

  // Delete services by ID
  const handleDelete = async (id) => {
    if (confirm("Do you want to delete this Employee")) {
      setIsLoading(true);
      try {
        const response = await api.get(`/service/${id}`);
        await api.delete(`/service/${id}`, { data: response.data });
        window.location.reload();
      } catch (error) {
        console.error("Error deleting services:", error);
      }
      setIsLoading(false);
    }
  };

  return isLoading ? (
    <dialog open>
      <Loader />
    </dialog>
  ) : (
    <>
      <h2>
        Services
          <Link to={"/service/add"} className="btn btn-success btn-sm text-white ms-3">
            <i className="bi bi-person-plus"></i> Create
        </Link>
      </h2>
      {!(services.length === 0) ? (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.map((services) => (
              <tr key={services.serviceId}>
                <td>{services.serviceId}</td>
                <td>{services.name}</td>
                <td
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "1dvmin"
                  }}
                >
                  <Link
                    to={"/service/edit/" + services.serviceId}
                    className="btn btn-sm btn-primary text-white"
                  >
                    <i className="bi bi-pencil-square"></i> Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(services.serviceId)}
                    className="btn btn-sm btn-danger text-white"
                  >
                    <i className="bi bi-person-x"></i> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <>Services Not Available !</>
      )}
    </>
  );
}

export default ServicesList;
