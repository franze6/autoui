<template>
  <div>
    <el-input
        v-if="isSearch"
        placeholder="Поиск..."
        v-model="search"
        class="input-with-select"
        clearable
        @keypress.enter.native="emitStartSearch"
    >
      <el-select v-model="typeSearch" slot="prepend" placeholder="Select" class="select">
        <el-option label="Имя в системе" value="name"></el-option>
        <el-option label="ФИО" value="fio"></el-option>
      </el-select>
      <el-button slot="append" icon="el-icon-search" @click="emitStartSearch"></el-button>
    </el-input>
    <el-table
        :data="tableData"
        highlight-current-row
        @current-change="handleCurrentChange"
        style="width: 100%"
        :row-style="{cursor: 'pointer'}"
        max-height="500"
    >
      <el-table-column
          type="index"
          width="50">
      </el-table-column>
      <el-table-column
          prop="findString"
          label="Имя в системе"
          width="400">
      </el-table-column>
      <el-table-column
          prop="name"
          label="ФИО"
          width="300">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>

export default {
  name: "AutoTable",
  props: {
    tableData: Array,
    isSearch: Boolean,
  },
  data() {
    return {
      search: '',
      typeSearch:'name'
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.$emit('change', val);
    },
    emitStartSearch() {
      this.$emit('start-search', this.typeSearch, this.search);
    }
  }
}
</script>

<style scoped>
.select {
  width: 150px;
}
</style>