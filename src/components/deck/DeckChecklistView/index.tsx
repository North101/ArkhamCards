import React, { useCallback, useContext, useMemo, useState } from 'react';
import { Options } from 'react-native-navigation';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { t } from 'ttag';

import { iconsMap } from '@app/NavIcons';
import { Slots, SORT_BY_TYPE, SortType } from '@actions/types';
import { AppState, getDeckChecklist } from '@reducers';
import { NavigationProps } from '@components/nav/types';
import { showCard } from '@components/nav/helper';
import { setDeckChecklistCard, resetDeckChecklist } from '@components/deck/actions';
import CardSearchResult from '@components/cardlist/CardSearchResult';
import DbCardResultList from '@components/cardlist/CardSearchResultsComponent/DbCardResultList';
import { showSortDialog } from '@components/cardlist/CardSortDialog';
import Card from '@data/Card';
import COLORS from '@styles/colors';
import space from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { useDeckEdits, useNavigationButtonPressed } from '@components/core/hooks';
import { CardCount } from '@components/cardlist/CardSearchResult/ControlComponent/CardCount';
import CardToggle from '@components/cardlist/CardSearchResult/ControlComponent/CardToggle';

export interface DeckChecklistProps {
  id: number;
  slots: Slots;
  tabooSetOverride?: number;
}

type Props = DeckChecklistProps & NavigationProps;

function ChecklistCard({
  card,
  count,
  value,
  toggleCard,
  pressCard,
}: {
  card: Card;
  count: number;
  value: boolean;
  toggleCard: (card: Card, value: boolean) => void;
  pressCard: (card: Card) => void;
}) {
  const toggleValue = useCallback((value: boolean) => toggleCard(card, value), [card, toggleCard]);
  return (
    <CardSearchResult
      card={card}
      onPress={pressCard}
      backgroundColor="transparent"
      control={{
        type: 'count_with_toggle',
        count,
        value,
        toggleValue,
      }}
    />
  );
}

function DeckChecklistView({
  componentId,
  id,
}: Props) {
  const { colors, typography } = useContext(StyleContext);
  const deckEdits = useDeckEdits(id);
  const checklist = useSelector((state: AppState) => getDeckChecklist(state, id));
  const dispatch = useDispatch();
  const [sort, setSort] = useState<SortType>(SORT_BY_TYPE);
  useNavigationButtonPressed(({ buttonId }) => {
    if (buttonId === 'sort') {
      showSortDialog(
        setSort,
        sort,
        false
      );
    }
  }, componentId, [sort, setSort]);
  const toggleCard = useCallback((card: Card, value: boolean) => {
    dispatch(setDeckChecklistCard(id, card.code, value));
  }, [dispatch, id]);

  const pressCard = useCallback((card: Card) => {
    if (!deckEdits) {
      return;
    }
    showCard(
      componentId,
      card.code,
      card,
      colors,
      true,
      deckEdits?.tabooSetChange
    );
  }, [deckEdits, componentId, colors]);

  const renderCard = useCallback((card: Card) => {
    return (
      <ChecklistCard
        key={card.code}
        card={card}
        count={deckEdits?.slots[card.code] || 0}
        value={checklist.has(card.code)}
        pressCard={pressCard}
        toggleCard={toggleCard}
      />
    );
  }, [deckEdits, checklist, toggleCard, pressCard]);

  const clearChecklist = useCallback(() => {
    dispatch(resetDeckChecklist(id));
  }, [dispatch, id]);

  const header = useMemo(() => {
    return (
      <View style={[space.paddingM, space.marginRightXs, styles.headerRow]}>
        <TouchableOpacity onPress={clearChecklist} disabled={!checklist.size}>
          <Text style={[typography.text, checklist.size ? typography.light : { color: colors.L10 }]}>
            { t`Clear` }
          </Text>
        </TouchableOpacity>
      </View>
    );
  }, [checklist, typography, colors, clearChecklist]);

  if (!deckEdits) {
    return null;
  }

  return (
    <DbCardResultList
      componentId={componentId}
      deckId={id}
      sort={sort}
      header={header}
      renderCard={renderCard}
      noSearch
    />
  );
}

DeckChecklistView.options = (): Options => {
  return {
    topBar: {
      title: {
        text: t`Checklist`,
        color: COLORS.white,
      },
      rightButtons: [
        {
          icon: iconsMap.sort,
          id: 'sort',
          color: COLORS.white,
          accessibilityLabel: t`Sort`,
        },
      ],
    },
  };
};
export default DeckChecklistView;

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
