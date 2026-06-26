import type { ComponentType } from 'react'

import { PanelLayout } from '#/widgets/panel-layout/ui/PanelLayout'

// Wrap a cabinet page component so it renders inside the sidebar shell.
export function withPanel<TProps extends object>(Component: ComponentType<TProps>) {
  return function PanelWrapped(props: TProps) {
    return (
      <PanelLayout>
        <Component {...props} />
      </PanelLayout>
    )
  }
}
