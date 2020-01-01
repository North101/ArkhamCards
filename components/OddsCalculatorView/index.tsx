import React from 'react';
<<<<<<< Updated upstream
import { filter, find, flatMap, forEach, head, map } from 'lodash';
=======
import { filter, find, forEach, head, map } from 'lodash';
>>>>>>> Stashed changes
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { CardResults, connectRealm } from 'react-native-realm';
import { EventSubscription, Navigation } from 'react-native-navigation';
import { t } from 'ttag';
import { Results } from 'realm';
<<<<<<< Updated upstream
import LinearGradient from 'react-native-linear-gradient';
=======
>>>>>>> Stashed changes

import { Campaign, CampaignDifficulty, CUSTOM, Deck } from '../../actions/types';
import { NavigationProps } from '../types';
import Card from '../../data/Card';
import { AppState } from '../../reducers';
import typography from '../../styles/typography';
<<<<<<< Updated upstream
import { ChaosBag, CHAOS_TOKEN_COLORS, SPECIAL_TOKENS, SpecialTokenValue } from '../../constants';
import VariableTokenInput from './VariableTokenInput';
import { CAMPAIGN_COLORS, campaignScenarios, Scenario, completedScenario } from '../campaign/constants';
import { s } from '../../styles/space';
import ChaosBagLine from '../core/ChaosBagLine';
import PlusMinusButtons from '../core/PlusMinusButtons';
import withDimensions, { DimensionsProps } from '../core/withDimensions';
=======
import { ChaosBag, ChaosTokenValue, SPECIAL_TOKENS, SpecialTokenValue } from '../../constants';
import { CAMPAIGN_COLORS, campaignScenarios, Scenario, completedScenario } from '../campaign/constants';
import { s } from '../../styles/space';
import PlusMinusButtons from '../core/PlusMinusButtons';
>>>>>>> Stashed changes
import Difficulty from '../campaign/Difficulty';
import GameHeader from '../campaign/GameHeader';
import BackgroundIcon from '../campaign/BackgroundIcon';
import CardTextComponent from '../CardTextComponent';
import InvestigatorOddsComponent from './InvestigatorOddsComponent';
import { add, subtract } from './oddsHelper';

export interface OddsCalculatorProps {
  campaign: Campaign;
  allInvestigators: Card[];
}

interface ReduxProps {
  chaosBag?: ChaosBag;
  deck?: Deck;
  tabooSetId?: number;
  cycleScenarios?: Scenario[];
  scenarioByCode?: { [code: string]: Scenario };
}

interface RealmProps {
  scenarioCards?: Results<Card>;
}

<<<<<<< Updated upstream
type Props = NavigationProps & OddsCalculatorProps & ReduxProps & RealmProps & DimensionsProps;
=======
type Props = NavigationProps & OddsCalculatorProps & ReduxProps & RealmProps;
>>>>>>> Stashed changes

interface State {
  currentScenario?: Scenario;
  currentScenarioCard?: Card;
  difficulty?: string;
  testDifficulty: number;
  specialTokenValues: SpecialTokenValue[];
<<<<<<< Updated upstream
  xValue: { [token: string]: number };
=======
>>>>>>> Stashed changes
}

class OddsCalculatorView extends React.Component<Props, State> {
  static get options() {
    return {
      topBar: {
        title: {
          text: t`Odds Calculator`,
        },
        backButton: {
          title: t`Back`,
          testID: t`Back`,
        },
      },
    };
  }

  _navEventListener?: EventSubscription;

  constructor(props: Props) {
    super(props);

    const hasCompletedScenario = completedScenario(props.campaign ? props.campaign.scenarioResults : []);
    const currentScenario = head(
      filter(props.cycleScenarios, scenario =>
        !scenario.interlude &&
        !hasCompletedScenario(scenario)
      )
    ) || undefined;

    const currentScenarioCard = (props.scenarioCards &&
      currentScenario &&
      find(props.scenarioCards, card => card.encounter_code === currentScenario.code)
    );
    const difficulty = props.campaign ? props.campaign.difficulty : undefined;
    this.state = {
      currentScenario,
      currentScenarioCard,
      difficulty,
      testDifficulty: 0,
<<<<<<< Updated upstream
      specialTokenValues: OddsCalculatorView.parseSpecialTokenValues(currentScenarioCard, difficulty),
      xValue: {
        skull: 0,
        cultist: 0,
        tablet: 0,
        elder_thing: 0,
      },
=======
      specialTokenValues: OddsCalculatorView.getSpecialTokenValues(currentScenarioCard, difficulty),
>>>>>>> Stashed changes
    };

    this._navEventListener = Navigation.events().bindComponent(this);
  }

