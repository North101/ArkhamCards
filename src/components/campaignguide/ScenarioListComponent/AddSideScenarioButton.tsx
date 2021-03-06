import React, { useCallback, useContext, useMemo } from 'react';
import { Text, View } from 'react-native';
import { find, findLast, findLastIndex } from 'lodash';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';

import BasicButton from '@components/core/BasicButton';
import { AddSideScenarioProps } from '@components/campaignguide/AddSideScenarioView';
import { ProcessedCampaign } from '@data/scenario';
import CampaignGuide from '@data/scenario/CampaignGuide';
import CampaignStateHelper from '@data/scenario/CampaignStateHelper';
import space from '@styles/space';
import StyleContext from '@styles/StyleContext';

interface Props {
  componentId: string;
  campaignId: number;
  processedCampaign: ProcessedCampaign;
  campaignGuide: CampaignGuide;
  campaignState: CampaignStateHelper;
}

export default function AddSideScenarioButton({ componentId, campaignId, processedCampaign, campaignGuide, campaignState }: Props) {
  const { typography } = useContext(StyleContext);

  const onPress = useCallback(() => {
    const lastCompletedScenario = findLast(
      processedCampaign.scenarios,
      scenario => scenario.type === 'completed'
    );
    if (!lastCompletedScenario) {
      return null;
    }
    Navigation.push<AddSideScenarioProps>(componentId, {
      component: {
        name: 'Guide.SideScenario',
        passProps: {
          campaignId,
          latestScenarioId: lastCompletedScenario.id,
        },
        options: {
          topBar: {
            title: {
              text: t`Choose Side-Scenario`,
            },
            backButton: {
              title: t`Back`,
            },
          },
        },
      },
    });
  }, [componentId, campaignId, processedCampaign.scenarios]);

  const canAddScenario = useMemo(() => {
    const lastCompletedScenarioIndex = findLastIndex(
      processedCampaign.scenarios,
      scenario => scenario.type === 'completed'
    );
    if (processedCampaign.campaignLog.campaignData.result) {
      return false;
    }
    // Have to have completed a scenario
    if (lastCompletedScenarioIndex === -1) {
      return false;
    }
    if (lastCompletedScenarioIndex + 1 < processedCampaign.scenarios.length) {
      const lastScenario = processedCampaign.scenarios[lastCompletedScenarioIndex];
      const nextScenario = processedCampaign.scenarios[lastCompletedScenarioIndex + 1];
      if (lastScenario.id.scenarioId === nextScenario.id.scenarioId) {
        // Can't insert a scenario in the middle of a replay-loop.
        return false;
      }
    }
    const scenarioInProgress = !!find(
      processedCampaign.scenarios,
      scenario => scenario.type === 'started'
    );
    if (scenarioInProgress) {
      return false;
    }
    const completedActualScenario = find(
      processedCampaign.scenarios,
      scenario =>
        scenario.type === 'completed' &&
        scenario.scenarioGuide.scenarioType() === 'scenario'
    );
    if (!completedActualScenario) {
      return false;
    }

    const nextScenario = campaignGuide.nextScenario(
      campaignState,
      processedCampaign.campaignLog,
      false
    );
    if (nextScenario && nextScenario.scenario.type === 'interlude') {
      // Can't break up an interlude and a scenario.
      return false;
    }
    return true;
  }, [processedCampaign.scenarios, processedCampaign.campaignLog, campaignGuide, campaignState]);

  return (
    <>
      <BasicButton
        title={t`Add side scenario`}
        onPress={onPress}
        disabled={!canAddScenario}
      />
      { !canAddScenario && (
        <View style={[space.marginTopM, space.marginBottomL, space.marginSideM]}>
          <Text style={typography.text}>
            { t`Side scenarios cannot be added to a campaign until the previous scenario and following interludes are completed.` }
          </Text>
        </View>
      ) }
    </>
  );
}
