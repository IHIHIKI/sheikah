import { generateId } from '@/utils'
import { Radon } from 'witnet-radon-js'
import Vue from 'vue'

export default {
  state: {
    templates: {},
    currentTemplate: {},
    currentRadonMarkupInterpreter: {},
    radRequest: {},
    history: [],
    historyIndex: 0,
    moveCarousel: false,
  },
  getters: {
    currentTemplate: state => {
      return state.currentTemplate
    },
  },
  mutations: {
    updateHistory(state, { mir }) {
      state.history.push(mir)
      state.historyIndex += 1
      state.history.splice(state.historyIndex + 1)
    },
    updateTemplate(state, { id, value }) {
      state.currentRadonMarkupInterpreter.updateMarkup(id, value)
      state.radRequest = state.currentRadonMarkupInterpreter.getMarkup()
      this.commit('updateHistory', { mir: state.currentRadonMarkupInterpreter.getMir() })
    },
    editorRedo(state) {
      const redolenght = state.currentRadonMarkupInterpreter.getMarkup().radRequest.retrieve.length
      if (state.history[state.historyIndex + 1]) {
        state.historyIndex += 1
        state.currentRadonMarkupInterpreter = new Radon(state.history[state.historyIndex])
        state.radRequest = state.currentRadonMarkupInterpreter.getMarkup().radRequest
        const currentLenght = state.radRequest.retrieve.length
        if (redolenght > currentLenght) {
          this.commit('moveCarousel', { direction: 'right' })
        } else if (redolenght < currentLenght) {
          this.commit('moveCarousel', { direction: 'left' })
        }
      }
    },
    editorUndo(state) {
      const lenght = state.currentRadonMarkupInterpreter.getMarkup().radRequest.retrieve.length
      if (state.history[state.historyIndex - 1]) {
        state.historyIndex = state.historyIndex - 1
        state.currentRadonMarkupInterpreter = new Radon(state.history[state.historyIndex])
        state.radRequest = state.currentRadonMarkupInterpreter.getMarkup().radRequest
        let currentLenght = state.radRequest.retrieve.length
        if (lenght > currentLenght) {
          this.commit('moveCarousel', { direction: 'right' })
        } else if (lenght < currentLenght) {
          this.commit('moveCarousel', { direction: 'left' })
        }
      }
    },
    moveCarousel(state, { direction }) {
      if (direction === 'right') {
        state.moveCarousel = 'right'
      } else if (direction === 'left') {
        state.moveCarousel = 'left'
      }
    },
    clearMoveCarousel(state) {
      state.moveCarousel = false
    },
    updateSource(state, { source, index }) {
      state.currentRadonMarkupInterpreter.updateSource(source, index)
      state.radRequest = state.currentRadonMarkupInterpreter.getMarkup().radRequest
      this.commit('updateHistory', { mir: state.currentRadonMarkupInterpreter.getMir() })
    },
    deleteSource(state, { index }) {
      state.currentRadonMarkupInterpreter.deleteSource(index)
      state.radRequest = state.currentRadonMarkupInterpreter.getMarkup().radRequest
      this.commit('updateHistory', { mir: state.currentRadonMarkupInterpreter.getMir() })
    },
    addSource(state) {
      state.radRequest = state.currentRadonMarkupInterpreter.getMarkup().radRequest
      state.currentRadonMarkupInterpreter.addSource()
      state.radRequest = state.currentRadonMarkupInterpreter.getMarkup().radRequest
      this.commit('updateHistory', { mir: state.currentRadonMarkupInterpreter.getMir() })
    },
    setTemplates: function(state, { templates }) {
      if (templates) {
        state.templates = templates
      }
    },
    createTemplate: function(state) {
      const name = Object.values(state.templates).reduce((acc, _, index, self) => {
        index = parseInt(acc.split(' ')[1]) + 1
        let name = 'template'
        return self.find(template => template.name === acc) ? name : acc
      }, 'template')

      const radRequest = {
        timelock: 0,
        retrieve: [
          {
            url: '',
            kind: 'HTTP-GET',
            script: [0x75],
          },
        ],
        aggregate: [0x50],
        tally: [0x50],
      }
      state.currentTemplate = {
        creationDate: Date.now(),
        id: generateId(),
        name: name,
        description: '',
        radRequest,
      }

      state.currentRadonMarkupInterpreter = new Radon(state.currentTemplate)
      state.radRequest = state.currentRadonMarkupInterpreter.getMarkup().radRequest
      state.history = [state.currentTemplate]
    },
    setCurrentTemplate: function(state, { id }) {
      const template = state.templates[id]
      state.currentTemplate = template
      state.currentRadonMarkupInterpreter = new Radon(state.currentTemplate.radRequest)
      state.radRequest = state.currentRadonMarkupInterpreter.getMarkup().radRequest
      state.history = [state.currentTemplate]
    },
    pushOperator: function(state, { scriptId }) {
      state.currentRadonMarkupInterpreter.addOperator(scriptId)
      state.radRequest = state.currentRadonMarkupInterpreter.getMarkup().radRequest
      this.commit('updateHistory', { mir: state.currentRadonMarkupInterpreter.getMir() })
    },
  },
  actions: {
    saveTemplate: async function(context, args) {
      let templates = context.state.templates
      const templateToSave = args ? args.template : context.state.currentTemplate
      templateToSave.radRequest = context.state.currentRadonMarkupInterpreter.getMir().radRequest
      if (!templateToSave.id) {
        templateToSave.id = generateId()
      }
      templates[templateToSave.id] = templateToSave
      const request = await this.$walletApi.saveItem({
        walletId: context.rootState.wallet.walletId,
        sessionId: context.rootState.wallet.sessionId,
        key: 'templates',
        value: templates,
        creationDate: Date.now(),
      })
      if (request.result) {
        await context.dispatch('getTemplates')
      } else {
        console.log(request)
      }
    },
    getTemplates: async function(context, params) {
      const request = await this.$walletApi.getItem({
        walletId: context.rootState.wallet.walletId,
        sessionId: context.rootState.wallet.sessionId,
        key: 'templates',
      })
      if (request.result) {
        context.commit('setTemplates', { templates: request.result.value })
      } else {
        console.log(request)
      }
    },
    deleteTemplate: async function(context, { id }) {
      Vue.delete(context.state.templates, id)
      const request = await this.$walletApi.saveItem({
        walletId: context.rootState.wallet.walletId,
        sessionId: context.rootState.wallet.sessionId,
        key: 'templates',
        value: context.state.templates,
      })
      if (request.result) {
        console.log(request.result)
      } else {
        console.log(request)
      }
    },
  },
}