  componentWillUnmount() {
    this._navEventListener && this._navEventListener.remove();
  }

  _showScenarioDialog = () => {
    const {
      currentScenario,
    } = this.state;
    if (!currentScenario) {
      return;
    }
    Navigation.showOverlay({
      component: {
        name: 'Dialog.Scenario',
        passProps: {
          scenarioChanged: this._scenarioChanged,
          scenarios: this.possibleScenarios(),
          selected: currentScenario.name,
        },
        options: {
          layout: {
            backgroundColor: 'rgba(128,128,128,.75)',
          },
        },
      },
    });
  };

  _scenarioChanged = (value: string) => {
    const {
      scenarioCards,
      cycleScenarios,
<<<<<<< Updated upstream
      campaign,
    } = this.props;
    const difficulty = campaign ? campaign.difficulty : undefined;
    const currentScenario = find(cycleScenarios, scenario => scenario.name === value);
    const currentScenarioCard = scenarioCards &&
      currentScenario &&
      find(scenarioCards, card => card.encounter_code === currentScenario.code);
    const specialTokenValues = OddsCalculatorView.parseSpecialTokenValues(
      currentScenarioCard,
      difficulty
    );
    this.setState({
      currentScenario,
      currentScenarioCard,
      specialTokenValues,
    });
  };

  static parseSpecialTokenValues(
=======
    } = this.props;
    const scenario = find(cycleScenarios, scenario => scenario.name === value);
    this.setState({
      currentScenario: scenario,
      currentScenarioCard: scenarioCards && scenario && head(scenarioCards.filter(card => card.encounter_code === scenario.code)),
    });
  };

  static getSpecialTokenValues(
>>>>>>> Stashed changes
    currentScenarioCard?: Card,
    difficulty?: string
  ): SpecialTokenValue[] {
    const scenarioTokens: SpecialTokenValue[] = [];
    if (currentScenarioCard) {
<<<<<<< Updated upstream
      let scenarioText = currentScenarioCard.text;
      if (difficulty === CampaignDifficulty.HARD ||
        difficulty === CampaignDifficulty.EXPERT) {
        scenarioText = currentScenarioCard.back_text;
      }
      if (scenarioText) {
        const linesByToken: { [token: string]: string } = {};
        forEach(
          scenarioText.split('\n'),
          line => {
            const token = find(SPECIAL_TOKENS, token =>
              line.startsWith(`[${token}]`));
            if (token) {
              linesByToken[token] = line;
            }
          });
        SPECIAL_TOKENS.forEach(token => {
          switch (token) {
            case 'elder_sign':
              scenarioTokens.push({
                token,
                value: 0,
              });
              break;
            case 'auto_fail':
              scenarioTokens.push({
                token,
                value: 'auto_fail',
              });
              break;
            default: {
              const line = linesByToken[token];
              if (line) {
                const valueRegex = new RegExp(`\\[(${token})\\]:?\\s([-+][0-9X])(\\. )?(.*)`);
                if (valueRegex.test(line)) {
                  const match = line.match(valueRegex);
                  if (match) {
                    if (match[2] === '-X') {
                      scenarioTokens.push({
                        token,
                        value: 'X',
                        xText: match[4],
                      });
                    } else {
                      scenarioTokens.push({
                        token,
                        value: parseFloat(match[2]) || 0,
                      });
                    }
                  }
                } else {
                  const revealAnotherRegex = new RegExp(`\\[(${token})\\]:?\\sReveal another (chaos )? token.`);
                  if (revealAnotherRegex.test(line)) {
                    scenarioTokens.push({
                      token,
                      value: 'reveal_another',
                    });
                  }
                }
              }
            }
          }
        });
      }
=======
      SPECIAL_TOKENS.forEach(token => {
        const valueRegex = new RegExp(`\\[(${token})\\]:?\\s([-+][0-9X])`);
        if (token === 'elder_sign') {
          scenarioTokens.push({
            token,
            value: 0,
            raw_value: '0',
          });
        }
        if (token === 'auto_fail') {
          scenarioTokens.push({
            token,
            value: 'auto_fail',
            raw_value: '-666',
          });
        }
        let scenarioText = currentScenarioCard.real_text;
        if (difficulty === CampaignDifficulty.HARD || difficulty === CampaignDifficulty.EXPERT) {
          scenarioText = currentScenarioCard.back_text;
        }
        if (scenarioText) {
          if (valueRegex.test(scenarioText)) {
            const match = scenarioText.match(valueRegex);
            if (match) {
              scenarioTokens.push({
                token,
                value: parseFloat(match[2]) || 0,
                raw_value: match[2],
              });
            }
          }
        }
      });
>>>>>>> Stashed changes
    }
    return scenarioTokens;
  }

