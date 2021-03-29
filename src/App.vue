<template>
  <div>
    <AddAutoPopup v-if="false" />
    <EditAutoPopup :rows="tableData" />
  </div>
</template>

<script>
import AddAutoPopup from './components/AddAutoPopup/index';
import EditAutoPopup from './components/EditAutoPopup/index'

export default {
  name: 'App',

  components: {
    AddAutoPopup,
    EditAutoPopup
  },

  data: () => ({
    tableData: [
      {"name":"Андрусяк Кирилл Артемович","startCity":"Москва","endCity":["Воронеж"],"startDate":"Mon Mar 01 2021 00:00:00 GMT+0300 (Москва, стандартное время)","endDate":"Mon Mar 15 2021 00:00:00 GMT+0300 (Москва, стандартное время)"},
      {"name":"Андрусяк Кирилл Артемович","startCity":"Москва","endCity":["Воронеж"],"startDate":"Mon Mar 01 2021 00:00:00 GMT+0300 (Москва, стандартное время)","endDate":"Mon Mar 15 2021 00:00:00 GMT+0300 (Москва, стандартное время)"}
    ],
  }),
};
</script>
