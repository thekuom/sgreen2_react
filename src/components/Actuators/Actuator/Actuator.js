import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Toggle from 'react-toggle';

import {putActuatorState} from "../../../utils/sgreen-api";
import {deleteActuatorState} from "../../../utils/sgreen-api";

import styles from './Actuator.module.scss';
import 'react-toggle/style.css';

class Actuator extends Component {
  constructor(props) {
    super(props);

    this.state = {
      checked: props.checked
    };
  }

  /**
   * Defines what happens when a switch is flipped
   *
   * Changes the state and calls the REST API to update the actuator state
   */
  onChange = () => {
    this.setState(prevState => {
      return {
        checked: !prevState.checked
      };
    }, () => {
      if (this.state.checked) {
        putActuatorState(this.props.name);
      } else {
        deleteActuatorState(this.props.name);
      }

      // handler passed down from parent
      this.props.handler(this.props.type, this.props.name, this.state.checked);
    });
  };

  /**
   * When the props of the Actuator change, we need to make sure if the "checked"
   * prop changed, then we need to update this Actuator's state
   *
   * @param nextProps
   */
  componentWillReceiveProps(nextProps) {
    if (this.state.checked !== nextProps.checked) {
      this.setState({checked: nextProps.checked})
    }
  }

  render() {
    return (
        <div>
          <span className={styles.name}>{this.props.name}</span>
          <Toggle checked={this.state.checked} onChange={this.onChange} disabled={this.props.disabled}/>
        </div>
    )
  }
}

// define the props for Actuator
Actuator.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  checked: PropTypes.bool,
  disabled: PropTypes.bool
};

export default Actuator;