<<<<<<< Updated upstream
  _incrementToken = (token: string) => {
    const { xValue } = this.state;
    this.setState({
      xValue: {
        ...xValue,
        [token]: xValue[token] + 1,
      },
    });
  };

  _decrementToken= (token: string) => {
    const { xValue } = this.state;
    this.setState({
      xValue: {
        ...xValue,
        [token]: xValue[token] - 1,
      },
    });
  };

  _incrementDifficulty = () => {
    this.modifyTestDifficulty(add);
  };

  _decrementDifficulty = () => {
=======
  _increment = () => {
    this.modifyTestDifficulty(add);
  };

  _decrement = () => {
>>>>>>> Stashed changes
    this.modifyTestDifficulty(subtract);
  };

  possibleScenarios() {
    const {
      cycleScenarios,
    } = this.props;
    return map(
      filter(
        cycleScenarios,
        scenario => !scenario.interlude
      ),
      card => card.name
    );
  }

  modifyTestDifficulty(calculate: Function) {
    const {
      testDifficulty,
    } = this.state;
    this.setState({
      testDifficulty: calculate(testDifficulty, 1),
    });
  }

<<<<<<< Updated upstream
  getSpecialTokenValues() {
    const {
      specialTokenValues,
      xValue,
    } = this.state;
    return map(specialTokenValues, tokenValue => {
      if (tokenValue.value === 'X') {
        return {
          token: tokenValue.token,
          value: -xValue[tokenValue.token],
        };
      }
      return tokenValue;
    });
  }

=======
>>>>>>> Stashed changes
  renderInvestigatorRows() {
    const {
      allInvestigators,
      chaosBag,
    } = this.props;
    const {
      difficulty,
      currentScenarioCard,
      testDifficulty,
<<<<<<< Updated upstream
=======
      specialTokenValues,
>>>>>>> Stashed changes
    } = this.state;
    if (!chaosBag || !currentScenarioCard) {
      return;
    }
<<<<<<< Updated upstream
    const specialTokenValues = this.getSpecialTokenValues();
    return allInvestigators.map((investigator) => (
      <InvestigatorOddsComponent
        key={investigator.real_name}
        investigator={investigator}
        difficulty={difficulty}
        testDifficulty={testDifficulty}
        chaosBag={chaosBag}
        specialTokenValues={specialTokenValues}
      />
    ));
  }

  renderSpecialTokenInputs() {
    const { specialTokenValues, xValue } = this.state;
    if (!find(specialTokenValues, value => value.value === 'X')) {
      return null;
    }
    return (
      <>
        { flatMap(specialTokenValues, token => {
          if (token.value !== 'X' || !token.xText) {
            return null;
          }
          return (
            <VariableTokenInput
              key={token.token}
              symbol={token.token}
              color={CHAOS_TOKEN_COLORS[token.token]}
              value={xValue[token.token]}
              text={token.xText}
              increment={this._incrementToken}
              decrement={this._decrementToken}
            />
          );
        })}
      </>
    );
=======
    return allInvestigators.map((investigator) => {
      return (
        <InvestigatorOddsComponent
          key={investigator.real_name}
          investigator={investigator}
          difficulty={difficulty}
          testDifficulty={testDifficulty}
          chaosBag={chaosBag}
          specialTokenValues={specialTokenValues}
        />
      );

    });
>>>>>>> Stashed changes
  }

  renderContent() {
    const {
      campaign,
<<<<<<< Updated upstream
      fontScale,
    } = this.props;
    const {
      difficulty,
=======
    } = this.props;
    const {
      difficulty,
      testDifficulty,
>>>>>>> Stashed changes
      currentScenario,
      currentScenarioCard,
    } = this.state;
    const scenarioText = currentScenarioCard && (
      (difficulty === CampaignDifficulty.HARD || difficulty === CampaignDifficulty.EXPERT) ?
        currentScenarioCard.back_text :
        currentScenarioCard.text
    );
    return (
      <>
        <View style={styles.sectionRow}>
          { campaign.cycleCode !== CUSTOM && !!currentScenario && (
            <BackgroundIcon
              code={currentScenario.code}
              color={CAMPAIGN_COLORS[campaign.cycleCode]}
            />
          ) }
<<<<<<< Updated upstream
          <View style={styles.button}>
=======
          <View>
>>>>>>> Stashed changes
            <Difficulty difficulty={campaign.difficulty} />
            { !!currentScenario && <GameHeader text={currentScenario.name} /> }
            { !!scenarioText && (
              <CardTextComponent text={scenarioText} />
            ) }
            <Button
              title={t`Change Scenario`}
              onPress={this._showScenarioDialog}
            />
          </View>
        </View>
<<<<<<< Updated upstream
        { this.renderSpecialTokenInputs() }
        <View style={styles.sectionRow}>
          <Text style={typography.label}>{ t`Chaos Bag` }</Text>
          <ChaosBagLine
            chaosBag={campaign.chaosBag}
            fontScale={fontScale}
=======
        <View style={[styles.sectionRow, styles.countRow]}>
          <Text style={typography.text}>{ t`Difficulty` }</Text>
          <Text style={[{ color: 'black', fontSize: 30, marginLeft: 10, marginRight: 10 }]}>
            { testDifficulty }
          </Text>
          <PlusMinusButtons
            count={testDifficulty}
            size={36}
            onIncrement={this._increment}
            onDecrement={this._decrement}
            allowNegative
            color="dark"
>>>>>>> Stashed changes
          />
        </View>
        { this.renderInvestigatorRows() }
      </>
    );
  }

  render() {
<<<<<<< Updated upstream
    const {
      testDifficulty,
    } = this.state;
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container}>
          { this.renderContent() }
          <View style={styles.finePrint}>
            <Text style={typography.small}>
              { t`Currently, this does not take into account scenario tokens that have a value of "-X" or tokens that make you draw additional tokens.` }
            </Text>
          </View>
        </ScrollView>
        <View style={styles.footer}>
          <LinearGradient
            colors={['#bdbdbd', '#ededed']}
            style={[styles.countRow, styles.footerRow]}
          >
            <Text style={typography.text}>{ t`Difficulty` }</Text>
            <Text style={[{ color: 'black', fontSize: 30, marginLeft: 10, marginRight: 10 }]}>
              { testDifficulty }
            </Text>
            <PlusMinusButtons
              count={testDifficulty}
              size={36}
              onIncrement={this._incrementDifficulty}
              onDecrement={this._decrementDifficulty}
              allowNegative
              color="dark"
            />
          </LinearGradient>
        </View>
      </View>
=======
    return (
      <ScrollView style={styles.container}>
        { this.renderContent() }
        <View style={styles.finePrint}>
          <Text style={typography.small}>
            { t`Currently, this does not take into account scenario tokens that have a value of "-X" or tokens that make you draw additional tokens.` }
          </Text>
        </View>
      </ScrollView>
>>>>>>> Stashed changes
    );
  }
}

