import React, { useCallback, useContext, useMemo } from 'react';
import { map } from 'lodash';
import { ScrollView } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { useSelector } from 'react-redux';
import { t } from 'ttag';

import DeckProgressComponent from './DeckProgressComponent';
import { DeckDetailProps } from './DeckDetailView';
import { getDeckOptions } from '@components/nav/helper';
import { NavigationProps } from '@components/nav/types';
import { Deck, ParsedDeck } from '@actions/types';
import { getAllDecks } from '@reducers';
import { parseDeck } from '@lib/parseDeck';
import StyleContext from '@styles/StyleContext';
import { useDeckEdits, usePlayerCards } from '@components/core/hooks';

export interface DeckHistoryProps {
  id: number;
}

export default function DeckHistoryView({
  componentId,
  id,
}: DeckHistoryProps & NavigationProps) {
  const deckEdits = useDeckEdits(id);
  const { backgroundStyle, colors } = useContext(StyleContext);
  const cards = usePlayerCards();
  const decks = useSelector(getAllDecks);
  const historicDecks = useMemo(() => {
    if (!cards) {
      return [];
    }
    const decksResult: ParsedDeck[] = [];
    let deck: Deck | undefined = decks[id];
    while (deck) {
      const currentDeck = deck.id === id;
      const previousDeck: Deck | undefined = (
        deck.previous_deck ? decks[deck.previous_deck] : undefined
      );
      const currentXpAdjustment = currentDeck ? deckEdits?.xpAdjustment : undefined;
      const parsedDeck = parseDeck(
        deck,
        (currentDeck && deckEdits?.meta) || (deck.meta || {}),
        (currentDeck && deckEdits?.slots) || deck.slots,
        (currentDeck && deckEdits?.ignoreDeckLimitSlots) || deck.ignoreDeckLimitSlots,
        cards,
        previousDeck,
        currentXpAdjustment !== undefined ? currentXpAdjustment : (deck.xp_adjustment || 0),
      );
      if (parsedDeck) {
        decksResult.push(parsedDeck);
      }
      deck = previousDeck;
    }
    return decksResult;
  }, [id, decks, cards, deckEdits]);

  const deckTitle = useCallback((deck: ParsedDeck, versionNumber: number): string => {
    if (!deck.changes) {
      return t`Original Deck`;
    }
    if (deck.deck.id === id) {
      if (deck.changes) {
        return t`Latest Deck: ${deck.changes.spentXp} of ${deck.availableExperience} XP`;
      }
      return t`Latest Deck: ${deck.availableExperience} XP`;
    }
    const humanVersionNumber = versionNumber - 1;
    if (deck.changes) {
      return t`Upgrade ${humanVersionNumber}: ${deck.changes.spentXp} of ${deck.availableExperience} XP`;
    }
    return t`Upgrade ${humanVersionNumber}: ${deck.availableExperience} XP`;
  }, [id]);

  const onDeckPress = useCallback((parsedDeck: ParsedDeck) => {
    Navigation.push<DeckDetailProps>(componentId, {
      component: {
        name: 'Deck',
        passProps: {
          id: parsedDeck.deck.id,
          isPrivate: true,
        },
        options: getDeckOptions(colors, { title: parsedDeck.deck.name }, parsedDeck.investigator),
      },
    });
  }, [componentId, colors]);
  if (!cards) {
    return null;
  }
  return (
    <ScrollView contentContainerStyle={backgroundStyle}>
      { map(historicDecks, (deck, idx) => (
        <DeckProgressComponent
          key={deck.deck.id}
          title={deckTitle(deck, historicDecks.length - idx)}
          onTitlePress={onDeckPress}
          componentId={componentId}
          deck={deck.deck}
          parsedDeck={deck}
          cards={cards}
          editable={false}
          isPrivate
        />
      )) }
    </ScrollView>
  );
}
