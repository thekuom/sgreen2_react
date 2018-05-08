import React, {Component} from 'react';
import Actuators from '../Actuators/Actuators';

import styles from './App.module.scss';
import Settings from "../Settings/Settings";
import DataReadings from "../DataReadings/DataReadings";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      actuatorsDisabled: true
    };

    this.setIsDisabledActuators = this.setIsDisabledActuators.bind(this);
  }

  /**
   * This will be called after settings are saved. If manual mode is specified,
   * we don't want the users to think they can change the actuator state so
   * this will send the message to the actuators that they should be disabled.
   *
   * @param isDisabled whether or not the actuators should be disabled
   */
  setIsDisabledActuators(isDisabled) {
    this.setState({
      actuatorsDisabled: isDisabled
    });
  }

  render() {
    return (
        <div>
          <div className={styles.main}>
            <header className={styles.header}>
              <div className={styles.container}>
                <h1 className={styles.h1}><span className={styles.sgreen}>sGreen 2.0</span> Greenhouse Manager</h1>
              </div>
            </header>
            <div>
              <Settings color={"white"} saveHandler={this.setIsDisabledActuators}/>
              <Actuators color={"green"} disabled={this.state.actuatorsDisabled}/>
              <DataReadings color={"white"}/>
            </div>
          </div>
          <div className={styles.footer}>
            <div className={styles.container}>
              {/* Unless you're scrapping this, please keep our names in here we worked hard! */}
              Copyright &copy; Oliver Delgado, Matthew Kuo, Ethan McCormack, Hong Wen Tan
            </div>
          </div>
        </div>
    );
  }
}

export default App;
