import { useEffect, useState } from "react";
import api from "../../utils/api";
import { Link } from "react-router-dom";
import { Loader } from "../../assets/Loader";
import Toggle from 'react-bootstrap-toggle';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isAssending, setIsAssending] = useState(false);
  // Fetch products on component mount

  async function fetchProducts() {
    setIsLoading(true);
    const response = await api.get("/product");
    setProducts(response.data.data);
    setTotalPages(response.data.totalPages);
    setTimeout(() => {
      document.querySelector("dialog").close();
      setIsLoading(false);
    }, 1500);
  }

  useEffect(() => {
    if (currentPage === 0) {
      setCurrentPage(1);
    } else {
      fetchProducts();
    }
  }, [currentPage]);

  useEffect(() => {
    setProducts(products.slice()
      .reverse())
  }, [isAssending]);
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
    <><div style={{ textAlign: 'right' }}>
      <Toggle
        onClick={() => {
          setIsAssending(!isAssending);
        }}
        on={'Assending'}
        off={'Decending'}
        size="xs"
        offstyle="danger"
        active={isAssending}
      />
    </div>
      <h2>
        Products
        <Link to={"/product/add"} className="btn btn-success btn-sm text-white ms-3">
          <i className="bi bi-person-plus"></i> Create
        </Link>
      </h2>
      {!(products.length === 0) ? (<>
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
        </table>        <div>
          <div className="pagination">
            <button
              className="btn btn-primary btn-sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              className="btn btn-primary btn-sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </>
      ) : (
        <>Products Not Available !</>
      )}
    </>
  );
}

export default ProductList;
