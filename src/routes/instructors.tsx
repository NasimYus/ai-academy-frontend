import { createFileRoute } from '@tanstack/react-router'

import { InstructorsPage } from '#/pages/instructors'

export const Route = createFileRoute('/instructors')({ component: InstructorsPage })
