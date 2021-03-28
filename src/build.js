import Vue from 'vue';
import AddAutoPopup from './components/AddAutoPopup/index'
import EditAutoPopup from './components/EditAutoPopup/index'

const Components = {
  AddAutoPopup,
  EditAutoPopup
};

Object.keys(Components).forEach(name => {
  Vue.component(name, Components[name]);
});

export default Components;