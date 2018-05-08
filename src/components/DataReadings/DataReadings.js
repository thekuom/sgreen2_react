import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Section from '../Section/Section';
import {getDataReadings, getGreenhouseServerState} from '../../utils/sgreen-api';
import 'react-vis/dist/style.css';
import Graph from './Graph/Graph';

import styles from './DataReadings.module.scss';

class DataReadings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      temp: undefined,
      humid: undefined,
      light: undefined,
      soil: undefined,
      batt: undefined,
      serverState: undefined
    };

    this.getAllDataReadings = this.getAllDataReadings.bind(this);
  }

  /**
   * Gets the data readings and then groups them by sensor for easier graphing
   * @param type the type of the data to get
   * @param startTime the start time (milliseconds after the Epoch)
   * @param endTime the end time (milliseconds after the Epoch)
   */
  getDataReadings(type, startTime, endTime) {
    getDataReadings(type, startTime, endTime).then(data => {
      if (data.length > 0) {
        let groupedData = [];
        const type = data[0].sensor.type;

        let prevSensor = undefined;
        data.forEach(reading => {
          /*
              since all the data readings are sorted by name we can tell
              when we've reached new sensor data by checking the current
              sensor name vs the last one we saw.
            */
          if (prevSensor !== reading.sensor.name) {
            groupedData.push({
              sensor: reading.sensor.name,
              readings: []
            });

            if (type === "batt" && "health" in reading) {
              groupedData[groupedData.length - 1].health = reading.health;
            } else {
              groupedData[groupedData.length - 1].health = "n/a";
            }
          }

          // we will graph time in the x-axis and value in the y-axis (duh)
          groupedData[groupedData.length - 1].readings.push({
            x: reading.timestamp,
            y: reading.reading
          });

          prevSensor = reading.sensor.name;
        });

        /*
            [type] is replaced by the value of type, so if type == "soil",
            then the statement becomes

            this.setState({
              soil: groupedData
            })

            How convenient!
          */
        this.setState({
          [type]: groupedData
        });
      }
    });
  }

  static formatLastCheckedDate(date) {
    return date.getMonth() + "/" + date.getDate() + " " + date.getHours() + ":" +
        date.getMinutes().toString().padStart(2, "0");
  }

  getGreenhouseServerState(startTime, endTime) {
    getGreenhouseServerState(startTime, endTime).then(data => {
      if (data.length > 0) {
        const checkedTime = new Date(data[0].timestamp);
        this.setState({
          serverState: {
            lastChecked: DataReadings.formatLastCheckedDate(checkedTime),
            state: data[0].state
          }
        });
      } else {
        this.setState({
          serverState: {
            lastChecked: DataReadings.formatLastCheckedDate(new Date()),
            state: false
          }
        });
      }
    })
  }

  /**
   * Just a wrapper for getting all the data readings
   */
  getAllDataReadings() {
    // TODO: user configured ranges?
    const oneMinuteAgo = new Date().getTime() - (60 * 1000);
    const thirtyMinutesAgo = new Date().getTime() - (30 * 60 * 1000);
    const threeDaysAgo = new Date().getTime() - (3 * 24 * 60 * 60 * 1000);
    const oneDayAgo = new Date().getTime() - (24 * 60 * 60 * 1000);
    this.getDataReadings("temp", thirtyMinutesAgo);
    this.getDataReadings("humid", thirtyMinutesAgo);
    this.getDataReadings("soil", threeDaysAgo);
    this.getDataReadings("batt", oneDayAgo);
    this.getGreenhouseServerState(oneMinuteAgo);
  }

  /**
   * Look up intervals in react. This will get the data readings
   * and then continue getting them every 4 seconds.
   */
  componentDidMount() {
    this.getAllDataReadings();
    let intervalId = setInterval(this.getAllDataReadings, 4000);
    this.setState({intervalId: intervalId});
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  render() {
    return (
        <Section name="Data Readings" color={this.props.color}>
          {this.state.serverState !== undefined ?
              <div>
                <span
                    className={[styles.dot, (this.state.serverState.state ? styles.active : styles.inactive)].join(" ")}/>
                Greenhouse is {this.state.serverState.state ? "up" : "down"}. Last
                checked: {this.state.serverState.lastChecked}
              </div>
              : null}
          <div className={styles.flex}>
            {this.state.temp !== undefined ?
                <div className={styles.graphLarge}>
                  <Graph title="Temperature Readings"
                         yAxis="Temp"
                         yUnit={String.fromCharCode(176) + "F"} // degrees
                         items={this.state.temp.map(a => a.sensor)}
                         width={100}
                         height={500}
                         sensorData={this.state.temp}/>
                </div>
                : null}
            {this.state.humid !== undefined ?
                <div className={styles.graphLarge}>
                  <Graph title="Humidity Readings"
                         yAxis="Humidity"
                         yUnit="%"
                         width={1000}
                         height={500}
                         items={this.state.humid.map(a => a.sensor)}
                         sensorData={this.state.humid}/>
                </div>
                : null}
            {this.state.soil !== undefined ?
                <div className={styles.graphLarge}>
                  <Graph title="Soil Moisture Readings"
                         yAxis="Soil Moisture"
                         yUnit="%"
                         width={1000}
                         height={500}
                         items={this.state.soil.map(a => a.sensor)}
                         sensorData={this.state.soil}/>
                </div>
                : null}
            {this.state.batt !== undefined ?
                <div>
                  <h3>Battery Levels</h3>
                  {this.state.batt.map(sensor =>
                      <div>
                        {sensor.sensor}: {sensor.health}
                      </div>
                  )}
                </div>
                : null}
          </div>
        </Section>
    );
  }
}

DataReadings.propTypes = {
  color: PropTypes.string
};

export default DataReadings;