import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Actuator from './Actuator/Actuator';
import Section from '../Section/Section';
import {getActuators} from '../../utils/sgreen-api';

import styles from './Actuators.module.scss';

class Actuators extends Component {
  constructor(props) {
    super(props);

    this.state = {
      /*
        Format example:
        actuatorGroups: [
          {
            "type": "fan",
            "actuators": [
              {
                "name": "bigfan",
                "type": "fan",
                "state": true
              },
              {
                "name": "fan01",
                "type": "fan",
                "state": false
              }
            ]
          },
          {
            "type": "water",
            "actuators": [
              {
                "name": "water01",
                "type": "water",
                "state": false
              }
            ]
          }
        ]
       */
      actuatorGroups: []
    };

    this.updateActuatorState = this.updateActuatorState.bind(this);
    this.getActuators = this.getActuators.bind(this);
  }

  /**
   * Gets the actuators by calling the REST API and sticks the data into this component's state
   */
  getActuators() {
    getActuators().then(actuators => {

      /*
          We want to group the actuators so we can display them in a more organized manner.
          Key info: The REST API orders the actuators by type then by name, so if we traverse
                    the data in order and the current actuator has a different type than the
                    previous one, we have gone into a new group
       */
      let actuatorGroups = [];
      let previousType = undefined;

      actuators.forEach(actuator => {
        // create a new group
        if (actuator.type !== previousType) {
          actuatorGroups.push({
            "type": actuator.type,
            "actuators": []
          });
        }

        // add the actuator to the current group
        actuatorGroups[actuatorGroups.length - 1].actuators.push(actuator);

        previousType = actuator.type;
      });

      this.setState({actuatorGroups: actuatorGroups});
    });
  }

  componentDidMount() {
    this.getActuators();
    let intervalId = setInterval(this.getActuators, 15000);
    this.setState({intervalId: intervalId});
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
  }

  /**
   * Updates the actuator state. We will pass this to the Actuator children so they can
   * update the actuators state. This helps React keep up to date with whether an Actuator
   * is on or not after collapsing/expanding a section.
   *
   * @param type the type of the actuator for faster indexing
   * @param name the name of the actuator
   * @param state what state is it now
   */
  updateActuatorState(type, name, state) {
    let actuatorGroups = this.state.actuatorGroups;
    let groupIndex = actuatorGroups.findIndex(element => element.type === type);

    if (groupIndex === -1) return;

    let actuatorIndex = actuatorGroups[groupIndex].actuators.findIndex(element => element.name === name);

    if (actuatorIndex === -1) return;

    actuatorGroups[groupIndex].actuators[actuatorIndex].state = state;
    this.setState({actuatorGroups: actuatorGroups});
  }

  // TODO: add a group switch
  render() {
    return (
        <Section name="Actuators" color={this.props.color}>
          <div className={styles.flex}>
            {this.state.actuatorGroups.map(group => (
                <div key={group.type} className={styles.group}>
                  <h2 className={styles.groupName}>{group.type}</h2>
                  {group.actuators.map(actuator => (
                      <Actuator key={actuator.name}
                                type={group.type}
                                name={actuator.name}
                                checked={actuator.state}
                                disabled={this.props.disabled}
                                handler={this.updateActuatorState}/>
                  ))}
                </div>
            ))}
          </div>
        </Section>
    );
  }
}

// define the props for Actuators
Actuators.propTypes = {
  color: PropTypes.string,
  disabled: PropTypes.bool
};

export default Actuators;
