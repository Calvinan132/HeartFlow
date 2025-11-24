import React, { useRef, useEffect, useState, useContext } from "react";
import * as maptilersdk from "@maptiler/sdk";
import "@maptiler/sdk/dist/maptiler-sdk.css";

import "./Location.scss";
import Sidebar from "../components/Sidebar";
import { AppContext } from "../context/AppContext";

const createAvatarElement = (imageUrl) => {
  // 1. Tạo container DIV
  const el = document.createElement("div");
  el.className = "user-avatar-marker";

  // 2. Tạo thẻ IMG
  const img = document.createElement("img");
  img.src =
    imageUrl ||
    "https://imgs.search.brave.com/XKHwkUJVX5C6T9eyq9OuzsyxHAzohp2u7jphVtP-fxM/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMudmVjdGVlenku/Y29tL3N5c3RlbS9y/ZXNvdXJjZXMvdGh1/bWJuYWlscy8wNjUv/NDEyLzcyNy9zbWFs/bC91c2VyLWF2YXRh/ci1pbGx1c3RyYXRp/b24tdmVjdG9yLmpw/Zw";
  img.alt = "User Avatar";
  img.style.width = `${50}px`;
  img.style.height = `${50}px`;
  img.style.borderRadius = "50%";
  img.style.border = "3px solid #0070FF";
  img.style.display = "block";

  // 3. Gắn IMG vào DIV
  el.appendChild(img);
  return el;
};

let Location = () => {
  const [MyLocation, setLocation] = useState(null);
  const { userData } = useContext(AppContext);

  const mapContainer = useRef(null);
  const map = useRef(null);
  const markerRef = useRef(null);
  const defaultMap = { lng: 106.782185, lat: 10.882525 };
  const zoom = 14;
  maptilersdk.config.apiKey = "coLElzBKgIUlXPeQiouU";

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      alert("Trình duyệt không hỗ trợ Geolocation.");
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    const success = (position) => {
      // Hàm này sẽ được gọi nhiều lần khi vị trí thay đổi
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    };

    const handleError = (err) => {
      // Xử lý lỗi (ví dụ: người dùng từ chối hoặc GPS bị mất)
      console.log(`Lỗi (${err.code}): ${err.message}.`);
      // Có thể dùng setLocation(defaultMap) để đặt lại vị trí mặc định nếu cần
    };

    // Bắt đầu theo dõi vị trí
    const watchId = navigator.geolocation.watchPosition(
      success,
      handleError,
      options
    );

    // Hàm dọn dẹp (Cleanup)
    // Hàm này sẽ chạy khi component unmount
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
        console.log("Đã dừng theo dõi vị trí.");
      }
    };
  }, []);

  useEffect(() => {
    if (map.current) return; // stops map from intializing more than once

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      center: [defaultMap.lng, defaultMap.lat],
      zoom: zoom,
    });
  }, [defaultMap.lng, defaultMap.lat, zoom]);

  useEffect(() => {
    // Chỉ chạy khi bản đồ đã khởi tạo VÀ đã có vị trí MyLocation
    if (map.current && MyLocation) {
      const userLngLat = [MyLocation.longitude, MyLocation.latitude];

      // 1. Thêm hoặc cập nhật Marker
      if (markerRef.current) {
        // Nếu Marker đã tồn tại, chỉ cần cập nhật vị trí
        markerRef.current.setLngLat(userLngLat);
      } else {
        // Nếu Marker chưa tồn tại, tạo mới, gán vào Ref và thêm vào bản đồ
        const avatarEl = createAvatarElement(userData?.image_url);
        markerRef.current = new maptilersdk.Marker({
          element: avatarEl,
          anchor: "bottom",
        })
          .setLngLat(userLngLat)
          .addTo(map.current);
      }

      // 2. Di chuyển tâm bản đồ đến vị trí người dùng (chỉ khi có vị trí mới)
      map.current.flyTo({ center: userLngLat, zoom: 16 });
    }
  }, [MyLocation]);

  console.log(MyLocation);
  return (
    <div className="Location-container container-fluid">
      <div className="Location-content row pt-3">
        <div className="Location-left d-none d-md-flex col-md-3">
          <Sidebar></Sidebar>
        </div>
        <div className="Location-mid col-12 col-md-6">
          <div className="wrap-map">
            <div className="map" ref={mapContainer}></div>
          </div>
        </div>
        <div className="Location-right d-none d-md-flex col-md-3"></div>
      </div>
    </div>
  );
};

export default Location;
