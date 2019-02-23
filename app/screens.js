import { Navigation } from 'react-native-navigation';

import SearchMultiSelectView from '../components/SearchMultiSelectView';
import DeckDetailView from '../components/DeckDetailView';
import DeckEditView from '../components/DeckEditView';
import CardSearchView from '../components/CardSearchView';
import TuneButton from '../components/CardSearchComponent/TuneButton';
import CardDetailView from '../components/CardDetailView';
import CardFaqView from '../components/CardFaqView';
import CardImageView from '../components/CardImageView';
import InvestigatorCardsView from '../components/InvestigatorCardsView';
import AddScenarioResultView from '../components/campaign/AddScenarioResultView';
import CampaignDetailView from '../components/campaign/CampaignDetailView';
import CampaignEditWeaknessDialog from '../components/campaign/CampaignEditWeaknessDialog';
import CampaignDrawWeaknessDialog from '../components/campaign/CampaignDrawWeaknessDialog';
import CampaignDifficultyDialog from '../components/campaign/CampaignDifficultyDialog';
import EditChaosBagDialog from '../components/campaign/EditChaosBagDialog';
import MyCampaignsView from '../components/campaign/MyCampaignsView';
import NewCampaignView from '../components/campaign/NewCampaignView';
import SelectCampaignDialog from '../components/campaign/SelectCampaignDialog';
import MyDecksSelectorDialog from '../components/campaign/MyDecksSelectorDialog';
import CampaignScenarioView from '../components/campaign/CampaignScenarioView';
import MyDecksView from '../components/MyDecksView';
import NewDeckView from '../components/NewDeckView';
import DrawSimulatorView from '../components/DrawSimulatorView';
import DeckChartsView from '../components/DeckChartsView';
import DeckUpgradeDialog from '../components/DeckUpgradeDialog';
import CardFilterView from '../components/filter/CardFilterView';
import CardEnemyFilterView from '../components/filter/CardEnemyFilterView';
import CardLocationFilterView from '../components/filter/CardLocationFilterView';
import PackFilterView from '../components/filter/PackFilterView';
import WebViewWrapper from '../components/WebViewWrapper';
import SettingsView from '../components/settings/SettingsView';
import LanguageDialog from '../components/settings/LanguageDialog';
import DiagnosticsView from '../components/settings/DiagnosticsView';
import PackCardsView from '../components/PackCardsView';
import SpoilersView from '../components/SpoilersView';
import CollectionEditView from '../components/CollectionEditView';
import CardSortDialog from '../components/CardSortDialog';
import InvestigatorSortDialog from '../components/InvestigatorSortDialog';
import ScenarioDialog from '../components/ScenarioDialog';
import ExileCardDialog from '../components/ExileCardDialog';
import AboutView from '../components/AboutView';
import NewWeaknessSetDialog from '../components/weakness/NewWeaknessSetDialog';
import WeaknessSetView from '../components/weakness/WeaknessSetView';
import WeaknessSetChooserView from '../components/weakness/WeaknessSetChooserView';
import WeaknessDrawDialog from '../components/weakness/WeaknessDrawDialog';
import EditAssignedWeaknessDialog from '../components/weakness/EditAssignedWeaknessDialog';

