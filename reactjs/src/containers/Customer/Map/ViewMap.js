import React, { Component } from "react";
import "./ViewMap.scss";
import { Map, TileLayer, Marker, Popup, Tooltip } from "react-leaflet";
import L from "leaflet";
import osm from "./osm-provider";
import "leaflet/dist/leaflet.css";
import markerImage1 from "../../../assets/images/marker.png";
import markerImage2 from "../../../assets/images/marker_icon.png";
import { connect } from "react-redux";
import * as actions from "../../../store/actions";
import { getAllHotpots } from "../../../services/hotpotService";
import { getAllHotpotNameServices } from "../../../services/hotpotService";
import HomeHeader from "../../HomePage/HomeHeader";
import SearchBox from "./SearchBox";
import { point, distance } from "@turf/turf";

const markerIcon1 = new L.Icon({
  iconUrl: markerImage1,
  iconSize: [40, 40],
  iconAnchor: [17, 46],
  popupAnchor: [0, -46],
});

const markerIcon2 = new L.Icon({
  iconUrl: markerImage2,
  iconSize: [25, 35],
  iconAnchor: [17, 46],
  popupAnchor: [0, -46],
});

class ViewMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      arrHotpots: [],
      center: { lat: 21.0277644, lng: 105.8341598 },
      ZOOM_LEVEL: 12,
      location: {
        loaded: false,
        coordinates: { lat: "", lng: "" },
        error: null,
      },
      selectPosition: "",
      currentPosition: null,
      nearestHotpots: [],
    };
    this.mapRef = React.createRef();
  }

  async componentDidMount() {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(this.onSuccess, this.onError);
    } else {
      this.onError({ code: 0, message: "Geolocation not supported" });
    }
    let res = await getAllHotpotNameServices();
    console.log("RES", res);
    if (res && res.errCode === 0) {
      this.setState({
        arrHotpots: res.data,
      });
    }
    const arr = this.nearestHotpots;
    if (!arr) {
      this.setState({
        nearestHotpots: res.data,
      });
    }
  }

  onSuccess = (location) => {
    this.setState({
      location: {
        loaded: true,
        coordinates: {
          lat: location.coords.latitude,
          lng: location.coords.longitude,
        },
        error: null,
      },
      center: {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      },
    });
  };

  onError = (error) => {
    this.setState({
      location: {
        loaded: true,
        coordinates: { lat: "", lng: "" },
        error: {
          code: error.code,
          message: error.message,
        },
      },
    });
  };

  showMyLocation = () => {
    const { location, ZOOM_LEVEL } = this.state;
    if (location.loaded && !location.error) {
      // Lấy vị trí hiện tại từ state và cập nhật nó
      const currentPosition = {
        lat: location.coordinates.lat,
        lng: location.coordinates.lng,
      };
      this.setState({ currentPosition });

      // Di chuyển bản đồ đến vị trí hiện tại
      this.mapRef.current.leafletElement.flyTo(
        [location.coordinates.lat, location.coordinates.lng],
        ZOOM_LEVEL,
        { animate: true }
      );
    } else {
      alert(location.error.message);
    }
  };

  handleViewDetailHotpot = (hotpot) => {
    this.props.history.push(`/detail-hpHotpot/${hotpot.id}`);
  };

  calculateDistance = (lat1, lon1, lat2, lon2) => {
    // Tạo các điểm từ tọa độ
    const point1 = point([lon1, lat1]);
    const point2 = point([lon2, lat2]);

    // Tính toán khoảng cách giữa hai điểm
    const dis = distance(point1, point2);

    return dis;
  };

  getNearestHotpots = (position) => {
    const { arrHotpots } = this.state;
    const { lat, lon } = position;

    // Tính toán khoảng cách giữa điểm đã chọn và tất cả các điểm nhà hàng
    const distances = arrHotpots.map((hotpot) => {
      return {
        hotpot,
        distance: this.calculateDistance(
          lat,
          lon,
          hotpot.latitude,
          hotpot.longitude
        ),
      };
    });

    // Sắp xếp các điểm nhà hàng theo khoảng cách tăng dần
    distances.sort((a, b) => a.distance - b.distance);

    // Chọn 5 nhà hàng gần nhất
    const nearestHotpots = distances.slice(0, 5);
    this.setState({ nearestHotpots: nearestHotpots });
  };

  handelSelectPosition = (position) => {
    this.setState({
      selectPosition: position,
      currentPosition: null,
      // center: { lat: position.lat, lng: position.lon },
    });
    // Lấy tham chiếu tới bản đồ
    const map = this.mapRef.current.leafletElement;
    // Di chuyển bản đồ đến vị trí mới với hiệu ứng mượt mà
    map.flyTo([position.lat, position.lon], this.state.ZOOM_LEVEL, {
      animate: true,
    });

    this.getNearestHotpots(position);
  };

  handleClearPlace = () => {
    // Gọi hàm showMyLocation để thực hiện chức năng "Locate Me"
    this.showMyLocation();
  };

  render() {
    let {
      center,
      ZOOM_LEVEL,
      location,
      arrHotpots,
      selectPosition,
      currentPosition,
      nearestHotpots,
    } = this.state;
    console.log("nearestHotpots", nearestHotpots);
    console.log("arrHotpots", arrHotpots);

    return (
      <div>
        <HomeHeader isShowBanner={false} />
        <div className="body-container">
          <div className="list-res">
            <div className="name-des">Nhà hàng gần bạn</div>

            {nearestHotpots.map((item, idex) => {
              let imageBase64 = "";
              if (item.hotpot) {
                item = item.hotpot;
              } else {
                item = item;
              }
              let name = `${item.name}`;
              if (item.image) {
                imageBase64 = new Buffer(item.image, "base64").toString(
                  "binary"
                );
              }
              return (
                <div className="res">
                  <div className="image">
                    <div
                      className="bg-image"
                      style={{
                        backgroundImage: `url(${imageBase64})`,
                      }}
                    />
                  </div>
                  <div className="info">
                    <div className="name">{name}</div>
                    <div className="address">{item.note}</div>
                    <div className="more">
                      <div>Đánh giá: Tốt</div>
                      <div>PHÙ HỢP:Đặt tiệc, tiếp khách, gia đình,</div>
                      <div>bạn bè, sinh nhật, liên hoan…</div>
                      <div>KHÔNG GIAN:</div>
                      <div>- Hiện đại. Trẻ trung</div>
                      <div>- Sức chứa: 120 khách (02 tầng)</div>{" "}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="map-container">
            <div className="search-box">
              <SearchBox
                selectPosition={selectPosition}
                handelSelectPosition={this.handelSelectPosition}
                handleClearPlace={this.handleClearPlace}
              />
            </div>
            <div className="map-body">
              {/* <div className="btn-locate justify-content-center">
            <button className="btn btn-primary" onClick={this.showMyLocation}>
              Locate Me <i className="fas fa-globe"></i>
            </button>
          </div> */}

              <div className="map text-center">
                <Map center={center} zoom={ZOOM_LEVEL} ref={this.mapRef}>
                  <TileLayer
                    url={osm.maptiler.url}
                    attribution={osm.maptiler.attribution}
                  />
                  {selectPosition && !currentPosition ? (
                    <Marker
                      icon={markerIcon1}
                      position={[selectPosition.lat, selectPosition.lon]}
                    ></Marker>
                  ) : (
                    location.loaded &&
                    !location.error && (
                      <Marker
                        icon={markerIcon1}
                        position={[
                          location.coordinates.lat,
                          location.coordinates.lng,
                        ]}
                      ></Marker>
                    )
                  )}
                  {arrHotpots.map((item, idex) => {
                    let imageBase64 = "";
                    let name = `${item.name}`;
                    if (item.image) {
                      imageBase64 = new Buffer(item.image, "base64").toString(
                        "binary"
                      );
                    }
                    return (
                      <Marker
                        //position={[10.7285492637418, 106.616285747586]}
                        position={[item.latitude, item.longitude]}
                        icon={markerIcon2}
                        key={idex}
                        riseOnHover={true}
                        riseOffset={200}
                        //onClick={() => this.handleViewDetailHotpot(item)}
                      >
                        <Tooltip
                          className="tool-tip"
                          direction="bottom"
                          offset={[0, -10]}
                          opacity={1}
                        >
                          <div className="customize-border">
                            <div className="image">
                              <div
                                className="bg-image section-hotpot"
                                style={{
                                  backgroundImage: `url(${imageBase64})`,
                                }}
                              />
                            </div>
                            <div className="info">
                              <div className="name">{name}</div>
                              <div className="address">{item.note}</div>
                              <div className="more">
                                <div>Đánh giá: Tốt</div>
                                <div>
                                  PHÙ HỢP:Đặt tiệc, tiếp khách, gia đình,
                                </div>
                                <div>bạn bè, sinh nhật, liên hoan…</div>
                                <div>KHÔNG GIAN:</div>
                                <div>- Hiện đại. Trẻ trung</div>
                                <div>- Sức chứa: 120 khách (02 tầng)</div>{" "}
                              </div>
                            </div>
                          </div>
                        </Tooltip>
                        {/* <Popup open={true}>
                    <b className="detail-hotpot">
                      {item.name}, {item.address}
                    </b>
                  </Popup> */}
                      </Marker>
                    );
                  })}
                </Map>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isLoggedIn: state.user.isLoggedIn,
    language: state.app.language,
  };
};

//fire events của redux
const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(ViewMap);
