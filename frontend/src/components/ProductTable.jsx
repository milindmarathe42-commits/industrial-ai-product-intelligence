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


    // =========================================================
    // IMAGE URL
    // =========================================================

    const getImageUrl = (image) => {

        if (!image) {
            return "";
        }

        // If backend already returns a complete URL
        if (
            image.startsWith("http://") ||
            image.startsWith("https://")
        ) {
            return image;
        }

        const backendUrl =
            api.defaults.baseURL.replace(/\/$/, "");

        const imagePath =
            image
                .replace(/\\/g, "/")
                .replace(/^\/+/, "");

        return `${backendUrl}/${imagePath}`;
    };


    // =========================================================
    // DELETE PRODUCT
    // =========================================================

    const deleteProduct = async (id) => {

        const result = await Swal.fire({

            title: "Delete Product?",

            text:
                "This inspection record will be permanently deleted.",

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

                text:
                    "Product deleted successfully.",

                timer: 1800,

                showConfirmButton: false

            });


            refreshData();

        }


        catch (error) {

            console.log(error);

            Swal.fire({

                icon: "error",

                title: "Delete Failed",

                text:
                    "Unable to delete the product."

            });

        }

    };


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <>

            {/* =================================================
                DESKTOP / TABLET TABLE
            ================================================= */}

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

                                (

                                    <tr>

                                        <td
                                            colSpan="6"
                                            className="empty-table"
                                        >

                                            No Inspection Records Found

                                        </td>

                                    </tr>

                                )

                                :

                                (

                                    products.map((item) => (

                                        <tr key={item.id}>


                                            {/* ID */}

                                            <td>

                                                #{item.id}

                                            </td>


                                            {/* IMAGE */}

                                            <td>

                                                <img

                                                    src={
                                                        getImageUrl(
                                                            item.output_image
                                                        )
                                                    }

                                                    alt="product"

                                                    className="table-image"

                                                    onClick={() =>

                                                        setPreviewImage(

                                                            getImageUrl(
                                                                item.output_image
                                                            )

                                                        )

                                                    }

                                                />

                                            </td>


                                            {/* PRODUCT */}

                                            <td>

                                                <div className="product-cell">

                                                    <FaBoxOpen />

                                                    {item.product_name}

                                                </div>

                                            </td>


                                            {/* STATUS */}

                                            <td>

                                                <span

                                                    className={
                                                        `status-badge ${
                                                            item.condition
                                                                ? item.condition.toLowerCase()
                                                                : "unknown"
                                                        }`
                                                    }

                                                >

                                                    {item.condition || "Unknown"}

                                                </span>

                                            </td>


                                            {/* QUALITY */}

                                            <td>

                                                <div className="quality-cell">

                                                    <FaStar />

                                                    {item.quality_score || 0}%

                                                </div>

                                            </td>


                                            {/* ACTIONS */}

                                            <td>

                                                <div className="table-actions">


                                                    {/* VIEW */}

                                                    <button

                                                        className="view-btn"

                                                        onClick={() =>

                                                            setSelectedProduct(
                                                                item
                                                            )

                                                        }

                                                    >

                                                        <FaEye />

                                                        View

                                                    </button>


                                                    {/* DELETE */}

                                                    <button

                                                        className="delete-btn"

                                                        onClick={() =>

                                                            deleteProduct(
                                                                item.id
                                                            )

                                                        }

                                                    >

                                                        <FaTrashAlt />

                                                        Delete

                                                    </button>


                                                </div>

                                            </td>


                                        </tr>

                                    ))

                                )

                        }

                    </tbody>

                </table>

            </div>


            {/* =================================================
                MOBILE INSPECTION CARDS
            ================================================= */}

            <div className="mobile-product-list">

                {

                    products.length === 0 ?

                        (

                            <div className="mobile-empty">

                                No Inspection Records Found

                            </div>

                        )

                        :

                        (

                            products.map((item) => (

                                <div

                                    className="mobile-product-card"

                                    key={item.id}

                                >


                                    {/* CARD HEADER */}

                                    <div className="mobile-card-header">

                                        <span className="mobile-product-id">

                                            #{item.id}

                                        </span>


                                        <div className="mobile-quality-top">

                                            <FaStar />

                                            {item.quality_score || 0}%

                                        </div>

                                    </div>


                                    {/* IMAGE */}

                                    <div className="mobile-image-wrapper">

                                        <img

                                            src={
                                                getImageUrl(
                                                    item.output_image
                                                )
                                            }

                                            alt="product"

                                            className="mobile-product-image"

                                            onClick={() =>

                                                setPreviewImage(

                                                    getImageUrl(
                                                        item.output_image
                                                    )

                                                )

                                            }

                                        />

                                    </div>


                                    {/* PRODUCT NAME */}

                                    <div className="mobile-product-name">

                                        <FaBoxOpen />

                                        <span>

                                            {item.product_name}

                                        </span>

                                    </div>


                                    {/* DETAILS */}

                                    <div className="mobile-product-details">


                                        <div className="mobile-detail-row">

                                            <span>

                                                Status

                                            </span>


                                            <span

                                                className={
                                                    `status-badge ${
                                                        item.condition
                                                            ? item.condition.toLowerCase()
                                                            : "unknown"
                                                    }`
                                                }

                                            >

                                                {item.condition || "Unknown"}

                                            </span>

                                        </div>


                                        <div className="mobile-detail-row">

                                            <span>

                                                Quality

                                            </span>


                                            <span className="mobile-quality">

                                                <FaStar />

                                                {item.quality_score || 0}%

                                            </span>

                                        </div>


                                    </div>


                                    {/* ACTIONS */}

                                    <div className="mobile-card-actions">


                                        {/* VIEW */}

                                        <button

                                            className="view-btn"

                                            onClick={() =>

                                                setSelectedProduct(
                                                    item
                                                )

                                            }

                                        >

                                            <FaEye />

                                            View

                                        </button>


                                        {/* DELETE */}

                                        <button

                                            className="delete-btn"

                                            onClick={() =>

                                                deleteProduct(
                                                    item.id
                                                )

                                            }

                                        >

                                            <FaTrashAlt />

                                            Delete

                                        </button>


                                    </div>


                                </div>

                            ))

                        )

                }

            </div>


            {/* =================================================
                PRODUCT MODAL
            ================================================= */}

            {

                selectedProduct &&

                <ProductModal

                    product={selectedProduct}

                    onClose={() =>

                        setSelectedProduct(null)

                    }

                />

            }


            {/* =================================================
                IMAGE VIEWER
            ================================================= */}

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