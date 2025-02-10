import type { MaybeRef } from '@vue/reactivity';
import type { StageDefinition } from './overlay';
import { toValue } from '@vue/reactivity';
import { useGlobalState } from '../../store';
import { createOverlaySvg, transitionStage } from './overlay';
import { showPopover } from './popover';

export async function showStep(
  referenceEl: MaybeRef<HTMLElement>,
  createTooltipEl: () => MaybeRef<HTMLElement>,
  stages: StageDefinition[] | (() => StageDefinition[]),
): Promise<[() => void, () => void]> {
  const state = useGlobalState();

  // ---

  if (state.tooltip.value) {
    state.tooltip.value[1]();
  }

  const [tooltipEle, destoryTooltip] = showPopover(
    referenceEl,
    createTooltipEl,
  );

  state.tooltip.value = [tooltipEle, destoryTooltip];

  // ---

  if (!state.overlayDom.value) {
    const overlaySvg = createOverlaySvg(
      toValue(stages),
      {
        stagePadding: 4,
        stageRadius: 4,
      },
    );

    document.body.appendChild(overlaySvg);

    state.overlayDom.value = overlaySvg;
  }
  else {
    await transitionStage(
      toValue(stages),
      {
        stagePadding: 4,
        stageRadius: 4,
      },
    );
  }

  const destoryOverlay: () => void = () => {
    state.overlayDom.value?.remove();
    state.overlayDom.value = undefined;
  };

  return [
    destoryOverlay,
    destoryTooltip,
  ];
}
