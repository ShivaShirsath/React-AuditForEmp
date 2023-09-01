import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';
import { Loader } from '../../assets/Loader';

const ProductForm = () => {
  const { id } = useParams();
  const isEdit = id !== undefined;
  const [isDone, setIsDone] = useState(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [product, setProduct] = useState({
    name: '',
    category: '', // (Hardware, Software, Networking, Security, etc.)
    description: '',
    compatibility: '', // (Operating systems, software versions, etc.)
  });
  const [Xproduct, setXProduct] = useState({
    name: '',
    category: '',
    description: '',
    compatibility: '',
  });

  // Fetch existing product data on edit
  useEffect(() => {
    async function fetchProduct() {
      document.querySelector('dialog').showModal();
      try {
        const response = await api.get(`/product/${id}`);
        setXProduct(response.data);
        setProduct(response.data);
      } catch (error) {
        toast.error('Product not Found!');
        setIsDone(true);
      }
      document.querySelector('dialog').close();
    }
    if (isEdit) {
      fetchProduct();
    }
  }, [id, isEdit]);

  // Handle input change and form validation
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
    setIsFormValid(true); // You might want to implement validation logic here
  };

  // Submit Update if isEdit else Submit Create
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFormValid) {
      try {
        if (isEdit) {
          await api.put(`/product/${id}`, [product, Xproduct]);
          toast.success('Product Details Updated!');
        } else {
          await api.post('/product', product);
          toast.success('Product Created!');
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

  // Handle product deletion
  const handleDelete = async () => {
    if (confirm('Do you want to Delete this Product?')) {
      try {
        await api.delete(`/product/${id}`, { data: product });
        setIsDeleted(true);
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  // Redirect after successful submission or deletion
  if (isDone || isDeleted) {
    return <Navigate to="/products" />;
  }

  return (
    <>
      <dialog>
        <Loader />
      </dialog>
      <h2 className="mb-4">{isEdit ? 'Edit' : 'Create'} Product</h2>
      <form onSubmit={handleSubmit} className="p-3">
        <input type="hidden" name="ProductId" />
        <div className="grid">
          <div>
            <span>Name</span>
            <span>
              <input
                type="text"
                name="name"
                value={product.name}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Product Name"
                required
              />
            </span>
          </div>
          <div>
            <span>Category</span>
            <span>
              <select
                name="category"
                value={product.category}
                onChange={handleInputChange}
                className="form-control"
                required
              >
                <option value="" disabled>
                  --Select a Category--
                </option>
                <option value="Hardware">Hardware</option>
                <option value="Software">Software</option>
                <option value="Networking">Networking</option>
                <option value="Security">Security</option>
                {/* Add more options as needed */}
              </select>
            </span>
          </div>
          <div>
            <span>Description</span>
            <span>
              <textarea
                name="description"
                value={product.description}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Product Description"
              />
            </span>
          </div>
          <div>
            <span>Compatibility</span>
            <span>
              <select
                name="compatibility"
                value={product.compatibility}
                onChange={handleInputChange}
                className="form-control"
              >
                <option value="" disabled>
                  -- Select a Option --
                </option>
                <option value="Operating System">Operating System</option>
                <option value="Software Version">Software Version</option>
                <option value="Hardware Compatibility">Hardware Compatibility</option>
                {/* Add more options as needed */}
              </select>
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
