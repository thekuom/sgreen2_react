import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Section from '../Section/Section';
import Toggle from 'react-toggle';
import {getSettings, postSettings} from '../../utils/sgreen-api';

import styles from './Settings.module.scss';

class Settings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isManualMode: false,
      minTemp: '',
      maxTemp: '',
      minSoil: '',
      maxSoil: '',
      lightsStart: '',
      lightsEnd: '',
      wateringTimes: '',
      errorFlushTimes: '',
      emailAddresses: '',
      error: undefined
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  getSettings() {
    getSettings().then(data => {
      this.setState({
        isManualMode: data.is_manual_mode,
        minTemp: data.temperature.min,
        maxTemp: data.temperature.max,
        minSoil: data.soil_moisture.min,
        maxSoil: data.soil_moisture.max,
        lightsStart: data.lights.start_time,
        lightsEnd: data.lights.end_time,
        wateringTimes: data.watering_times.join("\n"),
        errorFlushTimes: data.error_flush_times.join("\n"),
        emailAddresses: data.email_addresses.join("\n")
      });

      this.props.saveHandler(!data.is_manual_mode);
    });
  }

  componentDidMount() {
    this.getSettings();
  }

  /**
   * This makes sure that we keep the state to make form submitting more seamless.
   * Ever submit a form and then it comes back with an error and the entire form is
   * cleared out? This helps prevent that.
   *
   * @param event
   */
  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    // the [name] will be replaced by name a couple lines above this comment
    this.setState({
      [name]: value
    });
  }

  /**
   * We need to construct the body of our request to match the API specifications
   * @param event
   */
  handleSubmit(event) {
    // noinspection JSCheckFunctionSignatures - IntelliJ ignore warning
    const settings = {
      is_manual_mode: this.state.isManualMode,
      temperature: {
        min: this.state.minTemp,
        max: this.state.maxTemp
      },
      soil_moisture: {
        min: this.state.minSoil,
        max: this.state.maxSoil
      },
      lights: {
        start_time: this.state.lightsStart,
        end_time: this.state.lightsEnd
      },
      watering_times: this.state.wateringTimes.split("\n").filter(val => val),  // filter out empty, undefined, null
      error_flush_times: this.state.errorFlushTimes.split("\n").filter(val => val),
      email_addresses: this.state.emailAddresses.split("\n").filter(val => val)
    };


    postSettings(settings)
        .then(() => {
          this.setState({error: undefined});
          this.props.saveHandler(!this.state.isManualMode);
        })
        .catch(error => this.setState({error: error.response.data.message}));

    event.preventDefault();
  }

  render() {
    return (
        <Section name="Settings" color={this.props.color}>
          <form className={styles.form} onSubmit={this.handleSubmit}>
            <div className={styles.field}>
              <label className={styles.inlineLabel}>Manual Mode</label>
              <Toggle defaultChecked={this.state.isManualMode} onChange={this.handleInputChange}
                      name="isManualMode"/>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Temperature (&deg;F)</label>
              <input className={styles.input} type="text" name="minTemp" value={this.state.minTemp}
                     onChange={this.handleInputChange}/>
              <span className={styles.dash}>-</span>
              <input className={styles.input} type="text" name="maxTemp" value={this.state.maxTemp}
                     onChange={this.handleInputChange}/>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Soil Moisture (%)</label>
              <input className={styles.input} type="text" name="minSoil" value={this.state.minSoil}
                     onChange={this.handleInputChange}/>
              <span className={styles.dash}>-</span>
              <input className={styles.input} type="text" name="maxSoil" value={this.state.maxSoil}
                     onChange={this.handleInputChange}/>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Lights On Between</label>
              <input className={styles.input} type="text" name="lightsStart" value={this.state.lightsStart}
                     onChange={this.handleInputChange}/>
              <span className={styles.dash}>-</span>
              <input className={styles.input} type="text" name="lightsEnd" value={this.state.lightsEnd}
                     onChange={this.handleInputChange}/>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Watering Times* (line separated)</label><br/>
              <textarea className={styles.textarea} name="wateringTimes"
                        value={this.state.wateringTimes}
                        onChange={this.handleInputChange}/>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Error Flush Times* (line separated)</label><br/>
              <textarea className={styles.textarea} name="errorFlushTimes"
                        value={this.state.errorFlushTimes}
                        onChange={this.handleInputChange}/>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Email Addresses (line separated)</label><br/>
              <textarea className={styles.textarea} name="emailAddresses"
                        value={this.state.emailAddresses}
                        onChange={this.handleInputChange}/>
            </div>
            {this.state.error !== undefined ?
                <div className={styles.error}>
                  {this.state.error}
                </div> : null}
            <input className={styles.save} type="submit" value="Save"/>
            <div>*these changes require a restart of the greenhouse server</div>
          </form>
        </Section>
    );
  }
}

Settings.propTypes = {
  color: PropTypes.string,
  saveHandler: PropTypes.func
};

export default Settings;