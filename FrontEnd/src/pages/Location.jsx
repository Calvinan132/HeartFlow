import React, { useRef, useEffect, useState, useContext } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";
import { getDistance } from "geolib";

import axios from "axios";
import "./Location.scss";
import Sidebar from "../components/Sidebar";
import { AppContext } from "../context/AppContext";
import { SocketContext } from "../context/SocketContext";

// Hàm tạo Avatar Marker (Dùng chung cho cả 2)
const createAvatarElement = (imageUrl, isPartner = false) => {
  const el = document.createElement("div");
  el.className = isPartner ? "partner-marker" : "my-marker"; // Class riêng để dễ chỉnh CSS

  const img = document.createElement("img");
  img.src =
    imageUrl ||
    "https://imgs.search.brave.com/XKHwkUJVX5C6T9eyq9OuzsyxHAzohp2u7jphVtP-fxM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNjUv/NDEyLzcyNy9zbWFs/bC91c2VyLWF2YXRh/ci1pbGx1c3RyYXRp/b24tdmVjdG9yLmpw/Zw";
  img.alt = "Avatar";

  // Style trực tiếp
  img.style.width = "50px";
  img.style.height = "50px";
  img.style.borderRadius = "50%";
  img.style.objectFit = "cover";
  // Người yêu viền Hồng, Mình viền Xanh
  img.style.border = isPartner ? "3px solid #ff4757" : "3px solid #0070FF";
  img.style.boxShadow = "0 2px 5px rgba(0,0,0,0.3)";
  img.style.display = "block";

  el.appendChild(img);
  return el;
};

