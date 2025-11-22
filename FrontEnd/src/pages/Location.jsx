import { useEffect, useState, useContext } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import io from "socket.io-client";
import { AppContext } from "../context/AppContext";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

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

    fetch(`${backendUrl}/api/location/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data) setLocations((prev) => ({ ...prev, [userId]: data }));
      });
  }, [userId]);

  // center map theo vị trí user đầu tiên nếu có
  const center = locations[userId]
    ? [locations[userId].latitude, locations[userId].longitude]
    : [0, 0];

  return (
    <div className="Location-container container-fluid">
      <div className="Location-content row pt-3">
        <div className="Location-left d-none d-md-flex col-md-3"></div>
        <div className="Location-mid col-12 col-md-6">
          <MapContainer center={center} zoom={13} style={{ height: "500px" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {Object.keys(locations).map((id) => (
              <Marker
                key={id}
                position={[locations[id].latitude, locations[id].longitude]}
              >
                <Popup>User: {id}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
        <div className="Location-right d-none d-md-flex col-md-3"></div>
      </div>
    </div>
  );
}

export default Location;
