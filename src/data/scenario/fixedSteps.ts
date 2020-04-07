import { filter, find, map } from 'lodash';
import { t } from 'ttag';

import {
  ConditionalEffectsChoice,
  InvestigatorStatus,
  GenericStep,
  BranchStep,
  Resolution,
  InputStep,
  Step,
  Scenario,
} from 'data/scenario/types';
import GuidedCampaignLog from 'data/scenario/GuidedCampaignLog';

const CHECK_INVESTIGATOR_DEFEAT_RESOLUTION_ID = '$check_investigator_defeat';
function checkInvestigatorDefeatStep(resolutions: Resolution[]): BranchStep {
  const investigatorDefeat = find(resolutions, resolution => resolution.id === 'investigator_defeat');
  return {
    id: CHECK_INVESTIGATOR_DEFEAT_RESOLUTION_ID,
    type: 'branch',
    condition: {
      type: 'scenario_data',
      scenario_data: 'investigator_status',
      investigator: 'defeated',
      options: [
        {
          boolCondition: true,
          steps: [
            '$r_investigator_defeat',
            ...(investigatorDefeat ? investigatorDefeat.steps : []),
          ],
        },
      ],
    },
  };
}

const CHOOSE_RESOLUTION_STEP_ID = '$choose_resolution';
function chooseResolutionStep(resolutions: Resolution[]): InputStep {
  const hasInvestigatorDefeat = !!find(
    resolutions,
    resolution => resolution.id === 'investigator_defeat');

  return {
    id: CHOOSE_RESOLUTION_STEP_ID,
    type: 'input',
    title: 'Resolutions',
    text: 'Select resolution',
    bullet_type: 'none',
    input: {
      type: 'choose_one',
      style: 'picker',
      choices: map(
        filter(resolutions, resolution => resolution.id !== 'investigator_defeat'),
        resolution => {
          const choice: ConditionalEffectsChoice = {
            id: resolution.id,
            text: resolution.title,
            steps: [
              investigatorStatusStepId(resolution),
              ...(hasInvestigatorDefeat ? [CHECK_INVESTIGATOR_DEFEAT_RESOLUTION_ID] : []),
              `$r_${resolution.id}`,
              ...resolution.steps,
              PROCEED_STEP_ID,
            ],
            effects: [{
              type: 'scenario_data',
              setting: 'scenario_status',
              status: 'resolution',
              resolution: resolution.id,
            }],
          };
          return choice;
        }
      ),
    },
  };
}

const PROCEED_STEP_ID = '$proceed';

const CHOOSE_INVESTIGATORS_STEP: InputStep = {
  id: '$choose_investigators',
  type: 'input',
  input: {
    type: 'scenario_investigators',
  },
};

const UPGRADE_DECKS_STEP: InputStep = {
  id: '$upgrade_decks',
  type: 'input',
  input: {
    type: 'upgrade_decks',
  },
};

const LEAD_INVESTIGATOR_STEP: InputStep = {
  id: '$lead_investigator',
  type: 'input',
  text: t`Choose lead investigator`,
  input: {
    type: 'investigator_choice',
    investigator: 'any',
    source: 'scenario',
    choices: [
      {
        id: 'lead',
        text: t`Lead Investigator`,
        effects: [
          {
            type: 'scenario_data',
            setting: 'lead_investigator',
            investigator: '$input_value',
          },
          {
            type: 'scenario_data',
            setting: 'scenario_status',
            status: 'started',
          },
        ],
      },
    ],
  },
};


function resolutionStep(
  id: string,
  resolutions: Resolution[]
): Step | undefined {
  if (!id.startsWith('$r_')) {
    return undefined;
  }
  const statusStep = investigatorStatusStep(id, resolutions);
  if (statusStep) {
    return statusStep;
  }
  const resolution = id.substring(3);
  return {
    id,
    type: 'resolution',
    generated: true,
    resolution,
  };
}

const INVESTIGATOR_STATUS_STEP_SUFFIX = 'investigator_status';
function investigatorStatusStepId(resolution: Resolution) {
  return `$r_${resolution.id}#${INVESTIGATOR_STATUS_STEP_SUFFIX}`;
}

function statusToString(
  status: InvestigatorStatus
): string {
  switch (status) {
    case 'alive': return t`Alive`;
    case 'resigned': return t`Resigned`;
    case 'physical': return t`Eliminated by damage`;
    case 'mental': return t`Eliminated by horror`;
    case 'eliminated': return t`Eliminated by scenario`;
  }
}

function investigatorStatusStep(
  id: string,
  resolutions: Resolution[]
): InputStep | undefined {
  if (!id.startsWith('$r_') || id.indexOf('#') === -1) {
    return undefined;
  }
  const [resolutionId, stepType] = id.substring(3).split('#');
  if (stepType !== INVESTIGATOR_STATUS_STEP_SUFFIX) {
    return undefined;
  }
  const resolution = find(resolutions, r => r.id === resolutionId);
  if (!resolution) {
    return undefined;
  }
  const defaultStatuses: InvestigatorStatus[] = [
    'alive',
    'resigned',
    'physical',
    'mental',
    'eliminated',
  ];
  const choices: ConditionalEffectsChoice[] = map(
    resolution.investigator_status || defaultStatuses,
    status => {
      return {
        id: status,
        text: statusToString(status),
        effects: [
          {
            type: 'scenario_data',
            setting: 'investigator_status',
            investigator: '$input_value',
            investigator_status: status,
          },
        ],
      };
    }
  );
  return {
    id,
    type: 'input',
    text: t`Investigator status at end of scenario:`,
    input: {
      type: 'investigator_choice',
      investigator: 'all',
      source: 'scenario',
      choices,
    },
  };
}

export function getFixedStep(
  id: string,
  scenario: Scenario,
  campaignLog: GuidedCampaignLog
): Step | undefined {
  switch (id) {
    case CHOOSE_RESOLUTION_STEP_ID:
      return chooseResolutionStep(scenario.resolutions || []);
    case CHECK_INVESTIGATOR_DEFEAT_RESOLUTION_ID:
      return checkInvestigatorDefeatStep(scenario.resolutions || []);
    case PROCEED_STEP_ID:
      return {
        id: PROCEED_STEP_ID,
        text: t`Proceed to the next scenario`,
        effects: [
          {
            type: 'scenario_data',
            setting: 'scenario_status',
            status: 'completed',
          },
        ],
      };
    case CHOOSE_INVESTIGATORS_STEP.id:
      return CHOOSE_INVESTIGATORS_STEP;
    case UPGRADE_DECKS_STEP.id:
      return UPGRADE_DECKS_STEP;
    case LEAD_INVESTIGATOR_STEP.id:
      return LEAD_INVESTIGATOR_STEP;
    default:
      return resolutionStep(id, scenario.resolutions || []);
  }
}

export function scenarioStepIds(scenario: Scenario) {
  return (scenario.type === 'interlude' || scenario.type === 'epilogue') ?
    [
      ...scenario.setup,
      PROCEED_STEP_ID,
    ] : [
      CHOOSE_INVESTIGATORS_STEP.id,
      LEAD_INVESTIGATOR_STEP.id,
      ...scenario.setup,
    ];
}