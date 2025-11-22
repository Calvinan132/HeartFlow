import Sidebar from "../components/Sidebar";
import "leaflet/dist/leaflet.css";
import "./Location.scss";
import { AppContext } from "../context/AppContext";
import axios from "axios";

import { useState, useEffect, useContext } from "react";
import io from "socket.io-client";
import { getDistance } from "geolib";
// Import các thành phần của Leaflet
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";

const createAvatarIcon = (url) => {
  return new L.Icon({
    iconUrl: url,
    iconSize: [50, 50], // Kích thước
    iconAnchor: [25, 25], // Tâm ảnh trùng với tọa độ (giữa ảnh)
    className: "avatar-icon", // Class CSS để bo tròn
  });
};

function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 15); // Hiệu ứng bay tới vị trí mới
    }
  }, [center, map]);
  return null;
}

const backendUrl = import.meta.env.VITE_BACKEND_URL;
const socket = io.connect(backendUrl, {
  transports: ["websocket"],
});

let Location = () => {
  const { userData, token } = useContext(AppContext);

  const [partnerData, setPartnerData] = useState(null);
  const [roomId, setRoomId] = useState(null);
  const [myLocation, setMyLocation] = useState(null);
  const [partnerLocation, setPartnerLocation] = useState(null);
  const [distance, setDistance] = useState(null);

  let loadInfoPartner = async (userId) => {
    try {
      const res = await axios.get(backendUrl + `/api/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPartnerData(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    loadInfoPartner(userData?.partner);
  }, [userData?.partner]);

  useEffect(() => {
    socket.on("room_joined", (id) => setRoomId(id));
    socket.on("receive_location", (data) => {
      setPartnerLocation({ lat: data.lat, lng: data.lng });
    });
    return () => {
      socket.off("room_joined");
      socket.off("receive_location");
    };
  }, []);

  useEffect(() => {
    if (roomId) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const pos = { lat: latitude, lng: longitude };
          setMyLocation(pos);
          socket.emit("send_location", { roomId, ...pos });
        },
        (err) => console.error(err),
        { enableHighAccuracy: true }
      );
      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [roomId]);

  useEffect(() => {
    if (myLocation && partnerLocation) {
      const dist = getDistance(myLocation, partnerLocation);
      setDistance((dist / 1000).toFixed(2));
    }
  }, [myLocation, partnerLocation]);

  return (
    <div className="Location-container container-fluid">
      <div className="Location-content row pt-3">
        <div className="Location-left d-none d-md-flex col-md-3">
          <Sidebar></Sidebar>
        </div>
        <div className="Location-mid col-12 col-md-6">
          <div style={{ position: "relative", height: "100vh", width: "100%" }}>
            {/* Thanh thông tin nổi (Overlay) */}
            <div
              style={{
                position: "absolute",
                top: 20,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 1000, // Z-index cao để đè lên bản đồ Leaflet
                background: "rgba(255, 255, 255, 0.9)",
                padding: "10px 20px",
                borderRadius: "30px",
                display: "flex",
                alignItems: "center",
                gap: "15px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            >
              <img
                src={userData?.image_url}
                style={{ width: 40, height: 40, borderRadius: "50%" }}
              />
              <span style={{ fontWeight: "bold", color: "#E91E63" }}>
                {distance ? `${distance} km` : "Đang dò tìm..."}
              </span>
              {partnerData && (
                <img
                  src={partnerData.image_url}
                  style={{ width: 40, height: 40, borderRadius: "50%" }}
                />
              )}
            </div>

            {/* Map Container */}
            <MapContainer
              center={[21.0285, 105.8542]} // Mặc định Hà Nội
              zoom={13}
              style={{ height: "100%", width: "100%" }}
            >
              {/* Tile Layer: Nguồn bản đồ miễn phí từ OpenStreetMap */}
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Component tự động pan bản đồ theo vị trí của mình */}
              {myLocation && <MapUpdater center={myLocation} />}

              {/* Marker của TÔI */}
              {myLocation && (
                <Marker
                  position={[myLocation.lat, myLocation.lng]}
                  icon={createAvatarIcon(userData?.image_url)}
                >
                  <Popup>Vị trí của bạn</Popup>
                </Marker>
              )}

              {/* Marker của PARTNER */}
              {partnerLocation && partnerData && (
                <Marker
                  position={[partnerLocation.lat, partnerLocation.lng]}
                  icon={createAvatarIcon(partnerData.image_url)}
                >
                  <Popup>Người ấy đang ở đây ❤️</Popup>
                </Marker>
              )}

              {/* Đường nối 2 người */}
              {myLocation && partnerLocation && (
                <Polyline
                  positions={[
                    [myLocation.lat, myLocation.lng],
                    [partnerLocation.lat, partnerLocation.lng],
                  ]}
                  pathOptions={{ color: "red", weight: 4, dashArray: "10, 10" }} // Đường đứt nét màu đỏ
                />
              )}
            </MapContainer>
          </div>
        </div>
        <div className="Location-right d-none d-md-flex col-md-3"></div>
      </div>
    </div>
  );
};

export default Location;
