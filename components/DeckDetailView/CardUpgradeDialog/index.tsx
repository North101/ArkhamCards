import React from 'react';
import { Button, ScrollView, StyleSheet, View } from 'react-native';
import { EventSubscription, Navigation } from 'react-native-navigation';
import { filter, find, reverse, sortBy, sumBy } from 'lodash';
import { t } from 'ttag';

import CardUpgradeOption from './CardUpgradeOption';
import { Deck, DeckMeta, ParsedDeck, Slots } from '../../../actions/types';
import DeckValidation from '../../../lib/DeckValidation';
import Card, { CardsMap } from '../../../data/Card';
import { COLORS } from '../../../styles/colors';
import { NavigationProps } from '../../types';
import CardDetailComponent from '../../CardDetailView/CardDetailComponent';
import withDimensions, { DimensionsProps } from '../../core/withDimensions';
import DeckProblemRow from '../../DeckProblemRow';
import { m, s } from '../../../styles/space';
import DeckNavFooter from '../../DeckNavFooter';
import { parseDeck } from '../../../lib/parseDeck';

export interface CardUpgradeDialogProps {
  componentId: string;
  card?: Card;
  cards: CardsMap;
  cardsByName: {
    [name: string]: Card[];
  };
  ignoreDeckLimitSlots: Slots;
  investigator: Card;
  meta: DeckMeta;
  parsedDeck: ParsedDeck;
  previousDeck?: Deck;
  slots?: Slots;
  tabooSetId?: number;
  updateSlots: (slots: Slots) => void;
  xpAdjustment: number;
}

interface State {
  parsedDeck: ParsedDeck;
  slots: Slots;
}

type Props = CardUpgradeDialogProps & NavigationProps & DimensionsProps;

class CardUpgradeDialog extends React.Component<Props, State> {

  _navEventListener?: EventSubscription;

  constructor(props: Props) {
    super(props);

    this.state = {
      parsedDeck: props.parsedDeck,
      slots: props.slots || {},
    };

    this._navEventListener = Navigation.events().bindComponent(this);
  }

  navigationButtonPressed({ buttonId }: { buttonId: string }) {
    const {
      componentId,
    } = this.props;
    if (buttonId === 'back') {
      Navigation.pop(componentId);
    }
  }

  _onSavePress = () => {
    const {
      componentId,
      updateSlots,
    } = this.props;
    const {
      slots,
    } = this.state;

    updateSlots(slots);

    Navigation.pop(componentId);
  };

  _onIncrement = (code: string) => {
    const {
      cards,
    } = this.props;
    const {
      slots,
    } = this.state;

    const newSlots: Slots = {
      ...slots,
      [code]: (slots[code] || 0) + 1,
    };

    const possibleDecrement = find(reverse(this.namedCards()), card => (
      card.code !== code && newSlots[card.code] > 0 &&
        (card.xp || 0) < (cards[code].xp || 0)
    ));

    if (possibleDecrement) {
      newSlots[possibleDecrement.code]--;
      if (newSlots[possibleDecrement.code] <= 0) {
        delete newSlots[possibleDecrement.code];
      }
    }

    const parsedDeck = this.updateXp(newSlots);

    this.setState({
      slots: newSlots,
      parsedDeck: parsedDeck,
    });
  };

  _onDecrement = (code: string) => {
    const {
      slots,
    } = this.state;

    const newSlots: Slots = {
      ...slots,
      [code]: (slots[code] || 0) - 1,
    };

    if (newSlots[code] <= 0) {
      delete newSlots[code];
    }

    const parsedDeck = this.updateXp(newSlots);

    this.setState({
      slots: newSlots,
      parsedDeck: parsedDeck,
    });
  };

  namedCards() {
    const {
      card,
      cardsByName,
      investigator,
      meta,
    } = this.props;
    const validation = new DeckValidation(investigator, meta);
    return sortBy(
      filter((card && cardsByName[card.real_name]) || [],
        card => validation.canIncludeCard(card, false)),
      card => card.xp || 0
    );
  }

  overLimit(slots: Slots) {
    const namedCards = this.namedCards();
    const limit = (namedCards && namedCards.length) ?
      (namedCards[0].deck_limit || 2) :
      2;
    return sumBy(namedCards, card => slots[card.code] || 0) > limit;
  }

  updateXp(slots: Slots) {
    const {
      cards,
      ignoreDeckLimitSlots,
      parsedDeck,
      previousDeck,
    } = this.props;

    const deck = parsedDeck.deck;

    return parseDeck(deck, slots, ignoreDeckLimitSlots || {}, cards, previousDeck);
  }

  renderCard(card: Card, itemIndex: number) {
    const {
      componentId,
      tabooSetId,
      width,
    } = this.props;
    const {
      slots,
    } = this.state;
    return (
      <View style={styles.column} key={itemIndex}>
        <CardUpgradeOption
          key={card.code}
          card={card}
          code={card.code}
          count={slots[card.code] || 0}
          onIncrement={this._onIncrement}
          onDecrement={this._onDecrement}
        />
        <CardDetailComponent
          componentId={componentId}
          card={card}
          showSpoilers
          tabooSetId={tabooSetId}
          width={width}
          simple
        />
      </View>
    );
  }

  renderCards() {
    const namedCards = this.namedCards();
    return namedCards.map((card, index) => this.renderCard(card, index));
  }

  renderFooter(slots?: Slots, controls?: React.ReactNode) {
    const {
      componentId,
      cards,
      meta,
      xpAdjustment,
    } = this.props;
    const {
      parsedDeck,
    } = this.state;

    if (!parsedDeck) {
      return null;
    }

    return (
      <DeckNavFooter
        componentId={componentId}
        parsedDeck={parsedDeck}
        meta={meta}
        cards={cards}
        xpAdjustment={xpAdjustment}
        controls={controls}
      />
    );
  }

  render() {
    const {
      investigator,
    } = this.props;
    const {
      slots,
    } = this.state;
    const overLimit = this.overLimit(slots);

    const isSurvivor = investigator.faction_code === 'survivor';
    return (
      <View
        style={styles.wrapper}
      >
        <ScrollView
          overScrollMode="never"
          bounces={false}
        >
          { overLimit && (
            <View style={[styles.problemBox,
              { backgroundColor: isSurvivor ? COLORS.yellow : COLORS.red },
            ]}>
              <DeckProblemRow problem={{ reason: 'too_many_copies' }} color={isSurvivor ? COLORS.black : COLORS.white} fontSize={14} />
            </View>
          ) }
          { this.renderCards() }
          <Button title={t`Save`} onPress={this._onSavePress} />
        </ScrollView>
        { this.renderFooter() }
      </View>
    );
  }
}

export default withDimensions(CardUpgradeDialog);

const styles = StyleSheet.create({
  column: {
    paddingTop: m,
    paddingBottom: m,
    flexDirection: 'column',
    borderBottomColor: COLORS.gray,
    borderBottomWidth: 1,
  },
  wrapper: {
    flex: 1,
    flexDirection: 'column',
  },
  problemBox: {
    flex: 1,
    paddingTop: 4,
    paddingBottom: 4,
    paddingRight: s,
    paddingLeft: s,
  },
});