// register all screens of the app (including internal ones)
export function registerScreens(Provider, store) {
  Navigation.registerComponentWithRedux('About', () => AboutView, Provider, store);
  Navigation.registerComponentWithRedux('Browse.Cards', () => CardSearchView, Provider, store);
  Navigation.registerComponentWithRedux('Browse.InvestigatorCards', () => InvestigatorCardsView, Provider, store);
  Navigation.registerComponentWithRedux('Deck', () => DeckDetailView, Provider, store);
  Navigation.registerComponentWithRedux('Deck.Charts', () => DeckChartsView, Provider, store);
  Navigation.registerComponentWithRedux('Deck.DrawSimulator', () => DrawSimulatorView, Provider, store);
  Navigation.registerComponentWithRedux('Deck.Edit', () => DeckEditView, Provider, store);
  Navigation.registerComponentWithRedux('Deck.Upgrade', () => DeckUpgradeDialog, Provider, store);
  Navigation.registerComponentWithRedux('Deck.New', () => NewDeckView, Provider, store);
  Navigation.registerComponentWithRedux('Card', () => CardDetailView, Provider, store);
  Navigation.registerComponentWithRedux('Card.Faq', () => CardFaqView, Provider, store);
  Navigation.registerComponentWithRedux('Card.Image', () => CardImageView, Provider, store);
  Navigation.registerComponentWithRedux('My.Campaigns', () => MyCampaignsView, Provider, store);
  Navigation.registerComponentWithRedux('My.Decks', () => MyDecksView, Provider, store);
  Navigation.registerComponentWithRedux('Campaign', () => CampaignDetailView, Provider, store);
  Navigation.registerComponentWithRedux('Campaign.New', () => NewCampaignView, Provider, store);
  Navigation.registerComponentWithRedux('Campaign.AddResult', () => AddScenarioResultView, Provider, store);
  Navigation.registerComponentWithRedux('Campaign.Scenarios', () => CampaignScenarioView, Provider, store);
  Navigation.registerComponentWithRedux('Settings', () => SettingsView, Provider, store);
  Navigation.registerComponentWithRedux('Settings.Diagnostics', () => DiagnosticsView, Provider, store);
  Navigation.registerComponentWithRedux('SearchFilters', () => CardFilterView, Provider, store);
  Navigation.registerComponentWithRedux('SearchFilters.Enemy', () => CardEnemyFilterView, Provider, store);
  Navigation.registerComponentWithRedux('SearchFilters.Location', () => CardLocationFilterView, Provider, store);
  Navigation.registerComponentWithRedux('SearchFilters.Packs', () => PackFilterView, Provider, store);
  Navigation.registerComponentWithRedux('SearchFilters.Chooser', () => SearchMultiSelectView, Provider, store);
  Navigation.registerComponentWithRedux('My.Collection', () => CollectionEditView, Provider, store);
  Navigation.registerComponentWithRedux('Pack', () => PackCardsView, Provider, store);
  Navigation.registerComponentWithRedux('My.Spoilers', () => SpoilersView, Provider, store);
  Navigation.registerComponentWithRedux('WebView', () => WebViewWrapper, Provider, store);
  Navigation.registerComponentWithRedux('Dialog.Language', () => LanguageDialog, Provider, store);
  Navigation.registerComponentWithRedux('Dialog.DeckSelector', () => MyDecksSelectorDialog, Provider, store);
  Navigation.registerComponentWithRedux('Dialog.EditChaosBag', () => EditChaosBagDialog, Provider, store);
  Navigation.registerComponentWithRedux('Dialog.ExileCards', () => ExileCardDialog, Provider, store);
  Navigation.registerComponentWithRedux('Dialog.Sort', () => CardSortDialog, Provider, store);
  Navigation.registerComponentWithRedux('Dialog.InvestigatorSort', () => InvestigatorSortDialog, Provider, store);
  Navigation.registerComponentWithRedux('Dialog.Scenario', () => ScenarioDialog, Provider, store);
  Navigation.registerComponentWithRedux('Dialog.Campaign', () => SelectCampaignDialog, Provider, store);
  Navigation.registerComponentWithRedux('Dialog.CampaignDifficulty', () => CampaignDifficultyDialog, Provider, store);
  Navigation.registerComponentWithRedux('Dialog.CampaignDrawWeakness', () => CampaignDrawWeaknessDialog, Provider, store);
  Navigation.registerComponentWithRedux('Dialog.CampaignEditWeakness', () => CampaignEditWeaknessDialog, Provider, store);
  Navigation.registerComponentWithRedux('Weakness.New', () => NewWeaknessSetDialog, Provider, store);
  Navigation.registerComponentWithRedux('Weakness.Chooser', () => WeaknessSetChooserView, Provider, store);
  Navigation.registerComponentWithRedux('Weakness.Detail', () => WeaknessSetView, Provider, store);
  Navigation.registerComponentWithRedux('Weakness.Draw', () => WeaknessDrawDialog, Provider, store);
  Navigation.registerComponentWithRedux('Weakness.EditAssigned', () => EditAssignedWeaknessDialog, Provider, store);
  Navigation.registerComponentWithRedux('TuneButton', () => TuneButton, Provider, store);
}
