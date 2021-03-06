import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { throttle } from 'lodash';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { Navigation } from 'react-native-navigation';

import { t } from 'ttag';
import { ScenarioResult, CUSTOM } from '@actions/types';
import LabeledTextBox from '@components/core/LabeledTextBox';
import withDialogs, { InjectedDialogProps } from '@components/core/withDialogs';
import { NavigationProps } from '@components/nav/types';
import XpComponent from './XpComponent';
import { editScenarioResult } from './actions';
import COLORS from '@styles/colors';
import space, { s } from '@styles/space';
import StyleContext from '@styles/StyleContext';
import { useCampaign, useNavigationButtonPressed } from '@components/core/hooks';

export interface EditScenarioResultProps {
  campaignId: number;
  index: number;
}

interface ReduxProps {
  scenarioResult?: ScenarioResult;
}

interface ReduxActionProps {
  editScenarioResult: (id: number, index: number, scenarioResult: ScenarioResult) => void;
}

type Props = NavigationProps & EditScenarioResultProps & InjectedDialogProps;
interface State {
  scenarioResult?: ScenarioResult;
}

function EditScenarioResultView({ campaignId, index, componentId, showTextEditDialog }: Props) {
  const { backgroundStyle, typography } = useContext(StyleContext);
  const campaign = useCampaign(campaignId);
  const dispatch = useDispatch();
  const existingScenarioResult = campaign && campaign.scenarioResults[index];
  const [scenarioResult, setScenarioResult] = useState<ScenarioResult | undefined>(existingScenarioResult);
  const doSave = useMemo(() => throttle(() => {
    if (scenarioResult) {
      dispatch(editScenarioResult(campaignId, index, scenarioResult));
    }
    Navigation.pop(componentId);
  }, 200), [campaignId, index, scenarioResult, componentId, dispatch]);
  useNavigationButtonPressed(({ buttonId }) => {
    if (buttonId === 'save') {
      doSave();
    }
  }, componentId, [doSave]);

  useEffect(() => {
    Navigation.mergeOptions(componentId, {
      topBar: {
        rightButtons: [{
          text: t`Save`,
          id: 'save',
          color: COLORS.M,
          enabled: scenarioResult && !!(scenarioResult.scenario &&
            (scenarioResult.interlude || scenarioResult.resolution !== '')),
          accessibilityLabel: t`Save`,
        }],
      },
    });
  }, [componentId, scenarioResult]);

  const resolutionChanged = useCallback((value: string) => {
    if (scenarioResult) {
      setScenarioResult({
        ...scenarioResult,
        resolution: value,
      });
    }
  }, [scenarioResult, setScenarioResult]);

  const showResolutionDialog = useCallback(() => {
    showTextEditDialog(
      'Resolution',
      existingScenarioResult ? existingScenarioResult.resolution : '',
      resolutionChanged
    );
  }, [showTextEditDialog, existingScenarioResult, resolutionChanged]);

  const xpChanged = useCallback((xp: number) => {
    if (scenarioResult) {
      setScenarioResult({
        ...scenarioResult,
        xp,
      });
    }
  }, [scenarioResult, setScenarioResult]);

  if (!scenarioResult) {
    return null;
  }
  const {
    xp,
    scenario,
    scenarioCode,
    interlude,
    resolution,
  } = scenarioResult;
  return (
    <ScrollView contentContainerStyle={[styles.container, backgroundStyle]}>
      <View style={space.marginSideS}>
        <Text style={typography.smallLabel}>
          { (interlude ? t`Interlude` : t`Scenario`).toUpperCase() }
        </Text>
        <Text style={typography.text}>
          { scenario }
        </Text>
        { (scenarioCode === CUSTOM || !interlude) && (
          <LabeledTextBox
            label={t`Resolution`}
            onPress={showResolutionDialog}
            value={resolution}
            column
          />
        ) }
      </View>
      <XpComponent xp={xp || 0} onChange={xpChanged} />
      <View style={styles.footer} />
    </ScrollView>
  );
}
export default withDialogs(EditScenarioResultView);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: s,
    paddingBottom: s,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  footer: {
    height: 100,
  },
});
