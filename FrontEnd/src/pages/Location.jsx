import { useEffect, useState, useContext } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import io from "socket.io-client";
import { AppContext } from "../context/AppContext";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Tọa độ mặc định Hà Nội
const DEFAULT_LAT = 21.0278;
const DEFAULT_LNG = 105.8342;

function Location() {
  const { userData } = useContext(AppContext);
  const [locations, setLocations] = useState({});
  const [socket, setSocket] = useState(null);

  const userId = userData?.id;

  // Tạo socket khi có userId
  useEffect(() => {
    if (!userId) return;
    const s = io(backendUrl, { transports: ["websocket"] });
    setSocket(s);

    s.on("locationUpdated", (data) => {
      setLocations((prev) => ({ ...prev, [data.userId]: data }));
    });

    return () => {
      s.disconnect();
    };
  }, [userId]);

  // Gửi vị trí định kỳ
  useEffect(() => {
    if (!userId || !socket) return;

    const sendLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((pos) => {
          const { latitude, longitude } = pos.coords;
          socket.emit("updateLocation", { userId, latitude, longitude });
          setLocations((prev) => ({
            ...prev,
            [userId]: { latitude, longitude },
          }));
        });
      }
    };

    const interval = setInterval(sendLocation, 5000);
    sendLocation(); // gửi ngay khi load

    return () => clearInterval(interval);
  }, [userId, socket]);

  // Lấy vị trí cuối cùng khi load
  useEffect(() => {
    if (!userId) return;

    const getLastLocation = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/user/location/${userId}`
        );
        const data = response.data;
        if (data) {
          setLocations((prev) => ({ ...prev, [userId]: data }));
        }
      } catch (error) {
        console.error("Lấy vị trí cuối cùng thất bại:", error);
      }
    };

    getLastLocation();
  }, [userId]);

  // Lấy center map: nếu có tọa độ hợp lệ, dùng user; nếu không, Hà Nội
  const userLoc = locations[userId];
  const center =
    userLoc && userLoc.latitude != null && userLoc.longitude != null
      ? [userLoc.latitude, userLoc.longitude]
      : [DEFAULT_LAT, DEFAULT_LNG];

  return (
    <div className="Location-container container-fluid">
      <div className="Location-content row pt-3">
        <div className="Location-left d-none d-md-flex col-md-3"></div>
        <div className="Location-mid col-12 col-md-6">
          <MapContainer center={center} zoom={13} style={{ height: "500px" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {Object.keys(locations).map((id) => {
              const loc = locations[id];
              if (!loc || loc.latitude == null || loc.longitude == null)
                return null;

              return (
                <Marker key={id} position={[loc.latitude, loc.longitude]}>
                  <Popup>User: {id}</Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>
        <div className="Location-right d-none d-md-flex col-md-3"></div>
      </div>
    </div>
  );
}

export default Location;
