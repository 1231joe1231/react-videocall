/* eslint-disable no-restricted-syntax */
import React, { useState, useEffect } from "react";
import Background from "smart-background";
import PropTypes from "prop-types";

function MainWindow({ startCall, clientId }) {
  const [friendID, setFriendID] = useState(null);
  const [audioInputSelect, setAudioInputSelect] = useState({ value: null });
  const [audioInputList, setAudioInputList] = useState([]);
  const [videoSelect, setVideoSelect] = useState({ value: null });
  const [videoList, setVideoList] = useState([]);
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
    if (audioInputSelect && videoSelect) {
      config.audioSource = audioInputSelect.value;
      config.videoSource = videoSelect.value;
    }
    return () => friendID && startCall(true, friendID, config);
  };

  const gotDevices = (deviceInfos) => {
    window.deviceInfos = deviceInfos; // make available to console
    console.log('Available input and output devices:', deviceInfos);
    for (const deviceInfo of deviceInfos) {
      const option = {};
      option.value = deviceInfo.deviceId;
      if (deviceInfo.kind === 'audioinput') {
        option.name = deviceInfo.label || `Microphone ${audioInputSelect.length + 1}`;
        setAudioInputList((prev) => [...prev, option]);
      } else if (deviceInfo.kind === 'videoinput') {
        option.name = deviceInfo.label || `Camera ${videoSelect.length + 1}`;
        setVideoList((prev) => [...prev, option]);
      }
    }
    setAudioInputSelect(audioInputList[0]);
    setVideoSelect(videoList[0]);
  };

  const handleError = (error) => {
    console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
  };

  const handleChange = (event) => {
    // console.log(event.target.checked);
    localStorage.setItem("USETURN", event.target.checked);
  };

  const handleAudioInputSelectChange = (event) => {
    console.log("设置音频输入为", event.target.value);
    setAudioInputSelect(event.target.value);
  };

  const handleVideoSelectChange = (event) => {
    console.log("设置视频输入为", event.target.value);
    setVideoSelect(event.target.value);
  };

  useEffect(() => {
    localStorage.setItem("USETURN", false);
    navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);
  }, []);

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
              style={{ marginLeft: 10 }}
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
          <select className="select" onChange={handleAudioInputSelectChange} value={audioInputSelect}>
            {audioInputList.map((o) => <option className="select-option" key={o.value} value={o.name}>{o.name}</option>)}
          </select>
        </div>
        <div>
          <select className="select" onChange={handleVideoSelectChange} value={videoSelect}>
            {videoList.map((o) => <option className="select-option" key={o.value} value={o.name}>{o.name}</option>)}
          </select>
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
