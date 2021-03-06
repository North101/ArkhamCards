import React, { useCallback, useContext, useMemo, useState } from 'react';
import { ActivityIndicator, Platform, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { throttle } from 'lodash';
import { Action } from 'redux';
import { useDispatch, useSelector } from 'react-redux';
import DialogComponent from '@lib/react-native-dialog';
import { NetInfoStateType } from '@react-native-community/netinfo';
import { t } from 'ttag';

import SelectDeckSwitch from './SelectDeckSwitch';
import { saveClonedDeck } from '../actions';
import { showDeckModal } from '@components/nav/helper';
import Dialog from '@components/core/Dialog';
import withNetworkStatus, { NetworkStatusProps } from '@components/core/withNetworkStatus';
import { login } from '@actions';
import { Deck } from '@actions/types';
import { parseBasicDeck } from '@lib/parseDeck';
import { makeBaseDeckSelector, makeLatestDeckSelector, AppState } from '@reducers';
import COLORS from '@styles/colors';
import space from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { useDeck, useEffectUpdate, useInvestigatorCards, usePlayerCards } from '@components/core/hooks';
import { ThunkDispatch } from 'redux-thunk';

interface OwnProps {
  componentId: string;
  toggleVisible: () => void;
  deckId?: number;
  signedIn?: boolean;
}

type Props = OwnProps & NetworkStatusProps;

type DeckDispatch = ThunkDispatch<AppState, any, Action>;

function CopyDeckDialog({ componentId, toggleVisible, deckId, signedIn, isConnected, networkType, refreshNetworkStatus }: Props) {
  const { colors, typography } = useContext(StyleContext);
  const dispatch: DeckDispatch = useDispatch();
  const [deck] = useDeck(deckId, {});
  const baseDeckSelector = useMemo(makeBaseDeckSelector, []);
  const baseDeck = useSelector((state: AppState) => baseDeckSelector(state, deckId));
  const latestDeckSelector = useMemo(makeLatestDeckSelector, []);
  const latestDeck = useSelector((state: AppState) => latestDeckSelector(state, deckId));
  const [saving, setSaving] = useState(false);
  const [deckName, setDeckName] = useState<string | undefined>();
  const [offlineDeck, setOfflineDeck] = useState(!!(deck && deck.local));
  const [selectedDeckId, setSelectedDeckId] = useState(deckId);
  const [error, setError] = useState<string | undefined>();

  const resetForm = useCallback(() => {
    setSaving(false);
    setSelectedDeckId(deckId);
    setDeckName(deck ? deck.name : undefined);
  }, [setSaving, setSelectedDeckId, setDeckName, deck, deckId]);

  useEffectUpdate(() => {
    if (deckId !== undefined) {
      resetForm();
    }
  }, [deckId]);

  const onDeckTypeChange = useCallback((value: boolean) => {
    if (value && !signedIn) {
      dispatch(login());
    }
    setOfflineDeck(!value);
  }, [dispatch, signedIn, setOfflineDeck]);

  const selectedDeck: Deck | undefined = useMemo(() => {
    if (baseDeck && baseDeck.id === selectedDeckId) {
      return baseDeck;
    }
    if (latestDeck && latestDeck.id === selectedDeckId) {
      return latestDeck;
    }
    return deck;
  }, [baseDeck, deck, latestDeck, selectedDeckId]);
  const investigators = useInvestigatorCards();
  const investigator = useMemo(() => deck && investigators && investigators[deck.investigator_code], [deck, investigators]);

  const showNewDeck = useCallback((deck: Deck) => {
    setSaving(false);
    if (Platform.OS === 'android') {
      toggleVisible();
    }
    // Change the deck options for required cards, if present.
    showDeckModal(componentId, deck, colors, investigator);
  }, [componentId, toggleVisible, investigator, setSaving, colors]);

  const saveCopy = useCallback((isRetry: boolean) => {
    if (!selectedDeck) {
      return;
    }
    if (investigator && (!saving || isRetry)) {
      setSaving(true);
      const local = (offlineDeck || !signedIn || !isConnected || networkType === NetInfoStateType.none);
      dispatch(saveClonedDeck(local, selectedDeck, deckName || t`New Deck`)).then(
        showNewDeck,
        (err) => {
          setSaving(false);
          setError(err.message);
        }
      );
    }
  }, [signedIn, isConnected, networkType,
    deckName, offlineDeck, selectedDeck, saving, investigator,
    dispatch, setSaving, setError, showNewDeck]);
  const onOkayPress = useMemo(() => throttle(() => saveCopy(false), 200), [saveCopy]);

  const onDeckNameChange = useCallback((value: string) => {
    setDeckName(value);
  }, [setDeckName]);

  const selectedDeckIdChanged = useCallback((deckId: number, value: boolean) => {
    setSelectedDeckId(value ? deckId : undefined);
  }, [setSelectedDeckId]);

  const cards = usePlayerCards();
  const parsedCurrentDeck = useMemo(() => cards && deck && parseBasicDeck(deck, cards), [cards, deck]);
  const parsedBaseDeck = useMemo(() => cards && baseDeck && parseBasicDeck(baseDeck, cards), [cards, baseDeck]);
  const parsedLatestDeck = useMemo(() => cards && latestDeck && parseBasicDeck(latestDeck, cards), [cards, latestDeck]);

  const deckSelector = useMemo(() => {
    if (parsedCurrentDeck && !parsedBaseDeck && !parsedLatestDeck) {
      // Only one deck, no need to show a selector.
      return null;
    }
    return (
      <>
        <DialogComponent.Description style={[typography.dialogLabel, space.marginBottomS]}>
          { t`Version to copy` }
        </DialogComponent.Description>
        { parsedBaseDeck ? (
          <SelectDeckSwitch
            deckId={parsedBaseDeck.deck.id}
            label={t`Base Version\n${parsedBaseDeck.experience} XP`}
            value={selectedDeckId === parsedBaseDeck.deck.id}
            onValueChange={selectedDeckIdChanged}
          />
        ) : null }
        { parsedCurrentDeck ? (
          <SelectDeckSwitch
            deckId={parsedCurrentDeck.deck.id}
            label={t`Current Version ${parsedCurrentDeck.deck.version}\n${parsedCurrentDeck.experience} XP`}
            value={selectedDeckId === parsedCurrentDeck.deck.id}
            onValueChange={selectedDeckIdChanged}
          />
        ) : null }
        { parsedLatestDeck ? (
          <SelectDeckSwitch
            deckId={parsedLatestDeck.deck.id}
            label={t`Latest Version ${parsedLatestDeck.deck.version}\n${parsedLatestDeck.experience} XP`}
            value={selectedDeckId === parsedLatestDeck.deck.id}
            onValueChange={selectedDeckIdChanged}
          />
        ) : null }
      </>
    );
  }, [parsedBaseDeck, parsedCurrentDeck, parsedLatestDeck, selectedDeckId, typography, selectedDeckIdChanged]);

  const formContent = useMemo(() => {
    if (saving) {
      return (
        <ActivityIndicator
          style={styles.spinner}
          color={colors.lightText}
          size="large"
          animating
        />
      );
    }
    return (
      <>
        <DialogComponent.Description style={[typography.dialogLabel, space.marginBottomS]}>
          { t`New Name` }
        </DialogComponent.Description>
        <DialogComponent.Input
          value={deckName || ''}
          placeholder={t`Required`}
          onChangeText={onDeckNameChange}
          returnKeyType="done"
        />
        { deckSelector }
        <DialogComponent.Description style={[typography.dialogLabel, space.marginBottomS]}>
          { t`Deck Type` }
        </DialogComponent.Description>
        <DialogComponent.Switch
          label={t`Create on ArkhamDB`}
          value={!offlineDeck && signedIn && isConnected && networkType !== NetInfoStateType.none}
          disabled={!isConnected || networkType === NetInfoStateType.none}
          onValueChange={onDeckTypeChange}
          trackColor={COLORS.switchTrackColor}
        />
        { (!isConnected || networkType === NetInfoStateType.none) && (
          <TouchableOpacity onPress={refreshNetworkStatus}>
            <DialogComponent.Description style={[typography.small, { color: COLORS.red }, space.marginBottomS]}>
              { t`You seem to be offline. Refresh Network?` }
            </DialogComponent.Description>
          </TouchableOpacity>
        ) }

        { !!error && (
          <Text style={[typography.text, typography.center, styles.error, space.marginBottomS]}>
            { error }
          </Text>
        ) }
      </>
    );
  }, [signedIn, networkType, isConnected, colors, typography, saving, deckName, offlineDeck, error, onDeckNameChange, refreshNetworkStatus, onDeckTypeChange, deckSelector]);


  if (!investigator) {
    return null;
  }
  const okDisabled = saving || selectedDeckId === null;
  return (
    <Dialog
      title={t`Copy Deck`}
      visible={!!deckId}
    >
      <DialogComponent.Description
        style={[space.marginSideS, saving ? typography.center : typography.left, typography.text]}
      >
        { saving ?
          t`Saving` :
          t`Make a copy of a deck so that you can use it in a different campaign or choose different upgrades.`
        }
      </DialogComponent.Description>
      { formContent }
      <DialogComponent.Button
        label={t`Cancel`}
        onPress={toggleVisible}
      />
      <DialogComponent.Button
        label={t`Okay`}
        color={okDisabled ? COLORS.darkGray : COLORS.lightBlue}
        disabled={okDisabled}
        onPress={onOkayPress}
      />
    </Dialog>
  );
}

export default withNetworkStatus(CopyDeckDialog);

const styles = StyleSheet.create({
  spinner: {
    height: 80,
  },
  error: {
    color: 'red',
  },
});
