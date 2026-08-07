import { useState } from "react";

import Swal from "sweetalert2";

import {
    FaEye,
    FaTrashAlt,
    FaBoxOpen,
    FaStar
} from "react-icons/fa";

import api from "../services/api";

import ProductModal from "./ProductModal";
import ImageViewer from "./ImageViewer";

import "../styles/ProductTable.css";

function ProductTable({ products, refreshData }) {

    const [selectedProduct, setSelectedProduct] = useState(null);

    const [previewImage, setPreviewImage] = useState(null);

    const deleteProduct = async (id) => {

        const result = await Swal.fire({

            title: "Delete Product?",

            text: "This inspection record will be permanently deleted.",

            icon: "warning",

            showCancelButton: true,

            confirmButtonColor: "#dc2626",

            cancelButtonColor: "#2563eb",

            confirmButtonText: "Delete",

            cancelButtonText: "Cancel",

            reverseButtons: true

        });

        if (!result.isConfirmed) return;

        try {

            await api.delete(`/products/${id}`);

            Swal.fire({

                icon: "success",

                title: "Deleted!",

                text: "Product deleted successfully.",

                timer: 1800,

                showConfirmButton: false

            });

            refreshData();

        }

        catch (error) {

            console.log(error);

        }

    };

    return (

        <>

            <div className="table-container">

                <table>

                    <thead>

                        <tr>

                            <th>ID</th>

                            <th>Image</th>

                            <th>Product</th>

                            <th>Status</th>

                            <th>Quality</th>

                            <th>Actions</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            products.length === 0 ?

                                <tr>

                                    <td

                                        colSpan="6"

                                        className="empty-table"

                                    >

                                        No Inspection Records Found

                                    </td>

                                </tr>

                                :

                                products.map((item) => (

                                    <tr key={item.id}>

                                        <td>

                                            #{item.id}

                                        </td>

                                        <td>

                                            <img

                                                src={`http://127.0.0.1:8000/${item.output_image}`}

                                                alt="product"

                                                className="table-image"

                                                onClick={() =>

                                                    setPreviewImage(

                                                        `http://127.0.0.1:8000/${item.output_image}`

                                                    )

                                                }

                                            />

                                        </td>

                                        <td>

                                            <div className="product-cell">

                                                <FaBoxOpen />

                                                {item.product_name}

                                            </div>

                                        </td>

                                        <td>

                                            <span

                                                className={`status-badge ${item.condition.toLowerCase()}`}

                                            >

                                                {item.condition}

                                            </span>

                                        </td>

                                        <td>

                                            <div className="quality-cell">

                                                <FaStar />

                                                {item.quality_score}%

                                            </div>

                                        </td>

                                        <td>

                                            <div className="table-actions">

                                                <button

                                                    className="view-btn"

                                                    onClick={() =>

                                                        setSelectedProduct(item)

                                                    }

                                                >

                                                    <FaEye />

                                                    View

                                                </button>

                                                <button

                                                    className="delete-btn"

                                                    onClick={() =>

                                                        deleteProduct(item.id)

                                                    }

                                                >

                                                    <FaTrashAlt />

                                                    Delete

                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))

                        }

                    </tbody>

                </table>

            </div>

            {

                selectedProduct &&

                <ProductModal

                    product={selectedProduct}

                    onClose={() =>

                        setSelectedProduct(null)

                    }

                />

            }

            {

                previewImage &&

                <ImageViewer

                    image={previewImage}

                    onClose={() =>

                        setPreviewImage(null)

                    }

                />

            }

        </>

    );

}

export default ProductTable;