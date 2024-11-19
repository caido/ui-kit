import PrimeVue from 'primevue/config'
import { defineSetupVue3 } from '@histoire/plugin-vue'
import { Classic } from '../../classic'
import Wrapper from './Wrapper.vue'

import './setup.css'

export const setupVue3 = defineSetupVue3(({ app, story, variant, addWrapper }) => {
  addWrapper(Wrapper)

  app.use(PrimeVue, {
    unstyled: true,
    pt: Classic,
  })
})