import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  DiscreteColorLegend,
  FlexibleWidthXYPlot,
  Hint,
  HorizontalGridLines,
  LineMarkSeries,
  VerticalGridLines,
  XAxis,
  YAxis
} from "react-vis";

let dateFormat = require('dateformat');

/**
 * This is a wrapper for react-vis graphs
 */
class Graph extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hintValue: null
    };

    this.hintRememberValue = this.hintRememberValue.bind(this);
    this.hintForgetValue = this.hintForgetValue.bind(this);
  }

  /**
   * Refer to react-vis documentation for the hints
   *
   * @param hintValue
   */
  hintRememberValue(hintValue) {
    this.setState({hintValue});
  }

  hintForgetValue() {
    this.setState({hintValue: null});
  }

  /**
   * Custom formatter for the hints. Refer to react-vis documentation.
   *
   * @param hintValue passed in from react-vis
   * @param xLabel the label for the x axis
   * @param yLabel the label for the y axis
   * @param yUnit what unit the y axis is in
   * @returns {*[]}
   */
  static formatHint(hintValue, xLabel, yLabel, yUnit) {
    const date = new Date(hintValue.x);
    return [{
      title: xLabel,
      value: dateFormat(date, "m/d h:MM TT")
    }, {
      title: yLabel,
      value: hintValue.y.toFixed(2).toString() + (yUnit ? yUnit : "")
    }]
  }

  /**
   * The best way to figure out what's going on here is scrolling
   * through react-vis examples.
   *
   * @returns {*}
   */
  render() {
    return (
        <div>
          <h3>{this.props.title}</h3>
          <DiscreteColorLegend
              //width={this.props.width}
              orientation="horizontal"
              items={this.props.items}/>
          <FlexibleWidthXYPlot
              xType="time"
              height={this.props.height}>
            <HorizontalGridLines/>
            <VerticalGridLines/>
            <XAxis
                title="time"
                tickTotal={5}/>
            <YAxis
                title={this.props.yAxis + (this.props.yUnit ? " (" + this.props.yUnit + ")" : "")}/>
            {this.props.sensorData.map(sensor => (
                <LineMarkSeries
                    onValueMouseOver={this.hintRememberValue}
                    onValueMouseOut={this.hintForgetValue}
                    size={3}
                    key={sensor.name}
                    data={sensor.readings}/>
            ))}
            {this.state.hintValue ?
                <Hint format={() => Graph.formatHint(this.state.hintValue, "time", this.props.yAxis, this.props.yUnit)}
                      value={this.state.hintValue}/> : null}
          </FlexibleWidthXYPlot>
        </div>
    );
  }
}

Graph.propTypes = {
  title: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.string),
  yAxis: PropTypes.string,
  yUnit: PropTypes.string,
  sensorData: PropTypes.array,
  width: PropTypes.number,
  height: PropTypes.number
};

export default Graph;