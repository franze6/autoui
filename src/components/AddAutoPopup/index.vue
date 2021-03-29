<template>
  <div :class="style.bg">
    <el-dialog title="Добавить водителя" :visible.sync="dialogFormVisible" width="800px" @close="$emit('close')">
      <el-form :model="form">
        <el-form-item label="ФИО водителя" :label-width="formLabelWidth">
          <el-input v-model="form.name" disabled autosize></el-input>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="Город отправления" :label-width="formLabelWidth">
              <el-select
                  v-model="form.startCity"
                  filterable
                  placeholder="Select"
                  allow-create
                  :filter-method="filterCity"
                  no-data-text="Введите больше символов"
                  @visible-change="(val) => val && filterCity()"
              >
                <el-option
                    v-for="item in cities"
                    :key="item"
                    :label="item"
                    :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Город назначения" :label-width="formLabelWidth">
              <el-select
                  v-model="form.endCity"
                  filterable
                  placeholder="Select"
                  multiple
                  allow-create
                  :filter-method="filterCity"
                  @visible-change="(val) => val && filterCity()"
                  no-data-text="Введите больше символов"
              >
                <el-option
                    v-for="item in cities"
                    :key="item"
                    :label="item"
                    :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="Дата погрузки" :label-width="formLabelWidth">
              <el-date-picker
                  v-model="form.startDate"
                  type="date"
                  format="dd.MM.yyyy"
                  placeholder="Выберите дату...">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="Дата разгрузки" :label-width="formLabelWidth">
              <el-date-picker
                  v-model="form.endDate"
                  type="date"
                  format="dd.MM.yyyy"
                  placeholder="Выберите дату...">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelClick">Отмена</el-button>
        <el-button type="primary" @click="saveResult">Подтвердить</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import style from './style.module.css'
  import cities from '@/data/city.json'

  export default {
    name: 'AddAutoPopup',
    data() {
      return {
        style,
        form: {
          name: '',
          startCity: '',
          endCity: [],
          startDate: new Date(),
          endDate: new Date()
        },
        dialogFormVisible: true,
        formLabelWidth: '140px',
        cities: [],
        allCities: []
      }
    },
    props: {
      formData: {
        type: Object,
        required: false,
        default: () => {}
      }
    },
    methods: {
      filterCity(query) {
        if(!query || query.length < 2) {
          this.cities = [];
          return;
        }
        this.cities = this.allCities.filter(item => {
          return item.toLowerCase()
              .indexOf(query.toLowerCase()) > -1;
        });
      },

      saveResult() {
        this.dialogFormVisible = false;
        this.$emit('save', this.form);
      },
      cancelClick() {
        this.dialogFormVisible = false;
        this.$emit('cancel');
      }
    },

    mounted() {
      this.allCities = Array.from(new Set(cities.map(curr => curr.city)));
      console.log(this.allCities);
    },

    watch: {
      formData: {
        immediate: true,
        handler: function(val) {
          if(!val)
            return;
          this.form = val;
        }
      }
    }
  }
</script>
