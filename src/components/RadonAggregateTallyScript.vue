<template>
  <div>
    <p>Filters</p>
    <div>
      <div v-for="(operator, index) in filters" :key="operator.toString() + index">
        <RadonOperator
          :operator="operator"
          :stage="stage"
          :sourceIndex="sourceIndex"
          :showOutputType="false"
          :showUnionIcon="index !== filters.length - 1"
          :scriptId="operator.scriptId"
        />
      </div>
      <div class="button-container">
        <button class="add-operators-btn" @click="pushOperator({ scriptId: reducer.scriptId })">
          Add Filter
        </button>
      </div>
    </div>
    <p>Reducer</p>
    <RadonOperator
      :operator="reducer"
      :stage="stage"
      :sourceIndex="sourceIndex"
      :showOutputType="false"
      :scriptId="reducer.scriptId"
    />
  </div>
</template>

<script>
import { PUSH_OPERATOR } from '@/store/mutation-types'
import RadonOperator from '@/components/RadonOperator'
import { mapMutations } from 'vuex'

export default {
  name: 'RadonAggregateTallyScript',
  components: { RadonOperator },
  props: {
    stage: String,
    sourceIndex: Number,
    script: Object,
  },
  methods: {
    ...mapMutations({
      pushOperator: PUSH_OPERATOR,
    }),
  },
  computed: {
    filters() {
      return this.script.filters
    },
    reducer() {
      return this.script.reducer
    },
  },
}
</script>

<style scoped lang="scss">
@import '@/styles/_colors.scss';
@import '@/styles/theme.scss';

.circle {
  outline: none;
  border: 2px solid $alt-grey-5;
  box-shadow: none;
  width: 30px;
  height: 30px;
  border-radius: 100%;
  position: relative;
  margin: 16px 0;
  display: inline-block;
  vertical-align: middle;
  background: transparent;
}

.circle:before,
.circle:after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.circle.plus:before,
.circle.plus:after {
  cursor: pointer;
  background: $alt-grey-5;
}
.circle.plus:before {
  width: 2px;
  margin: 8px auto;
}
.circle.plus:after {
  margin: auto 8px;
  height: 2px;
  box-shadow: none;
}
.button-container {
  text-align: center;

  .add-operators-btn {
    cursor: pointer;
    margin: 32px;
    width: 150px;
    padding: 8px;
    font-size: 16px;
    background-color: $purple-4;
    border-radius: 5px;
    color: $white;
    font-family: 'Roboto';
    font-weight: bold;

    &:active,
    &:focus {
      outline: none;
    }
  }
}
</style>
