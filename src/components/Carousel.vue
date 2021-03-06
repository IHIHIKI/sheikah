<template>
  <div class="carousel-container">
    <div class="card--to__left" @click="moveCarousel(-1)" :disabled="headOfList">
      <font-awesome-icon class="icon-left" icon="angle-left" />
    </div>
    <div class="card">
      <div class="card--overflow-container">
        <div class="card-cards">
          <transition-group tag="div" :class="animate" :name="animate">
            <div
              class="card--card"
              v-for="(source, index) in sources.slice(counter)"
              :key="source.index"
            >
              <div v-if="source" class="content" data-test="source-content">
                <div class="header">
                  <h3 class="source-header">
                    Source
                    <span class="index">{{ source.index }}</span>
                  </h3>
                  <button
                    data-test="delete-source-btn"
                    class="delete-btn"
                    @click="deleteSourceAndMove(source.index)"
                  >
                    <font-awesome-icon class="icon" icon="trash" />
                  </button>
                </div>
                <div class="header-operators">
                  <el-select class="select" v-model="selectedOperator[index]">
                    <el-option
                      v-for="item in ['HTTPS_GET']"
                      :key="item"
                      :label="item"
                      :value="item"
                    >
                    </el-option>
                  </el-select>
                  <div>
                    <el-input
                      class="input"
                      placeholder="url"
                      type="text"
                      v-model="source.url"
                      @input="e => update({ kind: source.kind, url: e }, source.index)"
                    />
                  </div>
                  <RadonScript
                    :script="source.script"
                    stage="retrieve"
                    :sourceIndex="source.index"
                    :scriptId="source.scriptId"
                  />
                </div>
              </div>
            </div>
          </transition-group>
          <button data-test="add-source-btn" @click="addSourceToCarousel" class="add-source">
            <img src="@/resources/svg/add-grey.svg" />
          </button>
        </div>
      </div>
    </div>
    <div class="card--to__right" @click="moveCarousel(1)" :disabled="endOfList">
      <font-awesome-icon class="icon-right" icon="angle-right" />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'

import RadonScript from '@/components/RadonScript'
import {
  CLEAR_MOVE_CAROUSEL,
  UPDATE_TEMPLATE,
  ADD_SOURCE,
  DELETE_SOURCE,
  UPDATE_SOURCE,
} from '@/store/mutation-types'

export default {
  name: 'Carousel',
  props: {
    sources: Array,
  },
  components: {
    RadonScript,
  },
  data() {
    return {
      counter: 0,
      animate: 'slide-right',
    }
  },
  computed: {
    ...mapState({
      isMoveCarouselActivated: state => {
        return state.rad.moveCarousel
      },
    }),
    endOfList() {
      return this.counter === this.sources.length - 2 || this.sources.length < 2
    },
    headOfList() {
      return this.counter === 0
    },
    selectedOperator: {
      get() {
        return this.sources.map(source => {
          return {
            primaryText: source.kind,
          }
        })
      },
      // eslint-disable-next-line
      set(inputValue) {
        this.updateTemplate({
          // add id and value
        })
      },
    },
  },
  watch: {
    isMoveCarouselActivated() {
      if (this.isMoveCarouselActivated === 'right' && this.sources.length > 2) {
        this.moveCarousel(-1)
        this.clearMoveCarousel()
      } else if (this.isMoveCarouselActivated === 'left') {
        this.moveCarousel(1)
        this.clearMoveCarousel()
      }
    },
  },
  methods: {
    ...mapMutations({
      addSource: ADD_SOURCE,
      deleteSource: DELETE_SOURCE,
      updateSource: UPDATE_SOURCE,
      clearMoveCarousel: CLEAR_MOVE_CAROUSEL,
    }),
    ...mapActions({
      updateTemplate: UPDATE_TEMPLATE,
    }),
    moveCarousel(direction) {
      const isMovingToTheRight = direction === 1
      const isMovingTotheLeft = direction === -1

      if (isMovingToTheRight && !this.endOfList) {
        this.animate = 'slide-right'
        this.counter++
      } else if (isMovingTotheLeft && !this.headOfList) {
        this.animate = 'slide-left'
        this.counter--
      }
    },
    addSourceToCarousel() {
      if (this.sources.length > 1) this.counter++
      this.addSource()
    },
    deleteSourceAndMove(index) {
      this.deleteSource({ index })
      if (this.sources.length > 2) this.moveCarousel(-1)
    },
    update(sourceInformation, sourceIndex) {
      this.updateSource({ source: sourceInformation, index: sourceIndex })
    },
  },
}
</script>
<style lang="scss" scoped>
@import '@/styles/_colors.scss';
@import '@/styles/theme.scss';

.icon {
  color: $red-2;
  font-size: 14px;
}

.carousel-container {
  padding: 24px 24px 0px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card {
  display: flex;
  justify-content: center;
  width: 70vw;

  &--overflow-container {
    height: 80vh;
    overflow: hidden;
  }
  &--to__left .icon-left,
  &--to__right .icon-right {
    margin: auto;
    font-size: 40px;
    color: $alt-grey-2;
  }
  &--to__left,
  &--to__right {
    background-color: transparent;
    height: 80vh;
    width: 5vh;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-content: center;
    &[disabled] {
      opacity: 0.2;
      border-color: $alt-grey-5;
    }
  }
  &--to__left :active,
  &--to__right :active {
    transform: scale(0.9);
  }
}

.card-cards {
  display: flex;
  padding: 8px;
  transform: translateX(0px);
  .add-source {
    background: transparent;
    padding: 40px;
    height: 100px;
    border: none;
    display: flex;
    justify-content: center;
    align-content: center;
    &:hover,
    &:active,
    &:focus {
      outline: none;
      cursor: pointer;
    }
    & img {
      width: 40px;
    }
  }
  .card--card {
    z-index: 3;
    margin-left: 30px;
    background-color: $white;
    box-shadow: 1px 3px 11px 0px rgba(207, 207, 207, 0.329);
    border-radius: 20px;

    .content {
      min-width: 300px;
      height: 700px;
      font-size: 18px;
      font-weight: bold;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      & > .header,
      & > .header-operators {
        margin: 32px;
      }
      .header {
        max-height: 18px;
        display: flex;
        .index {
          color: $black;
        }
        .delete-btn {
          display: none;
        }
      }
      .header-operators {
        height: 53px;
        .select {
          margin: 0 0 8px 0;
          width: 100%;
        }
        .input {
          cursor: pointer;
          color: $alt-grey-5;
          margin-bottom: 24px;
        }
      }
      &:hover {
        .delete-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          display: block;
          margin-left: auto;
        }
      }
    }
  }
}

.slide-right {
  display: flex;
}
.slide-right-move {
  transition: all 600ms ease-in-out 50ms;
}
.slide-right-enter-active {
  transition: all 400ms ease-out;
}
.slide-right-leave-active {
  transition: all 200ms ease-in;
  position: absolute;
  z-index: 0;
}
.slide-right-enter,
.slide-right-leave-to {
  opacity: 0;
}

.slide-left {
  display: flex;
}
.slide-left-move {
  transition: all 200ms ease-in-out 30ms;
}
.slide-left-enter-active {
  transition: all 400ms ease-in;
}
.slide-left-leave-active {
  transition: all 600ms ease-out;
  position: absolute;
  z-index: 0;
}
.slide-left-enter,
.slide-left-leave-to {
  opacity: 0;
}
</style>
