<template>
  <div>
    <AddAutoPopup/>
    <EditAutoPopup v-if="false" :rows="tableData"/>
    <SettingsPopup></SettingsPopup>
  </div>
</template>

<script>
import AddAutoPopup from './components/AddAutoPopup/AddAutoPopup';
import EditAutoPopup from './components/EditAutoPopup/EditAutoPopup';
import SettingsPopup from './components/SettingsPopup/SettingsPopup';

export default {
  name: 'App',

  components: {
    SettingsPopup,
    AddAutoPopup,
    EditAutoPopup,
  },

  data: () => ({
    tableData: [
      {
        'name': 'Андрусяк Кирилл Артемович',
        'startCity': 'Москва',
        'endCity': ['Воронеж'],
        'startDate': 'Mon Mar 01 2021 00:00:00 GMT+0300 (Москва, стандартное время)',
        'endDate': 'Mon Mar 15 2021 00:00:00 GMT+0300 (Москва, стандартное время)',
      },
      {
        'name': 'Андрусяк Кирилл Артемович',
        'startCity': 'Москва',
        'endCity': ['Воронеж'],
        'startDate': 'Mon Mar 01 2021 00:00:00 GMT+0300 (Москва, стандартное время)',
        'endDate': 'Mon Mar 15 2021 00:00:00 GMT+0300 (Москва, стандартное время)',
      },
    ],
  }),
};
</script>
