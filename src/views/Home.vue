<template>
  <div class="layout" data-test="home">
    <Sidebar />
    <router-view class="main"></router-view>
  </div>
</template>

<script>
import Sidebar from '@/components/Sidebar.vue'

export default {
  name: 'Home',
  components: {
    Sidebar,
  },
  created() {
    this.pollData()
  },
  data() {
    return {
      pollingInterval: setInterval(this.pollData, 10000),
    }
  },
  methods: {
    pollData() {
      const currentRoute = this.$router.currentRoute.path
      currentRoute.startsWith('/welcome-back') || currentRoute.startsWith('/ftu')
      this.$store.dispatch('getWalletInfos')
    },
  },
}
</script>

<style lang="scss" scoped>
@import url('https://fonts.googleapis.com/css?family=Titillium+Web:300,300i,400,400i,600,600i&display=swap');

.layout {
  display: flex;
  position: relative;

  .main {
    height: 100vh;
    overflow-y: auto;
    width: 100%;
  }
  .alert {
    margin: 0px;
  }
}
</style>
