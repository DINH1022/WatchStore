import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import { ChevronLeft, ChevronRight } from "lucide-react";
import WatchCard from "../Products/WatchCard";
import favoritesApi from "../../service/api/favoritesApi";
const ListProduct = ({ products, title }) => {
  const [startIndex, setStartIndex] = useState(0);
  const productsPerView = 4;
  const [favorites, setFavorites] = useState([]);
  const [login, setLogin] = useState(!!sessionStorage.getItem("userData"));
  if (login) {
    useEffect(() => {
      const fetchFavorites = async () => {
        try {
          const response = await favoritesApi.getFavorites();
          setFavorites(response.products);
        } catch (error) {
          console.error("Failed to fetch favorites:", error);
        }
      };
      fetchFavorites();
    }, []);
  }

  const handleNext = () => {
    setStartIndex((prevIndex) => {
      const nextIndex = prevIndex + productsPerView;
      return nextIndex >= products.length ? 0 : nextIndex;
    });
  };

  const handlePrev = () => {
    setStartIndex((prevIndex) => {
      const nextIndex = prevIndex - productsPerView;
      return nextIndex < 0
        ? Math.floor(products.length / productsPerView) * productsPerView
        : nextIndex;
    });
  };



  return (
    <Box sx={{ position: "relative", my: 4 }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: 600,
          color: "#1a237e",
          textAlign: "center",
          mb: 2,
        }}
      >
        {title}
      </Typography>

      <Box
        sx={{
          position: "relative",
          mx: 6,
          overflow: "visible",
        }}
      >
        <Button
          onClick={handlePrev}
          sx={{
            position: "absolute",
            left: -30,
            top: "50%",
            transform: "translateY(-50%)",
            minWidth: 40,
            width: 40,
            height: 40,
            borderRadius: "50%",
            backgroundColor: "white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            "&:hover": {
              backgroundColor: "white",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              transform: "translateY(-50%) scale(1.1)",
            },
            transition: "all 0.3s ease",
            zIndex: 100,
          }}
        >
          <ChevronLeft />
        </Button>

        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 0.5,
              transform: `translateX(calc(-${startIndex * 25}% - ${
                startIndex * 2
              }px))`,
              transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
              willChange: "transform",
              padding: "0 3px",
            }}
          >
            {products.map((product, index) => {
              const isFavorited = login
                ? favorites.some((fav) => fav._id === product._id)
                : false;
              return (
                <Box
                  key={index}
                  sx={{
                    flex: "0 0 25%",
                    padding: "0 3px",
                    transform: "scale(0.98)",
                    transition: "all 0.4s ease",
                    "&:hover": {
                      transform: "scale(1) translateY(-5px)",
                      zIndex: 1,
                    },
                  }}
                >
                  <WatchCard
                    key={index}
                    watch={product}
                    favorited={isFavorited}
                  />
                </Box>
              );
            })}
          </Box>
        </Box>

        <Button
          onClick={handleNext}
          sx={{
            position: "absolute",
            right: -30,
            top: "50%",
            transform: "translateY(-50%)",
            minWidth: 40,
            width: 40,
            height: 40,
            borderRadius: "50%",
            backgroundColor: "white",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            "&:hover": {
              backgroundColor: "white",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              transform: "translateY(-50%) scale(1.1)",
            },
            transition: "all 0.3s ease",
            zIndex: 100,
          }}
        >
          <ChevronRight />
        </Button>
      </Box>

      <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 3 }}>
        {Array.from({
          length: Math.ceil(products.length / productsPerView),
        }).map((_, index) => (
          <Box
            key={index}
            onClick={() => setStartIndex(index * productsPerView)}
            sx={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor:
                Math.floor(startIndex / productsPerView) === index
                  ? "#1a237e"
                  : "#e0e0e0",
              cursor: "pointer",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.2)",
                backgroundColor:
                  Math.floor(startIndex / productsPerView) === index
                    ? "#1a237e"
                    : "#bdbdbd",
              },
            }}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default ListProduct;
