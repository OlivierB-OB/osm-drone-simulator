import { Tooltip as KTooltip } from '@kobalte/core/tooltip';
import type { JSX } from 'solid-js';

type Props = {
  content: string;
  contentClass?: string;
  children: JSX.Element;
};

export function Tooltip(props: Props) {
  return (
    <KTooltip>
      <KTooltip.Trigger as="span">{props.children}</KTooltip.Trigger>
      <KTooltip.Portal>
        <KTooltip.Content
          class={`z-50 rounded bg-gray-900 px-2 py-1 text-xs text-white shadow animate-in fade-in-0 zoom-in-95 ${props.contentClass ?? 'max-w-xs'}`}
        >
          <KTooltip.Arrow class="fill-gray-900" />
          {props.content}
        </KTooltip.Content>
      </KTooltip.Portal>
    </KTooltip>
  );
}
