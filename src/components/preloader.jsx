import React, { useEffect, useState } from "react";
import { useQuery } from "@apollo/client";
import { gql } from "@apollo/client";
import { motion } from "framer-motion";

const GET_ALL_IMAGE_URLS = gql`
  query {
    restaurants {
      Image {
        url
      }
    }
    dishes {
      Image {
        url
      }
    }
  }
`;

const Preloader = ({ apiUrl, staticImages, children }) => {
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const { loading, error, data } = useQuery(GET_ALL_IMAGE_URLS);

  useEffect(() => {
    console.log("[GT][Preloader] useEffect triggered: starting image preloading");

    const preloadImages = () => {
      const imageUrls = [...staticImages];
      console.log("[GT][Preloader] Static images:", staticImages);

      if (data) {
        console.log("[GT][Preloader] Fetched Apollo data:", data);
        const databaseUrls = [
          ...data.restaurants.map((r) => `${apiUrl}${r.Image.url}`),
          ...data.dishes.map((d) => `${apiUrl}${d.Image.url}`),
        ];
        imageUrls.push(...databaseUrls);
        console.log("[GT][Preloader] Database images:", databaseUrls);
      } else {
        console.log("[GT][Preloader] Apollo data is not available yet");
      }

      let loadedCount = 0;
      imageUrls.forEach((src) => {
        console.log("[GT][Preloader] Preloading image:", src);
        const img = new Image();
        img.src = src;
        img.onload = () => {
          console.log("[GT][Preloader] Image loaded successfully:", src);
          loadedCount++;
          if (loadedCount === imageUrls.length) {
            console.log("[GT][Preloader] All images loaded successfully");
            setImagesLoaded(true);
          }
        };
        img.onerror = () => {
          console.error("[GT][Preloader] Error loading image:", src);
          loadedCount++;
          if (loadedCount === imageUrls.length) {
            console.log("[GT][Preloader] All images attempted (some failed)");
            setImagesLoaded(true);
          }
        };
      });

      if (imageUrls.length === 0) {
        console.log("[GT][Preloader] No images to preload");
        setImagesLoaded(true);
      }
    };

    preloadImages();
  }, [data, apiUrl, staticImages]);

  if (!imagesLoaded && !error && loading) {
    console.log("[GT][Preloader] Displaying loading screen");
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          backgroundColor: "#2c2c2c",
          color: "#FFFFFF",
          fontFamily: "'Nunito Sans', sans-serif",
        }}
      >
        <motion.div
          style={{
            width: "60px",
            height: "60px",
            border: "6px solid #343a40",
            borderTop: "6px solid #FF2D55",
            borderRadius: "50%",
          }}
          animate={{ rotate: 360 }}
          transition={{
            loop: Infinity,
            ease: "linear",
            duration: 1.2,
          }}
        ></motion.div>
        <p
          style={{
            marginTop: "20px",
            fontSize: "1.2em",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Loading...
        </p>
      </div>
    );
  }

  console.log("[GT][Preloader] Rendering child components");
  return children;
};

export default Preloader;
