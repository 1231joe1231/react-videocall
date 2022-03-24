/* eslint-disable jsx-a11y/media-has-caption */
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
  const [audioOutputList, setAudioOutputList] = useState([]);

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
    // eslint-disable-next-line no-restricted-syntax
    for (const deviceInfo of deviceInfos) {
      const option = {};
      option.value = deviceInfo.deviceId;
      if (deviceInfo.kind === 'audiooutput') {
        option.name = deviceInfo.label;
        setAudioOutputList((prev) => [...prev, option]);
      }
    }
  };

  const handleError = (error) => {
    console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
  };

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(gotDevices).catch(handleError);
  }, []);

  function attachSinkId(sinkId) {
    if (typeof peerVideo.current.sinkId !== 'undefined') {
      peerVideo.current.setSinkId(sinkId)
        .then(() => {
          console.log(`Success, audio output device attached: ${sinkId}`);
        })
        .catch((error) => {
          let errorMessage = error;
          if (error.name === 'SecurityError') {
            errorMessage = `You need to use HTTPS for selecting audio output device: ${error}`;
          }
          console.error(errorMessage);
        });
    } else {
      console.warn('Browser does not support output device selection.');
    }
  }

  const handleAudioOutputSelectChange = (event) => {
    console.log("设置音频输出为", event.target.value);
    // setAudioOutputSelect(event.target.value);
    attachSinkId(event.target.value);
  };

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
        <select className="select" onChange={handleAudioOutputSelectChange}>
          {audioOutputList.map((o) => <option className="select-option" key={o.value} value={o.value}>{o.name}</option>)}
        </select>
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
    audioOutputSource: PropTypes.string,
  }).isRequired,
  mediaDevice: PropTypes.object, // eslint-disable-line
  endCall: PropTypes.func.isRequired,
};

export default CallWindow;
