import axios from 'axios'

// get our environment variable specified in the .env* file
const BASE_URL = process.env.REACT_APP_REST_API_HOST;

export {
  getActuators,
  putActuatorState,
  deleteActuatorState,
  getSettings,
  postSettings,
  getDataReadings,
  getGreenhouseServerState
};

function getSettings() {
  const url = `${BASE_URL}/settings`;
  return axios.get(url).then(response => response.data);
}

function postSettings(settings) {
  const url = `${BASE_URL}/settings`;
  return axios.post(url, settings);
}

function getActuators() {
  const url = `${BASE_URL}/actuators`;
  return axios.get(url).then(response => response.data).catch(error => console.log(error));
}

function putActuatorState(name) {
  const url = `${BASE_URL}/actuators/${name}/state`;
  return axios.put(url, {
    headers: {
      "Content-Length": "0"
    }
  }).catch(error => console.log(error));
}

function deleteActuatorState(name) {
  const url = `${BASE_URL}/actuators/${name}/state`;
  return axios.delete(url).catch(error => console.log(error));
}

function getDataReadings(type, startTime, endTime) {
  const url = `${BASE_URL}/data_readings`;
  return axios.get(url, {
    params: {
      type: type,
      start_time: startTime,
      end_time: endTime
    }
  }).then(response => response.data);
}

function getGreenhouseServerState(startTime, endTime) {
  const url = `${BASE_URL}/greenhouse_server_state`;
  return axios.get(url, {
    params: {
      start_time: startTime,
      end_time: endTime
    }
  }).then(response => response.data);
}