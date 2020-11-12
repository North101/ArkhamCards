import { Action } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';

import { AppState } from '@reducers';
import {
  EditDeckState,
  DeckMeta,
  UPDATE_DECK_EDIT,
  UPDATE_DECK_EDIT_COUNTS,
  UpdateDeckEditAction,
  UpdateDeckEditCountsAction,
} from '@actions/types';


export function incIgnoreDeckSlot(id: number, code: string, limit?: number): UpdateDeckEditCountsAction {
  return {
    type: UPDATE_DECK_EDIT_COUNTS,
    id,
    code: code,
    operation: 'inc',
    limit,
    countType: 'ignoreDeckLimitSlots',
  };
}

export function decIgnoreDeckSlot(id: number, code: string): UpdateDeckEditCountsAction {
  return {
    type: UPDATE_DECK_EDIT_COUNTS,
    id,
    code: code,
    operation: 'dec',
    countType: 'ignoreDeckLimitSlots',
  };
}

export function setIgnoreDeckSlot(id: number, code: string, value: number): UpdateDeckEditCountsAction {
  return {
    type: UPDATE_DECK_EDIT_COUNTS,
    id,
    code: code,
    value,
    operation: 'set',
    countType: 'ignoreDeckLimitSlots',
  };
}

export function incDeckSlot(id: number, code: string, limit?: number): UpdateDeckEditCountsAction {
  return {
    type: UPDATE_DECK_EDIT_COUNTS,
    id,
    code: code,
    operation: 'inc',
    limit,
    countType: 'slots',
  };
}

export function decDeckSlot(id: number, code: string): UpdateDeckEditCountsAction {
  return {
    type: UPDATE_DECK_EDIT_COUNTS,
    id,
    code: code,
    operation: 'dec',
    countType: 'slots',
  };
}

export function setDeckSlot(id: number, code: string, value: number): UpdateDeckEditCountsAction {
  return {
    type: UPDATE_DECK_EDIT_COUNTS,
    id,
    code: code,
    operation: 'set',
    value,
    countType: 'slots',
  };
}

export function setDeckTabooSet(id: number, tabooSetId: number): UpdateDeckEditAction {
  return {
    type: UPDATE_DECK_EDIT,
    id,
    updates: {
      tabooSetChange: tabooSetId,
    },
  };
}

export function setDeckXpAdjustment(id: number, xpAdjustment: number): UpdateDeckEditAction {
  return {
    type: UPDATE_DECK_EDIT,
    id,
    updates: {
      xpAdjustment,
    },
  };
}

export function updateDeckMeta(
  id: number,
  investigator_code: string,
  deckEdits: EditDeckState,
  key: keyof DeckMeta,
  value?: string
): ThunkAction<void, AppState, unknown, Action> {
  return (dispatch: ThunkDispatch<AppState, unknown, UpdateDeckEditAction | UpdateDeckEditCountsAction>): void => {
    const updatedMeta = {
      ...deckEdits.meta,
      [key]: value,
    };

    if (value === undefined) {
      delete updatedMeta[key];
    } else {
      if (investigator_code === '06002' && key === 'deck_size_selected') {
        dispatch(setDeckSlot(id, '06008', (parseInt(value, 10) - 20) / 10));
      }
    }

    dispatch({
      type: UPDATE_DECK_EDIT,
      id,
      updates: {
        meta: updatedMeta,
      },
    });
  };
}