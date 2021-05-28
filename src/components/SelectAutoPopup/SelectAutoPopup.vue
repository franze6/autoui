<template>
  <div>
    <el-dialog v-if="!isShowEditDialog" title="Выбрать водителя" :visible.sync="dialogFormVisible" width="min-content">
      <el-tabs type="card" @tab-click="tabClick">
        <el-tab-pane label="Все">
          <AutoTable v-if="currentTabIndex === '0'" :table-data="allAuto" @change="changeSelected" is-search @start-search="startSearch" />
        </el-tab-pane>
        <el-tab-pane label="Назначенные">
          <AutoTable v-if="currentTabIndex === '1'" :table-data="addedAuto" @change="changeSelected" />
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer">
          <el-button @click="cancelClick">Отмена</el-button>
          <el-button :disabled="currentRow === null" type="primary" @click="saveResult">ОК</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import AutoTable from "@/components/SelectAutoPopup/Table/AutoTable";

export default {
  name: "SelectAutoPopup",
  components: {AutoTable},
  props: {
    data: Object
  },
  data() {
    return {
      dialogFormVisible: true,
      isShowEditDialog: false,
      currentRow: null,
      allAuto: [],
      addedAuto: [],
      currentTabIndex: '0',
    }
  },
  methods: {
    changeSelected(val) {
      this.currentRow = val;
    },
    cancelClick() {
      this.$emit('cancel')
    },
    saveResult() {
      this.$emit('save-result', this.currentRow)
    },
    tabClick(tab) {
      this.currentTabIndex = tab.index;
      this.currentRow = null;
    },
    startSearch(typeSearch, search) {
      this.$emit('start-search', typeSearch, search);
    }
  },
  mounted() {
    this.allAuto = this.data?.all || [];
    this.addedAuto = this.data?.added || [];
  },
  watch: {
    data: {
      immediate: true,
      handler: function(val) {
        this.allAuto = val?.all || [];
        this.addedAuto = val?.added || [];
      }
    }
  }
}
</script>

<style scoped>

</style>