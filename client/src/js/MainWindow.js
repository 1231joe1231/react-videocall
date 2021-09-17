import React, { useState } from "react";
import Background from "smart-background";
import PropTypes from "prop-types";

function MainWindow({ startCall, clientId }) {
  const [friendID, setFriendID] = useState(null);
  const symbols = [
    "乾",
    "坤",
    "震",
    "巽",
    "坎",
    "离",
    "艮",
    "兑",
    "天",
    "地",
    "雷",
    "风",
    "水",
    "火",
    "山",
    "泽",
  ];

  /**
   * Start the call with or without video
   * @param {Boolean} video
   */
  const callWithVideo = (video) => {
    const config = { audio: true, video };
    return () => friendID && startCall(true, friendID, config);
  };

  const handleChange = (event) => {
    // console.log(event.target.checked);
    localStorage.setItem("USETURN", event.target.checked);
  };

  return (
    <Background
      underlayImage="linear-gradient(to right, #757575 0%, #494949 100%)"
      symbolsStyle={{ color: "rgba(255,255,255,0.8)" }}
      symbolSize={50}
      gap={50}
      animation={{ type: "right", speed: 5 }}
      rotate={45}
      symbols={symbols}
    >
      <div className="container main-window">
        <div>
          <h3>
            Hi, your ID is
            <input
              type="text"
              className="txt-clientId"
              defaultValue={clientId}
              readOnly
            />
          </h3>
          <h4>Get started by calling a friend below</h4>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <div
            style={{ fontSize: "18px", marginRight: 20, textAlign: "center" }}
          >
            Use TURN server:
          </div>
          <input
            style={{ width: 20, height: 20, margin: 0 }}
            type="checkbox"
            name="name"
            onChange={handleChange}
          />
        </div>
        <div>
          <input
            type="text"
            className="txt-clientId"
            spellCheck={false}
            placeholder="Your friend ID"
            onChange={(event) => setFriendID(event.target.value)}
          />
          <div>
            <button
              type="button"
              className="btn-action fa fa-video-camera"
              onClick={callWithVideo(true)}
            />
            <button
              type="button"
              className="btn-action fa fa-phone"
              onClick={callWithVideo(false)}
            />
          </div>
        </div>
      </div>
    </Background>
  );
}

MainWindow.propTypes = {
  clientId: PropTypes.string.isRequired,
  startCall: PropTypes.func.isRequired,
};

export default MainWindow;
