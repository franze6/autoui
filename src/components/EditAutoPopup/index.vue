<template>
  <div>
    <el-dialog v-if="!isShowEditDialog" title="Редактировать водителей" :visible.sync="dialogFormVisible" width="min-content">
      <el-table
          :data="tableData"
          style="width: 100%">
        <el-table-column
            prop="name"
            label="ФИО"
            width="250">
        </el-table-column>
        <el-table-column
            prop="startCity"
            label="Город отправления"
            width="150">
        </el-table-column>
        <el-table-column
            prop="endCity"
            label="Город назначения"
            :formatter="(row, column, cellValue) => cellValue.join(', ')"
            width="150">
        </el-table-column>
        <el-table-column
            prop="startDate"
            :formatter="(row, column, cellValue) => new Date(cellValue).toLocaleDateString()"
            label="Дата погрузки"
            width="120">
        </el-table-column>
        <el-table-column
            prop="endDate"
            label="Дата разгрузки"
            :formatter="(row, column, cellValue) => new Date(cellValue).toLocaleDateString()"
            width="120">
        </el-table-column>
        <el-table-column
            label="Операции"
            width="150">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.$index, scope.row)" type="text" size="small">Изменить</el-button>
            <el-button  @click="handleDelete(scope.$index, scope.row)" type="text" size="small">Удалить</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelClick">Отмена</el-button>
        <el-button type="primary" @click="saveResult">Подтвердить</el-button>
      </span>
    </el-dialog>
    <AddAutoPopup :form-data="tableData[currentRowIndex]" :is-show="isShowEditDialog" v-else @save="editSave" @close="isShowEditDialog = false" />
  </div>
</template>

<script>
import AddAutoPopup from "@/components/AddAutoPopup";
export default {
  components: {AddAutoPopup},
  props: {
    tableData: Array
  },
  methods: {
    handleEdit(index, row) {
      this.currentRowIndex = index;
      this.isShowEditDialog = true;
      console.log(index, row);
    },
    handleDelete(index, row) {
      this.tableData.splice(index, 1);
      console.log(index, row);
    },
    editSave(row) {
      this.tableData.splice(this.currentRowIndex, 1, row);
    },
    saveResult() {
      this.$emit('result', this.tableData);
    },
    cancelClick() {
      this.dialogFormVisible = false;
      this.$emit('cancel');
    }
  },
  data() {
    return {
      dialogFormVisible: true,
      isShowEditDialog: false,
      currentRowIndex: 0
    }
  }
}
</script>