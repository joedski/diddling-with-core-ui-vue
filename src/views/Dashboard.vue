<template>
  <div class="animated fadeIn">
    <dashboard-noots />
  </div>
</template>

<script>
import DashboardNoots from './Dashboard/DashboardNoots';

export default {
  name: 'Dashboard',

  components: {
    DashboardNoots,
  },
}
</script>
