<template>
  <div class="page">
    <!-- Write your template -->
    <p>{{ $t('demo.welcome') }}</p>
  </div>
</template>

<script>
import api from '@/modules/demo/api/demo'
export default {
  name: 'Home',
  created() {
    api.getList().then((res) => {
      console.log(res)
    })
  }
}
</script>

<style lang="scss" scoped>
// Write your page style
.page {
  &-container {
    display: block;
  }
}
</style>
