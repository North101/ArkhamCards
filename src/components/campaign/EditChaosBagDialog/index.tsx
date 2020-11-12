import React, { useCallback, useContext, useMemo, useReducer } from 'react';
import { find, map, sortBy, throttle } from 'lodash';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Navigation, Options } from 'react-native-navigation';
import { t } from 'ttag';

import { iconsMap } from '@app/NavIcons';
import { NavigationProps } from '@components/nav/types';
import ChaosTokenRow from './ChaosTokenRow';
import {
  CHAOS_TOKENS,
  CHAOS_BAG_TOKEN_COUNTS,
  CHAOS_TOKEN_ORDER,
  ChaosBag,
  ChaosTokenType,
} from '@app_constants';
import COLORS from '@styles/colors';
import space from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { useBackButton, useComponentVisible, useNavigationButtonPressed } from '@components/core/hooks';

export interface EditChaosBagProps {
  chaosBag: ChaosBag;
  updateChaosBag: (chaosBag: ChaosBag) => void;
  trackDeltas?: boolean;
}

type Props = EditChaosBagProps & NavigationProps;

function EditChaosBagDialog({ chaosBag: originalChaosBag, updateChaosBag, trackDeltas, componentId }: Props) {
  const { backgroundStyle, borderStyle, typography } = useContext(StyleContext);
  const [chaosBag, mutateChaosBag] = useReducer((state: ChaosBag, action: { id: ChaosTokenType, mutate: (count: number) => number }) => {
    return {
      ...state,
      [action.id]: action.mutate(state[action.id] || 0),
    };
  }, originalChaosBag);
  const visible = useComponentVisible(componentId);
  const hasPendingEdits = useMemo(() => {
    return !find(
      CHAOS_TOKENS,
      key => (chaosBag[key] || 0) !== (originalChaosBag[key] || 0));
  }, [chaosBag, originalChaosBag]);

  const saveChanges = useMemo(() => throttle(() => {
    updateChaosBag(chaosBag);
    Navigation.pop(componentId);
  }, 200), [updateChaosBag, chaosBag, componentId]);

  const handleBackPress = useCallback(() => {
    if (!visible) {
      return false;
    }
    if (hasPendingEdits) {
      Alert.alert(
        t`Save changes?`,
        t`Looks like you have made some changes that have not been saved.`,
        [{
          text: t`Save Changes`,
          onPress: () => {
            saveChanges();
          },
        }, {
          text: t`Discard Changes`,
          style: 'destructive',
          onPress: () => {
            Navigation.pop(componentId);
          },
        }, {
          text: t`Cancel`,
          style: 'cancel',
        }],
      );
    } else {
      Navigation.pop(componentId);
    }
    return true;
  }, [componentId, visible, hasPendingEdits, saveChanges]);


  useBackButton(handleBackPress);
  useNavigationButtonPressed(({ buttonId }) => {
    if (buttonId === 'save') {
      saveChanges();
    } else if (buttonId === 'back' || buttonId === 'androidBack') {
      handleBackPress();
    }
  }, componentId, [saveChanges, handleBackPress]);
  const mutateCount = useCallback((id: ChaosTokenType, mutate: (count: number) => number) => {
    mutateChaosBag({ id, mutate });
  }, [mutateChaosBag]);

  return (
    <ScrollView contentContainerStyle={backgroundStyle}>
      <View style={[styles.row, borderStyle, space.paddingS]}>
        <Text style={[typography.large, typography.bold]}>{t`In Bag`}</Text>
      </View>
      { map(sortBy(CHAOS_TOKENS, x => CHAOS_TOKEN_ORDER[x]),
        id => {
          const originalCount = trackDeltas ? originalChaosBag[id] : chaosBag[id];
          return (
            <ChaosTokenRow
              key={id}
              id={id}
              originalCount={originalCount || 0}
              count={chaosBag[id] || 0}
              limit={CHAOS_BAG_TOKEN_COUNTS[id] || 0}
              mutateCount={mutateCount}
            />
          );
        }) }
    </ScrollView>
  );
}

EditChaosBagDialog.options = (): Options => {
  return {
    topBar: {
      leftButtons: [
        Platform.OS === 'ios' ? {
          systemItem: 'cancel',
          text: t`Cancel`,
          id: 'back',
          color: COLORS.M,
          accessibilityLabel: t`Cancel`,
        } : {
          icon: iconsMap['arrow-back'],
          id: 'androidBack',
          color: COLORS.M,
          accessibilityLabel: t`Back`,
        },
      ],
      rightButtons: [{
        systemItem: 'save',
        text: t`Save`,
        id: 'save',
        showAsAction: 'ifRoom',
        color: COLORS.M,
        accessibilityLabel: t`Save`,
      }],
    },
  };
};
export default EditChaosBagDialog;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
