import React from 'react';
import Card from '@data/Card';
import DeckQuantityComponent from './DeckQuantityComponent';
import { CardCount } from './CardCount';
import CardUpgradeButton from './CardUpgradeButton';
import CardToggle from './CardToggle';
import CardQuantityComponent from './CardQuantityComponent';
import { EditSlotsActions } from '@components/core/hooks';

export type ControlType = {
  type: 'deck';
  deckId: number;
  limit: number;
} | {
  type: 'quantity';
  count: number;
  countChanged: EditSlotsActions;
  limit: number;
  showZeroCount: boolean;
} | {
  type: 'count';
  count: number;
  deltaCountMode?: boolean;
  showZeroCount?: boolean;
} | {
  type: 'upgrade';
  count: number;
  onUpgradePress?: (card: Card) => void;
} | {
  type: 'toggle';
  value: boolean;
  toggleValue: (value: boolean) => void;
} | {
  type: 'count_with_toggle',
  count: number;
  value: boolean;
  toggleValue: (value: boolean) => void;
}

interface Props {
  card: Card;
  control: ControlType;
}
export function ControlComponent({ card, control }: Props) {
  switch (control.type) {
    case 'deck':
      return <DeckQuantityComponent deckId={control.deckId} limit={control.limit} code={card.code} />;
    case 'count':
      return <CardCount count={control.count} deltaCountMode={control.deltaCountMode} showZeroCount={control.showZeroCount} />;
    case 'upgrade':
      return <CardUpgradeButton count={control.count} onUpgradePress={control.onUpgradePress} card={card} />;
    case 'toggle':
      return <CardToggle value={control.value} toggleValue={control.toggleValue} />;
    case 'count_with_toggle':
      return (
        <>
          <CardCount count={control.count} />
          <CardToggle value={control.value} toggleValue={control.toggleValue} />
        </>
      );
    case 'quantity':
      return (
        <CardQuantityComponent
          code={card.code}
          count={control.count}
          countChanged={control.countChanged}
          limit={control.limit}
          showZeroCount={control.showZeroCount}
        />
      );
  }
}