const Location = () => {
  const [MyLocation, setLocation] = useState(null);
  const [PartnerPosition, setPartnerLocation] = useState(null);
  const [Distance, setDistance] = useState(null);

  const { userData, allUser, backendUrl, token } = useContext(AppContext);
  const { socket } = useContext(SocketContext);
  const partner = allUser.find((user) => user.id === userData.partner);

  const mapContainer = useRef(null);
  const map = useRef(null);

  const myMarkerRef = useRef(null);
  const partnerMarkerRef = useRef(null);

  const defaultMap = { lng: 106.782185, lat: 10.882525 };
  const zoom = 14;
  maptilersdk.config.apiKey = "coLElzBKgIUlXPeQiouU";
  // 1. Khởi tạo Bản đồ (Chạy 1 lần duy nhất)
  useEffect(() => {
    if (map.current) return;
    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      center: [defaultMap.lng, defaultMap.lat],
      zoom: zoom,
    });
  }, []);

  useEffect(() => {
    if (!socket) return; // Quan trọng: Nếu chưa kết nối thì thoát

    const handleReceiveLocation = (data) => {
      console.log("📍 Received Partner Location:", data);
      setPartnerLocation(data);
    };

    socket.on("receive_partner_location", handleReceiveLocation);

    // Cleanup để tránh lắng nghe trùng lặp
    return () => {
      socket.off("receive_partner_location", handleReceiveLocation);
    };
  }, [socket]);

  // 3. Geolocation & Gửi vị trí của mình đi
  useEffect(() => {
    if (!("geolocation" in navigator)) return;
    if (!socket || !userData) return; // Chỉ chạy khi đã có đủ thông tin

    const options = {
      enableHighAccuracy: true,
      timeout: 10000, // Tăng lên 10s để đỡ bị timeout
      maximumAge: 0,
    };

    const success = (position) => {
      // SỬA LỖI: Lấy toạ độ ra biến rõ ràng
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      // Update state để vẽ marker của mình
      setLocation({ latitude: lat, longitude: lng });

      // Gửi lên server
      socket.emit("send_location", {
        userId: userData.id,
        partnerId: userData.partner,
        latitude: lat, // Truyền đúng biến lat
        longitude: lng, // Truyền đúng biến lng
      });
    };

    const handleError = (err) => {
      console.error("GPS Error:", err.message);
    };

    const watchId = navigator.geolocation.watchPosition(
      success,
      handleError,
      options
    );

    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [socket, userData]); // Thêm userData vào dependency

  useEffect(() => {
    if (map.current && MyLocation) {
      const lnglat = [MyLocation.longitude, MyLocation.latitude];

      if (myMarkerRef.current) {
        myMarkerRef.current.setLngLat(lnglat);
      } else {
        const el = createAvatarElement(userData?.image_url, false);
        myMarkerRef.current = new maptilersdk.Marker({ element: el })
          .setLngLat(lnglat)
          .addTo(map.current);

        map.current.flyTo({ center: lnglat, zoom: 15 });
      }
    }
  }, [MyLocation, userData]);

  useEffect(() => {
    if (map.current && PartnerPosition) {
      const lnglat = [PartnerPosition.longitude, PartnerPosition.latitude];

      if (partnerMarkerRef.current) {
        partnerMarkerRef.current.setLngLat(lnglat);
      } else {
        const el = createAvatarElement(partner?.partner_image_url, true);
        partnerMarkerRef.current = new maptilersdk.Marker({ element: el })
          .setLngLat(lnglat)
          .addTo(map.current);
      }
    }
  }, [PartnerPosition, partner]);

  useEffect(() => {
    let getPartnerLocation = async () => {
      try {
        let { data } = await axios.get(
          backendUrl + "/api/partner/Partner-location",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        if (data.success) {
          setPartnerLocation(data.data);
        } else {
          console.log("Lỗi dữ liệu");
        }
      } catch (e) {
        console.log("Lỗi từ frontend :", e.message);
      }
    };
    getPartnerLocation();
  }, []);

  useEffect(() => {
    if (MyLocation && PartnerPosition && PartnerPosition.latitude) {
      const distInMeters = getDistance(
        { latitude: MyLocation.latitude, longitude: MyLocation.longitude },
        {
          latitude: PartnerPosition.latitude,
          longitude: PartnerPosition.longitude,
        }
      );

      setDistance((distInMeters / 1000).toFixed(1));
    }
  }, [MyLocation, PartnerPosition]);

  const flyToTarget = (targetLocation) => {
    if (!map.current) return;

    if (
      !targetLocation ||
      !targetLocation.latitude ||
      !targetLocation.longitude
    ) {
      console.warn("Chưa có toạ độ để bay đến!");
      return;
    }

    map.current.flyTo({
      center: [targetLocation.longitude, targetLocation.latitude],
      zoom: 16,
      speed: 1.2,
      curve: 1.42,
      essential: true,
    });
  };

  return (
    <div className="Location-container container-fluid">
      <div className="Location-content row pt-3">
        <div className="Location-left d-none d-md-flex col-md-3">
          <Sidebar />
        </div>
        <div className="Location-mid col-12 col-md-6">
          <div className="wrap-map">
            <div className="map" ref={mapContainer}>
              {partner ? (
                <div className="Container-distance">
                  <div className="user-info">
                    <img
                      src={userData?.image_url}
                      alt="#"
                      className="U-avt"
                      style={{ cursor: "pointer" }}
                      onClick={() => flyToTarget(MyLocation)}
                    />
                    <div className="U-name">
                      {userData?.lastname + " " + userData?.firstname}
                    </div>
                  </div>
                  <div className="distance">
                    {Distance ? `${Distance} Km` : "0 Km"}
                  </div>
                  <div className="partner-info">
                    <img
                      src={partner?.image_url}
                      alt="#"
                      className="U-avt"
                      style={{ cursor: "pointer" }}
                      onClick={() => flyToTarget(PartnerPosition)}
                    />
                    <div className="U-name">
                      {partner?.lastname + " " + partner?.firstname}
                    </div>
                  </div>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
        <div className="Location-right d-none d-md-flex col-md-3"></div>
      </div>
    </div>
  );
};

export default Location;
