import React, { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import Swal from "sweetalert2";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Rating,
  Typography,
  IconButton,
} from "@mui/material";
import { useParams } from "react-router";
import { StarRounded, StarOutlineRounded } from "@mui/icons-material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import SimilarProducts from "./SimilarProducts";
import productApi from "../../service/api/productsApi";
import ImageGallery from "./ImageGallery";
import RatingProduct from "./RatingProduct.jsx";
import ReviewProduct from "./ReviewsProduct.jsx";
import Loader from "../../components/Loader.jsx";
import cartApi from "../../service/api/cartRequest.js";
import showToast from "../../components/ShowToast.jsx";
import { addCartToSessionStorage } from "../../utils/sessionStorage.js";
import Navigation from "../Auth/Navigation.jsx";
import favoritesApi from "../../service/api/favoritesApi.js";
const ProductDetail = () => {
  const [quantity, setQuantity] = useState(1);
  const [product, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id: productId } = useParams();
  const [reviews, setReviews] = useState();
  const [similarProducts, setSimilarProducts] = useState([]);
  const [login, setLogin] = useState(!!sessionStorage.getItem("userData"));
  const [isFavorited, setFavorited] = useState(false);
  if (login) {
    useEffect(() => {
      const fetchFavorites = async () => {
        const response = await favoritesApi.getFavorites();
        const checked = response.products.some(
          (product) => product._id === productId
        );
        setFavorited(checked);
      };
      fetchFavorites();
    }, []);
  }
  const handleFavoriteToggle = async () => {
    if (login) {
      if (isFavorited) {
        setFavorited(!isFavorited);
        await favoritesApi.removeFavorite(productId);
      } else {
        setFavorited(!isFavorited);
        await favoritesApi.addFavorite(productId);
      }
    } else {
      Swal.fire(
        "Cảnh báo",
        "Bạn cần đăng nhập để yêu thích sản phẩm !",
        "error"
      );
    }
  };
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await productApi.getReviewProduct(productId);
        setReviews(response.reviews);
      } catch (err) {
        console.error("Lỗi khi tải nhận xét:", err);
      }
    };
    fetchReviews();
  }, []);
  useEffect(() => {
    const fetchSimilarProduct = async () => {
      try {
        const response = await productApi.getRelatedProducts(productId);
        setSimilarProducts(response);
      } catch (error) {
        throw error;
      }
    };
    fetchSimilarProduct();
  }, []);
  // const [reviews, setReviews] = useState(product.reviews)
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await productApi.getProductById(productId);
        setProducts(response);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchProduct();
  }, []);
  const handleAddToCart = async () => {
    try {
      if (login) {
        await cartApi.addToCart(productId, quantity);
        showToast("Thêm vào giỏ hàng thành công!", "success");
      } else {
        if (quantity > product.countInStock) {
          showToast("Sản phẩm này không đủ hàng!", "error");
          return;
        }
        addCartToSessionStorage(product, quantity);
        showToast("Thêm vào giỏ hàng thành công!", "success");
      }
    } catch (error) {
      showToast("Thất bại !!!", "error");
      throw error;
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <Box
          sx={{
            display: "flex",
            bgcolor: "background.default",
            minHeight: "100vh",
          }}
        >
          <Navigation />
          <div className="container mx-auto p-4 bg-gray-50">
            <div className="grid md:grid-cols-2 gap-8">
              <ImageGallery images={[product.image, ...product.listImage]} />

              <div className="space-y-4">
                <h1 className="text-3xl font-bold text-gray-800">
                  {product.name}
                </h1>

                <Typography variant="body2" color="text.secondary">
                  Thương hiệu: <strong>{product.brand}</strong>
                </Typography>

                <Box display="flex" alignItems="center" gap={2}>
                  <Rating
                    name="rounded-stars-rating"
                    value={product.rating}
                    precision={0.1}
                    readOnly
                    icon={<StarRounded fontSize="inherit" />}
                    emptyIcon={<StarOutlineRounded fontSize="inherit" />}
                  />
                  <Typography variant="body1" color="text.secondary">
                    {product.reviews.length} Nhận xét
                  </Typography>
                </Box>

                <Box display="flex" flexDirection="column">
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      textDecoration: "line-through",
                      fontSize: "0.9rem",
                    }}
                  >
                    {product.originalPrice.toLocaleString()} VNĐ
                  </Typography>
                  <Typography variant="h4" color="error.main" fontWeight="bold">
                    {product.price.toLocaleString()} VNĐ
                  </Typography>
                </Box>

                <Typography variant="body1" color="text.secondary">
                  {product.description}
                </Typography>

                <Box display="flex" alignItems="center" gap={4}>
                  <Box display="flex" alignItems="center" gap={2}>
                    <Button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      variant="contained"
                      color="inherit"
                      size="small"
                    >
                      -
                    </Button>
                    <Typography variant="body1" sx={{ color: "black" }}>
                      {quantity}
                    </Typography>

                    <Button
                      onClick={() => setQuantity(quantity + 1)}
                      variant="contained"
                      color="inherit"
                      size="small"
                    >
                      +
                    </Button>
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<ShoppingCart />}
                    onClick={handleAddToCart}
                  >
                    Thêm vào giỏ
                  </Button>

                  <IconButton
                    onClick={handleFavoriteToggle}
                    sx={{
                      borderRadius: "50%",
                    }}
                  >
                    {isFavorited ? (
                      <FavoriteIcon style={{ color: "red" }} />
                    ) : (
                      <FavoriteBorderIcon style={{ color: "gray" }} />
                    )}
                  </IconButton>
                </Box>

                <Card variant="outlined">
                  <CardHeader title="Đặc điểm nổi bật" />
                  <Divider />
                  <CardContent>
                    <ul className="list-disc list-inside text-gray-700">
                      {product.features.map((feature, index) => (
                        <li key={index} >{feature}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            <RatingProduct reviews={reviews} />
            <ReviewProduct
              reviews={reviews}
              setReviews={setReviews}
              productId={productId}
            />
            <SimilarProducts similarProducts={similarProducts} />
          </div>
        </Box>
      )}
    </>
  );
};

export default ProductDetail;
