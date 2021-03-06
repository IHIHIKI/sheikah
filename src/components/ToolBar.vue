<template>
  <div class="top-bar">
    <a :href="dataStr" ref="download" download="template.json" style="display:none"></a>
    <router-link data-test="go-back-to-templates" class="back" to="/request/templates">
      <img class="back-btn" src="@/resources/svg/arrow-to-left.svg" />
    </router-link>
    <button
      :data-test="`action-${tab.icon}`"
      v-for="tab in tabs"
      :key="tab.icon"
      :class="tab.class"
      @click="tab.action"
    >
      {{ tab.icon }}
    </button>
  </div>
</template>

<script>
import { EDITOR_REDO, EDITOR_UNDO } from '@/store/mutation-types'
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  name: 'ToolBar',
  methods: {
    ...mapActions({
      tryDataRequest: 'tryDataRequest',
      saveTemplate: 'saveTemplate',
    }),
    ...mapMutations({
      editorUndo: EDITOR_UNDO,
      editorRedo: EDITOR_REDO,
    }),
    exportTemplate: function() {
      this.$refs.download.click()
    },
  },
  computed: {
    ...mapState({
      template: state => state.rad.currentTemplate,
    }),
    dataStr() {
      return `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(this.template))}`
    },
  },
  data() {
    return {
      tabs: [
        {
          icon: 'Redo',
          action: this.editorRedo,
          class: 'end',
        },
        {
          icon: 'Undo',
          action: this.editorUndo,
          class: 'end',
        },
        {
          icon: 'Save',
          action: this.saveTemplate,
          class: 'end',
        },
        {
          icon: 'Export',
          action: this.exportTemplate,
          class: 'end',
        },
        {
          icon: 'Try data request',
          action: this.tryDataRequest,
          class: 'end',
        },
      ],
    }
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/_colors.scss';
@import '@/styles/theme.scss';

.top-bar {
  position: relative;
  background-color: $white;
  border-bottom: 1px solid $grey-1;
  display: flex;
  flex-flow: row wrap;
  height: 70px;
  min-width: 700px;
  justify-content: flex-end;

  .first,
  .end {
    color: $alt-grey-2;
    font-family: 'Roboto';
    font-weight: bold;
    font-size: 1em;
    padding: 16px 24px;
    background-color: transparent;
    border: none;

    &:active,
    &:focus,
    &:hover {
      outline: none;
    }

    &:hover {
      cursor: pointer;
      background-color: $alpha-purple;
    }
  }

  .first {
    margin-right: auto;
  }

  .back {
    margin-right: auto;
    padding: 24px;
    display: flex;
    align-items: center;

    &:hover {
      background-color: $alpha-purple;
    }

    .back-btn {
      width: 20px;
    }
  }
}
</style>
