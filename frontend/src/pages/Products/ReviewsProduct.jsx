import React, { useState, useEffect } from "react";
import { Star, PenIcon } from "lucide-react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Rating,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";
import { StarRounded, StarOutlineRounded } from "@mui/icons-material";
import productApi from "../../service/api/productsApi";
import { useParams } from "react-router";
const ReviewsProduct = ({ reviews = [] }) => {
  const [openReviewModal, setOpenReviewModal] = useState(false);
  const {id: productId} = useParams()
  const [newReview, setNewReview] = useState({
    rating: 0,
    comment: "",
  });

  const handleOpenReviewModal = () => {
    setOpenReviewModal(true);
  };

  const handleCloseReviewModal = () => {
    setOpenReviewModal(false);
    setNewReview({ rating: 0, comment: "" });
  };

  const handleSubmitReview = async () => {
    if (newReview.rating > 0 && newReview.comment) {
      const response = await productApi.createReview(productId, newReview)
      console.log(response)
      handleCloseReviewModal();
    }
  };
  return (
    <>
      <Card variant="outlined" sx={{ mt: 4 }}>
        <CardHeader
          title="Nhận xét khách hàng"
          action={
            <Button
              variant="contained"
              color="primary"
              startIcon={<PenIcon />}
              onClick={handleOpenReviewModal}
            >
              Viết đánh giá
            </Button>
          }
        />
        <Divider />
        <CardContent>
          {reviews.map((review, index) => (
            <Box
              key={index}
              sx={{ borderBottom: "1px solid #e0e0e0", pb: 4, mb: 4 }}
            >
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <Typography variant="body1" fontWeight="bold">
                    {review.name}
                  </Typography>
                  <Rating
                    name="rounded-stars-rating"
                    defaultValue={review.rating}
                    precision={0.1} 
                    readOnly 
                    icon={<StarRounded fontSize="inherit" />}
                    emptyIcon={<StarOutlineRounded fontSize="inherit" />} 
                  />
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {review.date}
                </Typography>
              </Box>
              <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                {review.comment}
              </Typography>
            </Box>
          ))}
          <Button variant="contained" color="inherit" fullWidth>
            Xem tất cả nhận xét
          </Button>
        </CardContent>
      </Card>

      {/* Modal viết đánh giá */}
      <Dialog
        open={openReviewModal}
        onClose={handleCloseReviewModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Viết đánh giá</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            
            <Box display="flex" alignItems="center" gap={2}>
              <Typography>Đánh giá:</Typography>
              <Rating
                value={newReview.rating}
                onChange={(e, newValue) =>
                  setNewReview({ ...newReview, rating: newValue })
                }
                icon={<Star />}
              />
            </Box>
            <TextField
              label="Nhận xét"
              fullWidth
              multiline
              rows={4}
              value={newReview.comment}
              onChange={(e) =>
                setNewReview({ ...newReview, comment: e.target.value })
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseReviewModal} color="secondary">
            Hủy
          </Button>
          <Button
            onClick={handleSubmitReview}
            color="primary"
            variant="contained"
            disabled={
              !newReview.rating || !newReview.comment
            }
          >
            Gửi đánh giá
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default ReviewsProduct;
