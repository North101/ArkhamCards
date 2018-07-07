import React from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
} from 'react-native';

import AccordionItem from './AccordionItem';
import ToggleFilter from './ToggleFilter';

export default class SkillIconChooser extends React.Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    skillIcons: PropTypes.object.isRequired,
    enabled: PropTypes.bool,
    toggleEnabled: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this._onToggleChange = this.onToggleChange.bind(this);
  }

  onToggleChange(key) {
    const {
      onChange,
      skillIcons,
    } = this.props;
    onChange(Object.assign({}, skillIcons, { [key]: !skillIcons[key] }));
  }

  render() {
    const {
      skillIcons: {
        willpower,
        intellect,
        combat,
        agility,
        wild,
        doubleIcons,
      },
      enabled,
      toggleEnabled,
    } = this.props;
    return (
      <AccordionItem
        label={enabled ? 'Skill Icons: All' : 'Skill Icons'}
        height={120}
        enabled={enabled}
        toggleEnabled={toggleEnabled}
      >
        <View style={styles.toggleRow}>
          <ToggleFilter
            icon="willpower"
            setting="willpower"
            value={willpower}
            onChange={this._onToggleChange}
          />
          <ToggleFilter
            icon="intellect"
            setting="intellect"
            value={intellect}
            onChange={this._onToggleChange}
          />
          <ToggleFilter
            label="2+"
            setting="doubleIcons"
            value={doubleIcons}
            onChange={this._onToggleChange}
          />
        </View>
        <View style={styles.toggleRow}>
          <ToggleFilter
            icon="combat"
            setting="combat"
            value={combat}
            onChange={this._onToggleChange}
          />
          <ToggleFilter
            icon="agility"
            setting="agility"
            value={agility}
            onChange={this._onToggleChange}
          />
          <ToggleFilter
            icon="wild"
            setting="wild"
            value={wild}
            onChange={this._onToggleChange}
          />
        </View>
      </AccordionItem>
    );
  }
}


const styles = StyleSheet.create({
  toggleRow: {
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
});