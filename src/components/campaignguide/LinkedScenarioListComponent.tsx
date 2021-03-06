import React, { useMemo } from 'react';
import { find } from 'lodash';

import { showScenario } from './nav';
import CampaignGuideSummary from './CampaignGuideSummary';
import ScenarioListComponent from './ScenarioListComponent';
import { ProcessedCampaign } from '@data/scenario';
import CampaignGuideContext, { CampaignGuideContextType } from '@components/campaignguide/CampaignGuideContext';

interface Props {
  componentId: string;
  campaignA: ProcessedCampaign;
  campaignDataA: CampaignGuideContextType;
  campaignB: ProcessedCampaign;
  campaignDataB: CampaignGuideContextType;
}

class CampaignLinkHelper {
  componentId: string;
  campaignA: ProcessedCampaign;
  campaignDataA: CampaignGuideContextType;
  campaignB: ProcessedCampaign;
  campaignDataB: CampaignGuideContextType;

  constructor(
    componentId: string,
    campaignA: ProcessedCampaign,
    campaignDataA: CampaignGuideContextType,
    campaignB: ProcessedCampaign,
    campaignDataB: CampaignGuideContextType
  ) {
    this.componentId = componentId;
    this.campaignA = campaignA;
    this.campaignDataA = campaignDataA;
    this.campaignB = campaignB;
    this.campaignDataB = campaignDataB;
  }

  showCampaignScenarioA = (scenarioId: string) => {
    const scenario = find(
      this.campaignA.scenarios,
      scenario => scenario.id.encodedScenarioId === scenarioId
    );
    if (scenario) {
      showScenario(
        this.componentId,
        scenario,
        this.campaignDataA.campaignId,
        this.campaignDataA.campaignState,
        this.campaignDataA.campaignGuide.campaignName(),
        this.showCampaignScenarioB
      );
    }
  };

  showCampaignScenarioB = (scenarioId: string) => {
    const scenario = find(
      this.campaignB.scenarios,
      scenario => scenario.id.encodedScenarioId === scenarioId
    );
    if (scenario) {
      showScenario(
        this.componentId,
        scenario,
        this.campaignDataB.campaignId,
        this.campaignDataB.campaignState,
        this.campaignDataB.campaignGuide.campaignName(),
        this.showCampaignScenarioA
      );
    }
  };
}

export default function LinkedScenarioListComponent({ componentId, campaignA, campaignDataA, campaignB, campaignDataB }: Props) {
  const linkHelper = useMemo(() => {
    return new CampaignLinkHelper(componentId, campaignA, campaignDataA, campaignB, campaignDataB);
  }, [componentId, campaignA, campaignDataA, campaignB, campaignDataB]);

  return (
    <>
      <CampaignGuideSummary
        difficulty={campaignA.campaignLog.campaignData.difficulty}
        campaignGuide={campaignDataA.campaignGuide}
        inverted
      />
      <CampaignGuideContext.Provider value={campaignDataA}>
        <ScenarioListComponent
          campaignId={campaignDataA.campaignId}
          campaignData={campaignDataA}
          processedCampaign={campaignA}
          componentId={componentId}
          showLinkedScenario={linkHelper.showCampaignScenarioB}
        />
      </CampaignGuideContext.Provider>
      <CampaignGuideSummary
        difficulty={campaignB.campaignLog.campaignData.difficulty}
        campaignGuide={campaignDataB.campaignGuide}
        inverted
      />
      <CampaignGuideContext.Provider value={campaignDataB}>
        <ScenarioListComponent
          campaignId={campaignDataB.campaignId}
          campaignData={campaignDataB}
          processedCampaign={campaignB}
          componentId={componentId}
          showLinkedScenario={linkHelper.showCampaignScenarioA}
        />
      </CampaignGuideContext.Provider>
    </>
  );
}
