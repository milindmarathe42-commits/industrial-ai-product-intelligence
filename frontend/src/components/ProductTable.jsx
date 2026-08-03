import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/ProductTable.css";

function ProductTable({ refresh, search }) {

    const [products, setProducts] = useState([]);

    const fetchProducts = async () => {

        try {

            let response;

            if (search.trim() === "") {
                response = await api.get("/products");
            } else {
                response = await api.get(`/products/search/${search}`);
            }

            setProducts(response.data);

        } catch (error) {

            console.log(error);

        }

    };

    const deleteProduct = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmDelete) return;

        try {

            await api.delete(`/products/${id}`);

            fetchProducts();

        } catch (error) {

            console.log(error);

        }

    };

    useEffect(() => {

        fetchProducts();

    }, [refresh, search]);

    return (

        <div className="table-container">

            <h2>Product History</h2>

            <table>

                <thead>

                    <tr>

                        <th>ID</th>
                        <th>Image</th>
                        <th>Product</th>
                        <th>Confidence</th>
                        <th>Action</th>

                    </tr>

                </thead>

                <tbody>

                    {products.map((item) => (

                        <tr key={item.id}>

                            <td>{item.id}</td>

                            <td>

                                <img
                                    src={`http://127.0.0.1:8000/${item.output_image}`}
                                    alt="product"
                                    className="table-image"
                                />

                            </td>

                            <td>{item.product_name}</td>

                            <td>

                                {(item.confidence * 100).toFixed(0)}%

                            </td>

                            <td>

                                <button
                                    className="delete-btn"
                                    onClick={() => deleteProduct(item.id)}
                                >
                                    Delete
                                </button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>

    );

}

export default ProductTable;