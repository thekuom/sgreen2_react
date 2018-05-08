import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {VelocityTransitionGroup} from 'velocity-react';

import styles from './Section.module.scss';

class Section extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false
    };

    this.expandCollapseBody = this.expandCollapseBody.bind(this);
  }

  expandCollapseBody() {
    this.setState({expanded: !this.state.expanded});
  }

  render() {
    return (
        // We want multiple classes here so we create an array and then join them with spaces
        <section className={[styles.section, styles[this.props.color]].join(" ")}>
          <div>
            <div className={styles.header} onClick={this.expandCollapseBody}>
              <div className={[styles.container, styles.flex].join(" ")}>
                <span className={styles.name}>{this.props.name}</span>
                <span className={styles.collapseBtn}>{this.state.expanded ? "Collapse" : "Expand"}</span>
              </div>
            </div>
            {/* This friendly guy makes animating things dead simple */}
            <VelocityTransitionGroup enter={{animation: "slideDown"}} leave={{animation: "slideUp"}}>
              {this.state.expanded ?
                  <div>
                    <div className={styles.container}>
                      {this.props.children}
                    </div>
                  </div> : null}
            </VelocityTransitionGroup>
          </div>
        </section>
    );
  }
}

Section.propTypes = {
  color: PropTypes.string,
  name: PropTypes.string
};

export default Section;