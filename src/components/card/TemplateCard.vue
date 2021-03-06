<template>
  <FrameOutside @click="showInput = false" @focus="showInput = false">
    <div :class="`card-layout ${style}`">
      <div class="option-btn">
        <el-dropdown @command="handleCommand">
          <div class="button-options" split-button type="primary">
            <img
              v-if="type === 'marketplace'"
              src="@/resources/svg/options-marketplace.svg"
              alt=""
            />
            <img v-else src="@/resources/svg/options.svg" alt="" />
          </div>
          <el-dropdown-menu v-if="type === 'marketplace'" slot="dropdown" :class="style">
            <el-dropdown-item
              v-for="(option, index) in marketplaceOptions"
              :key="option.label"
              :command="index"
            >
              {{ option.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
          <el-dropdown-menu v-else slot="dropdown" :class="style">
            <el-dropdown-item
              :data-test="`template-${option.label}`"
              v-for="(option, index) in options"
              :key="option.label"
              :command="index"
            >
              {{ option.label }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div data-test="edit-template" class="content" @click="edit">
        <div class="title">
          <el-tooltip :content="name" placement="bottom" effect="light">
            <div ref="input" v-show="!showInput">
              {{ cropString(name, 15, 'end') }}
            </div>
          </el-tooltip>
          <el-input
            data-test="template-name-input"
            v-show="showInput"
            :placeholder="name"
            v-model="updateName"
          />
        </div>
        <div class="description">
          {{ description }}
        </div>
      </div>
      <div v-show="style != 'marketplace'" class="date">
        {{ dateFormated }}
      </div>
    </div>
  </FrameOutside>
</template>

<script>
import { SET_CURRENT_TEMPLATE } from '@/store/mutation-types'
import { changeDateFormat, cropString } from '@/utils'
import FrameOutside from '@/components/FrameOutside'
import { mapActions, mapMutations } from 'vuex'

export default {
  name: 'TemplateCard',
  components: {
    FrameOutside,
  },
  data() {
    return {
      marketplaceOptions: [
        {
          label: 'Deploy',
          action: () => {
            console.log('This method should be implemented soon')
          },
        },
      ],
      options: [
        {
          label: 'Edit',
          action: () => {
            this.edit()
          },
        },
        {
          label: 'Rename',
          action: () => {
            this.showInput = true
          },
        },
        {
          label: 'Deploy',
          action: () => {
            this.displayModal()
          },
        },
        {
          label: 'Delete',
          action: () => {
            this.deleteTemplate({ id: this.id })
          },
        },
      ],
      dateFormated: changeDateFormat(this.date),
      showInput: false,
      isModalActivated: false,
    }
  },
  props: {
    id: String,
    name: String,
    description: String,
    date: [Number, String],
    type: [Number, String],
  },
  computed: {
    style() {
      return this.type
    },
    updateName: {
      get() {
        return this.name
      },
      set(newName) {
        this.$emit('change-name', { name: newName, id: this.id })
      },
    },
  },
  methods: {
    cropString,
    ...mapMutations({
      setCurrentTemplate: SET_CURRENT_TEMPLATE,
    }),
    ...mapActions({
      deleteTemplate: 'deleteTemplate',
    }),
    displayModal() {
      this.isModalActivated = true
      this.$emit('toggle-modal', { isModalActivated: this.isModalActivated })
    },
    edit() {
      if (!this.showInput) {
        this.$router.push('/request/editor')
        this.setCurrentTemplate({ id: this.id })
      }
    },
    onClose() {
      this.showInput = false
    },
    handleCommand(index) {
      this.options[index].action()
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/_colors.scss';
@import '@/styles/theme.scss';

.button-options {
  display: block;
  background-color: transparent;
  border: none;
  &:focus,
  &:hover {
    outline: none;
    cursor: pointer;
  }
}
.card-layout {
  display: grid;
  grid-template-rows: 50px 200px 50px;
  align-items: center;
  grid-template-columns: 250px;
  background-color: $white;
  border-radius: 2px;
  margin: 16px;
  height: 300px;
  border: 1px solid $grey-1;
  box-shadow: 1px 2px 8px 0px rgba(207, 207, 207, 0.329);
  &.marketplace {
    background: none;
  }
  &:hover {
    border: 1px solid $purple-3;
  }
  &.marketplace:hover {
    border: 1px solid rgb(255, 42, 127);
  }
  &.option-btn,
  .title,
  .description {
    overflow: hidden;
    margin: 24px 32px;
    width: inherit;
  }
  .edit-btn {
    display: block;
    color: $alpha-purple;
  }
  .option-btn {
    padding-right: 16px;
    justify-self: right;
  }
  .content {
    align-self: flex-start;
    &:hover {
      cursor: pointer;
    }
    .title {
      white-space: nowrap;
      height: min-content;
      font-size: 20px;
      color: $black;
    }
    .description {
      color: $alt-grey-3;
      line-height: 1.5em;
    }
  }
  .date {
    padding-left: 16px;
    width: 250px;
    color: $alt-grey-3;
  }
}
</style>
