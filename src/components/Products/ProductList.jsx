import { useEffect, useState } from "react";
import api from "../../utils/api";
import { Link } from "react-router-dom";
import { Loader } from "../../assets/Loader";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch products on component mount
  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      const response = await api.get("/product");
      setProducts(response.data);
      setTimeout(() => {
        document.querySelector("dialog").close();
        setIsLoading(false);
      }, 1500);
    }
    fetchProducts();
  }, []);

  // Delete product by ID
  const handleDelete = async (id) => {
    if (confirm("Do you want to delete this Product")) {
      setIsLoading(true);
      try {
        const response = await api.get(`/product/${id}`);
        await api.delete(`/product/${id}`, { data: response.data });
        window.location.reload();
      } catch (error) {
        console.error("Error deleting product:", error);
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
        Products
          <Link to={"/product/add"} className="btn btn-success btn-sm text-white ms-3">
            <i className="bi bi-person-plus"></i> Create
        </Link>
      </h2>
      {!(products.length === 0) ? (
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.productId}>
                <td>{product.productId}</td>
                <td>{product.name}</td>
                <td
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "1dvmin"
                  }}
                >
                  <Link
                    to={"/product/edit/" + product.productId}
                    className="btn btn-sm btn-primary text-white"
                  >
                    <i className="bi bi-pencil-square"></i> Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(product.productId)}
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
        <>Products Not Available !</>
      )}
    </>
  );
}

export default ProductList;
