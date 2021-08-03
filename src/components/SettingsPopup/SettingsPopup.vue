<template>
  <div>
    <el-dialog title="Настройки" :visible.sync="dialogFormVisible" width="450px" @close="$emit('close')">
      <el-form :model="form">
        <el-row>
          <el-col :span="12">
            <el-form-item label="Интервал обновления (сек)" :label-width="formLabelWidth">
              <el-input-number v-model="form.intervalTime" controls-position="right" :min="1" class="min_rate"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="Процент рентабельности (%)" :label-width="formLabelWidth">
              <el-input-number v-model="form.percent" controls-position="right" :min="1" :max="100" class="min_rate"
              ></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelClick">Отмена</el-button>
        <el-button type="primary" @click="saveResult">Сохранить</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'SettingsPopup',
  data: () => ({
    dialogFormVisible: true,
    formLabelWidth: '200px',
    form: {
      intervalTime: 1,
      percent: 7,
    }
  }),
  methods: {
    saveResult() {
      this.dialogFormVisible = false;
      this.$emit('save', this.form);
    },
    cancelClick() {
      this.dialogFormVisible = false;
      this.$emit('cancel');
    }
  }
}
</script>

<style scoped>

</style>