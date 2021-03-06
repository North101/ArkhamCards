import React, { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { t } from 'ttag';

import { setTabooSet } from './actions';
import TabooSetPicker from '@components/core/TabooSetPicker';
import SettingsItem from './SettingsItem';
import { AppState, makeTabooSetSelector } from '@reducers';
import COLORS from '@styles/colors';


export default function SettingsTabooPicker() {
  const dispatch = useDispatch();
  const onSetTabooSet = useCallback((tabooSetId?: number) => {
    dispatch(setTabooSet(tabooSetId));
  }, [dispatch]);
  const tabooSetSelector = useMemo(makeTabooSetSelector, []);
  const tabooSetId = useSelector((state: AppState) => tabooSetSelector(state, undefined));
  const cardsLoading = useSelector((state: AppState) => state.cards.loading);

  if (cardsLoading) {
    return (
      <SettingsItem
        text={t`Taboo List`}
      />
    );
  }
  return (
    <TabooSetPicker
      color={COLORS.lightBlue}
      tabooSetId={tabooSetId}
      setTabooSet={onSetTabooSet}
      disabled={cardsLoading}
      description={t`Changes the default taboo list for newly created decks and search.`}
    />
  );
}
