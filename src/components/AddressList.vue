<template>
  <div class="list">
    <AddressCard
      v-for="(address, index) in addresses"
      :key="index"
      class="item"
      :used="address.used"
      :selected="selected === index"
      @click="() => selectAddress(index)"
    />
    <AddressCardButton @click="$emit('generate-address')" />
  </div>
</template>

<script>
import AddressCard from '@/components/AddressCard'
import AddressCardButton from '@/components/AddressCardButton'

/**
 * List of all the addresses generated by the wallet
 */
export default {
  name: 'AddressList',
  components: {
    AddressCard,
    AddressCardButton,
  },
  props: {
    /**
     * Addresses generated
     */
    addresses: {
      type: Array,
      required: true,
    },
    /**
     * Address selected
     */
    selected: {
      required: false,
      type: Number,
    },
  },
  methods: {
    selectAddress(index) {
      /**
       * Emit the index of the new selected address
       */
      this.$emit('select-address', index)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/styles/_colors.scss';

.list {
  align-content: center;
  align-items: center;
  background-color: $orange-1;
  border-bottom: 1px solid $grey-border;
  box-sizing: border-box;
  display: grid;
  gap: 6px;
  grid-template-columns: repeat(auto-fit, 25px);
  grid-template-rows: repeat(auto-fit, 40px);
  height: 170px;
  justify-content: center;
  max-height: 170px;
  overflow: auto;
  padding: 25px;
}

::-webkit-scrollbar {
  width: 4px;
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: $scroll-grey;
  -webkit-border-radius: 1ex;
  border-radius: 1ex;
}
</style>

<docs>
### Example

```jsx
  <AddressList
    :style="{ width: '350px' }"
    :addresses="[ {
      pkh: 'twit1270yg7pkm2w9mlq56r0mzrwph3flrp862zw0ft',
      index: 0,
      used: false,
      amount: 5000,
      currency: 'nanoWits',
      firstPaymentDate: new Date(),
      lastPaymentDate: new Date(),
      payments: 0,
    },
    {
      pkh: 'twit1270yg7pkm2w9mlq56r0mzrwph3flrp862zw0fa',
      index: 0,
      used: false,
      amount: 5000,
      currency: 'nanoWits',
      firstPaymentDate: new Date(),
      lastPaymentDate: new Date(),
      payments: 1,
    }]"
  />
```
</docs>
