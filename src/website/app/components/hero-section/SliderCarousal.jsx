/* eslint-disable react/jsx-key */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { styled, keyframes, css } from "@mui/system";
import { toast } from "react-toastify";
import { serverWebsiteEndPoint } from "../../../../dashboard/app/constants";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SliderCarousal = () => {
  const [deliveryImages, setDeliveryGalleryImages] = useState([]);
  const [serviceImages, setServiceGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDeliveryGalleryImages = async () => {
    if (!navigator.onLine) {
      toast.error("No internet connection. Please check your connection.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${serverWebsiteEndPoint}/all_delivery_gallery_images`,
        {}
      );
      setDeliveryGalleryImages(response.data.gallery_data_delivery);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchServiceGalleryImages = async () => {
    if (!navigator.onLine) {
      toast.error("No internet connection. Please check your connection.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${serverWebsiteEndPoint}/all_services_gallery_images`,
        {}
      );
      setServiceGalleryImages(response.data.gallery_data_services);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleError = (error) => {
    if (error.response) {
      if (error.response.status === 404) {
        toast.error("No Data Found.");
        setError("No Data Found");
      } else if (error.response.status === 500) {
        toast.error("Internal server error. Please try again later.");
        setError("Internal Server Error");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
        setError("Unexpected Error");
      }
    } else {
      toast.error(
        "Failed to fetch all allowed cities. Please check your connection."
      );
      setError("Network Error");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDeliveryGalleryImages();
    fetchServiceGalleryImages();
  }, []);

  const navigate = useNavigate();

  const handleImageClick = (el) => {
    //navigate("/agents");
  };

  return (
    <AppContainer>
      <Wrapper>
        <Text sx={{ fontFamily: "titillium", fontWeight: "bold" }}>
          Join Us
        </Text>
        <Note sx={{ fontFamily: "titillium" }}>
          Reliable delivery, Anytime, Anywhere.
        </Note>
        <Marquee>
          <MarqueeGroup>
            {deliveryImages.map((el) => (
              <ImageGroup key={el.gallery_id}>
                <Image
                  src={el.image_url}
                  onClick={() => handleImageClick(el)}
                  loading="lazy"
                  alt="Delivery Image"
                />
              </ImageGroup>
            ))}
          </MarqueeGroup>
          <MarqueeGroup>
            {deliveryImages.map((el) => (
              <ImageGroup key={el.gallery_id}>
                <Image
                  src={el.image_url}
                  onClick={() => handleImageClick(el)}
                  loading="lazy"
                  alt="Delivery Image"
                />
              </ImageGroup>
            ))}
          </MarqueeGroup>
        </Marquee>
        <Marquee>
          <MarqueeGroup2>
            {serviceImages.map((el, index) => (
              <ImageGroup key={index}>
                <Image
                  src={el.image_url}
                  onClick={() => handleImageClick(el)}
                  loading="lazy"
                  alt={`Service ${index}`}
                />
              </ImageGroup>
            ))}
          </MarqueeGroup2>
          <MarqueeGroup2>
            {serviceImages.map((el, index) => (
              <ImageGroup key={index}>
                <Image
                  src={el.image_url}
                  onClick={() => handleImageClick(el)}
                  loading="lazy"
                  alt={`Service ${index}`}
                />
              </ImageGroup>
            ))}
          </MarqueeGroup2>
        </Marquee>
      </Wrapper>
    </AppContainer>
  );
};

export default SliderCarousal;

const AppContainer = styled("div")`
  width: 100vw;
  height: auto;
  margin-top: 4rem;
  color: #000000;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled("div")`
  width: 100%;
  height: fit-content;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const Text = styled("div")`
  font-size: clamp(20px, 5vw, 35px);
  font-weight: 500;
  margin-bottom: 10px;
  color: #02203c;
`;

const Note = styled("div")`
  font-size: clamp(12px, 3vw, 18px);
  font-weight: 200;
  margin-bottom: 40px;
  color: #7c8e9a;
`;

const Marquee = styled("div")`
  display: flex;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
  user-select: none;
  padding: 0; //Add some padding to give space on smaller screens
  mask-image: linear-gradient(
    to right,
    hsl(0 0% 0% / 0),
    hsl(0 0% 0% / 1) 10%,
    hsl(0 0% 0% / 1) 90%,
    hsl(0 0% 0% / 0)
  );
`;

const scrollX = keyframes`
  from {
    left: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
`;

const common = css`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-around;
  white-space: nowrap;
  width: 100;
  animation: ${scrollX} 30s linear infinite;
`;

const MarqueeGroup = styled("div")`
  ${common}
`;
const MarqueeGroup2 = styled("div")`
  ${common}
  animation-direction: reverse;
  animation-delay: -3s;
`;

const ImageGroup = styled("div")`
  display: grid;
  place-items: center;
  width: clamp(8rem, 20vw, 18rem); // Adjust size for smaller screens
  padding: clamp(0.5rem, 1vw, 2rem); // Padding adjusts with screen size
  @media (max-width: 600px) {
    width: 12rem; // Set a fixed minimum width for mobile
  }
`;

const Image = styled("img")`
  object-fit: contain;
  width: 100%;
  height: 100%;
  /* border: 1px solid black; */
  border-radius: 0.5rem;
  aspect-ratio: 16/9;
  padding: 5px 20px;
  transition: transform 0.3s ease-in-out;
  max-width: 100%; // Prevents image from exceeding container size
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  @media (max-width: 600px) {
    max-width: 100%; // Ensure image width doesn't shrink too much
  }

  &:hover {
    transform: scale(1.1); // Scale image on hover
  }
`;
