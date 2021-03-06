import { Campaign } from '@actions/types';
import { ChaosBag } from '@app_constants';
import Card from '@data/Card';
import { map } from 'lodash';
import { Navigation } from 'react-native-navigation';
import { t } from 'ttag';
import { AddScenarioResultProps } from './AddScenarioResultView';
import { CampaignChaosBagProps } from './CampaignChaosBagView';
import { CampaignDrawWeaknessProps } from './CampaignDrawWeaknessDialog';

import { CampaignScenarioProps } from './CampaignScenarioView';
import { EditChaosBagProps } from './EditChaosBagDialog';
import { OddsCalculatorProps } from './OddsCalculatorView';

export function showCampaignScenarios(componentId: string, campaignId: number) {
  Navigation.push<CampaignScenarioProps>(componentId, {
    component: {
      name: 'Campaign.Scenarios',
      passProps: {
        id: campaignId,
      },
      options: {
        topBar: {
          title: {
            text: t`Scenarios`,
          },
          backButton: {
            title: t`Back`,
          },
        },
      },
    },
  });
}

export function showAddScenarioResult(componentId: string, campaignId: number) {
  Navigation.push<AddScenarioResultProps>(componentId, {
    component: {
      name: 'Campaign.AddResult',
      passProps: {
        id: campaignId,
      },
    },
  });
}

export function showEditChaosBag(componentId: string, campaign: Campaign, updateChaosBag: (chaosBag: ChaosBag) => void) {
  Navigation.push<EditChaosBagProps>(componentId, {
    component: {
      name: 'Dialog.EditChaosBag',
      passProps: {
        chaosBag: campaign.chaosBag,
        updateChaosBag,
        trackDeltas: true,
      },
      options: {
        topBar: {
          title: {
            text: t`Chaos Bag`,
          },
        },
      },
    },
  });
}

export function showDrawChaosBag(componentId: string, campaignId: number, updateChaosBag: (chaosBag: ChaosBag) => void) {
  Navigation.push<CampaignChaosBagProps>(componentId, {
    component: {
      name: 'Campaign.ChaosBag',
      passProps: {
        campaignId,
        updateChaosBag,
      },
      options: {
        topBar: {
          title: {
            text: t`Chaos Bag`,
          },
          backButton: {
            title: t`Back`,
          },
        },
      },
    },
  });
}

export function showChaosBagOddsCalculator(componentId: string, campaignId: number, allInvestigators: Card[]) {
  Navigation.push<OddsCalculatorProps>(componentId, {
    component: {
      name: 'OddsCalculator',
      passProps: {
        campaignId,
        investigatorIds: map(allInvestigators, card => card.code),
      },
      options: {
        topBar: {
          title: {
            text: t`Odds Calculator`,
          },
          backButton: {
            title: t`Back`,
          },
        },
      },
    },
  });
}

export function showDrawWeakness(componentId: string, campaignId: number) {
  Navigation.push<CampaignDrawWeaknessProps>(componentId, {
    component: {
      name: 'Dialog.CampaignDrawWeakness',
      passProps: {
        campaignId,
      },
      options: {
        topBar: {
          title: {
            text: t`Draw Weaknesses`,
          },
          backButton: {
            title: t`Back`,
          },
        },
      },
    },
  });
}