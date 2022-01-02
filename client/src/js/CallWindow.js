import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import Draggable from "react-draggable";
import "regenerator-runtime/runtime";
// import { result } from 'lodash';

const getButtonClass = (icon, enabled) => classnames(`btn-action fa ${icon}`, { disable: !enabled });
// const pos = null;
function CallWindow({
  peerSrc,
  localSrc,
  config,
  mediaDevice,
  status,
  endCall,
}) {
  const peerVideo = useRef(null);
  const localVideo = useRef(null);
  const [video, setVideo] = useState(config.video);
  const [audio, setAudio] = useState(config.audio);
  const [expand, setExpand] = useState(false);
  const [userCamera, setUserCamera] = useState(true);

  useEffect(() => {
    if (peerVideo.current && peerSrc) peerVideo.current.srcObject = peerSrc;
    if (localVideo.current && localSrc) localVideo.current.srcObject = localSrc;
  });

  useEffect(() => {
    console.log(mediaDevice);
    if (mediaDevice) {
      mediaDevice.toggle("Video", video);
      mediaDevice.toggle("Audio", audio);
    }
  });

  let stream;

  const gotDevices = (deviceInfos) => {
    window.deviceInfos = deviceInfos; // make available to console
    console.log('Available input and output devices:', deviceInfos);
    for (const deviceInfo of deviceInfos) {
      const option = document.createElement('option');
      option.value = deviceInfo.deviceId;
      if (deviceInfo.kind === 'audioinput') {
        option.text = deviceInfo.label || `Microphone ${audioSelect.length + 1}`;
        audioSelect.appendChild(option);
      } else if (deviceInfo.kind === 'videoinput') {
        option.text = deviceInfo.label || `Camera ${videoSelect.length + 1}`;
        videoSelect.appendChild(option);
      }
    }
  }

  const toggleCamera = async (facingMode) => {
    const options = {
      audio: true,
      video: {
        facingMode,
      },
    };

    try {
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
      stream = await navigator.mediaDevices.getUserMedia(options);
    } catch (e) {
      alert(e);
      return;
    }
    localVideo.current.srcObject = null;
    localVideo.current.srcObject = stream;
    localVideo.current.play();
  };

  /**
   * Turn on/off a media device
   * @param {String} deviceType - Type of the device eg: Video, Audio
   */
  const toggleMediaDevice = (deviceType) => {
    if (deviceType === "video") {
      setVideo(!video);
      mediaDevice.toggle("Video");
    }
    if (deviceType === "audio") {
      setAudio(!audio);
      mediaDevice.toggle("Audio");
    }
  };

  const togglePIP = () => {
    // if (!pip) {
    //   console.log('pip!');
    //   peerVideo.current.requestPictureInPicture().catch((err) => {
    //     console.log(err);
    //   });
    // } else {
    //   console.log('exit pip!');
    //   document.exitPictureInPicture();
    // }
    // setPip(!pip);
    peerVideo.current.requestPictureInPicture();
  };

  return (
    <div className={classnames("call-window", status)}>
      <video id="peerVideo" ref={peerVideo} autoPlay />
      <Draggable bounds="parent" key={expand}>
        <video
          id="localVideo"
          ref={localVideo}
          autoPlay
          muted
          style={{
            bottom: 0,
            left: 0,
            width: expand ? "100%" : "20%",
            height: expand ? "100%" : "20%",
          }}
        />
      </Draggable>
      <div className="video-control">
        <button
          key="btnVideo"
          type="button"
          className={getButtonClass("fa-video-camera", video)}
          onClick={() => toggleMediaDevice("video")}
        />
        <button
          key="btnSwitchCamera"
          type="button"
          className={getButtonClass("fa-retweet", video)}
          onClick={() => {
            const cam = userCamera ? "environment" : "user";
            toggleCamera(cam);
            setUserCamera(!userCamera);
          }}
        />
        <button
          key="btnPIP"
          type="button"
          className={getButtonClass("fa-picture-o", video)}
          onClick={() => togglePIP()}
        />
        <button
          key="btnExpand"
          type="button"
          className={getButtonClass("fa-expand", video)}
          onClick={() => {
            setExpand(!expand);
          }}
        />
        <button
          key="btnAudio"
          type="button"
          className={getButtonClass("fa-microphone", audio)}
          onClick={() => toggleMediaDevice("audio")}
        />
        <button
          type="button"
          className="btn-action hangup fa fa-phone"
          onClick={() => endCall(true)}
        />
      </div>
    </div>
  );
}

CallWindow.propTypes = {
  status: PropTypes.string.isRequired,
  localSrc: PropTypes.object, // eslint-disable-line
  peerSrc: PropTypes.object, // eslint-disable-line
  config: PropTypes.shape({
    audio: PropTypes.bool.isRequired,
    video: PropTypes.bool.isRequired,
  }).isRequired,
  mediaDevice: PropTypes.object, // eslint-disable-line
  endCall: PropTypes.func.isRequired,
};

export default CallWindow;
