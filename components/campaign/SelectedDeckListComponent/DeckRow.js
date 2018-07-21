import React from 'react';
import PropTypes from 'prop-types';
import { find, keys, map, sum, values } from 'lodash';
import {
  TouchableOpacity,
  StyleSheet,
  View,
} from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/dist/MaterialCommunityIcons';

import DeckListRow from '../../DeckListRow';
import XpComponent from '../XpComponent';
import * as Actions from '../../../actions';
import { getDeck } from '../../../reducers';
import LabeledTextBox from '../../core/LabeledTextBox';

class DeckRow extends React.Component {
  static propTypes = {
    navigator: PropTypes.object.isRequired,
    id: PropTypes.number.isRequired,
    deck: PropTypes.object,
    deckUpdates: PropTypes.object,
    remove: PropTypes.func.isRequired,
    deckUpdatesChanged: PropTypes.func,
    fetchPrivateDeck: PropTypes.func.isRequired,
    // From realm
    investigators: PropTypes.object,
    cards: PropTypes.object,
  };

  constructor(props) {
    super(props);

    this._updateExiles = this.doUpdate.bind(this, 'exiles');
    this._updateXp = this.doUpdate.bind(this, 'xp');
    this._updateTrauma = this.doUpdate.bind(this, 'trauma');
    this._onRemove = this.onRemove.bind(this);
    this._onDeckPress = this.onDeckPress.bind(this);
    this._showExileDialog = this.showExileDialog.bind(this);
  }

  onDeckPress() {
    const {
      navigator,
      id,
    } = this.props;
    navigator.showModal({
      screen: 'Deck',
      passProps: {
        id: id,
        isPrivate: true,
        modal: true,
      },
    });
  }

  updates() {
    const {
      id,
      deckUpdates,
    } = this.props;
    return deckUpdates[id] || {};
  }

  showExileDialog() {
    const {
      navigator,
      id,
    } = this.props;
    navigator.push({
      screen: 'Dialog.ExileCards',
      passProps: {
        id,
        updateExiles: this._updateExiles,
        exiles: this.updates().exiles || {},
      },
    });
  }

  doUpdate(key, value) {
    const {
      id,
      deckUpdatesChanged,
    } = this.props;
    deckUpdatesChanged(id, Object.assign({}, this.updates(), { [key]: value }));
  }

  onRemove() {
    const {
      remove,
      id,
    } = this.props;
    remove(id);
  }

  componentDidMount() {
    const {
      id,
      deck,
      fetchPrivateDeck,
    } = this.props;
    if (!deck) {
      fetchPrivateDeck(id, false);
    }
  }

  renderXp() {
    if (!this.props.deckUpdatesChanged) {
      return null;
    }
    return <XpComponent xp={this.updates().xp || 0} onChange={this._updateXp} isInvestigator />;
  }

  exileText() {
    const {
      cards,
    } = this.props;
    const {
      exiles,
    } = this.updates();
    const numCards = keys(exiles).length;
    switch (numCards) {
      case 0: return 'None';
      case 1:
      case 2:
        return map(keys(exiles), code => {
          const count = exiles[code];
          const card = cards[code];
          if (count === 1) {
            return card.name;
          }
          return `${card.name}${count > 1 ? ` x${count}` : ''}`;
        }).join(', ');
      default:
        // No room to print more than one card name, so just sum it
        return `${sum(values(exiles))} cards`;
    }
  }

  hasExile() {
    const {
      deck,
      cards,
    } = this.props;
    return !!find(keys(deck.slots), code => cards[code].exile);
  }

  renderExile() {
    if (!this.props.deckUpdatesChanged || !this.hasExile()) {
      return null;
    }
    return (
      <View style={styles.exileRow}>
        <LabeledTextBox
          label="Exiled Cards"
          onPress={this._showExileDialog}
          value={this.exileText()}
          column
        />
      </View>
    );
  }

  renderDetails() {
    if (!this.props.deckUpdatesChanged) {
      return null;
    }
    return (
      <View style={styles.flex}>
        { this.renderXp() }
        { this.renderExile() }
      </View>
    );
  }

  render() {
    const {
      id,
      deck,
      cards,
      investigators,
    } = this.props;
    return (
      <DeckListRow
        id={id}
        deck={deck}
        cards={cards}
        investigators={investigators}
        onPress={this._onDeckPress}
        investigator={deck ? cards[deck.investigator_code] : null}
        titleButton={
          <TouchableOpacity onPress={this._onRemove}>
            <MaterialCommunityIcons name="close" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        }
        details={this.renderDetails()}
      />
    );
  }
}

function mapStateToProps(state, props) {
  return {
    deck: getDeck(state, props.id),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DeckRow);

const styles = StyleSheet.create({
  flex: {
    flexDirection: 'column',
  },
  exileRow: {
    marginRight: 8,
  },
});