function mapStateToProps(
  state: AppState,
  props: OddsCalculatorProps
): ReduxProps {
  const cycleScenarios = campaignScenarios(props.campaign.cycleCode);
  const scenarioByCode: { [code: string]: Scenario } = {};
  forEach(cycleScenarios, scenario => {
    scenarioByCode[scenario.code] = scenario;
  });
  return {
    chaosBag: props.campaign.chaosBag || {},
    cycleScenarios,
    scenarioByCode,
  };
}

export default connect(mapStateToProps)(
  connectRealm<NavigationProps & OddsCalculatorProps & ReduxProps, RealmProps, Card>(
<<<<<<< Updated upstream
    withDimensions(OddsCalculatorView),
=======
    OddsCalculatorView,
>>>>>>> Stashed changes
    {
      schemas: ['Card'],
      mapToProps(
        results: CardResults<Card>,
      ): RealmProps {
        return {
          scenarioCards: results.cards.filtered(`(type_code == 'scenario')`),
        };
      },
    })
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  sectionRow: {
    padding: s,
    borderBottomWidth: 1,
    borderColor: '#bdbdbd',
  },
<<<<<<< Updated upstream
  footer: {
    borderTopWidth: 1,
    borderColor: '#444',
  },
  footerRow: {
    padding: s,
  },
=======
>>>>>>> Stashed changes
  countRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  finePrint: {
    padding: s,
  },
<<<<<<< Updated upstream
  button: {
    padding: s,
  },
=======
>>>>>>> Stashed changes
});
