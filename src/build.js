import Vue from 'vue';
import AddAutoPopup from './components/AddAutoPopup/index'
import EditAutoPopup from './components/EditAutoPopup/index'
import Element from "element-ui";
import locale from "element-ui/lib/locale/lang/ru-RU";

const Components = {
  AddAutoPopup,
  EditAutoPopup
};

Object.keys(Components).forEach(name => {
  Vue.component(name, Components[name]);
});

Vue.use(Element, { locale });

export default Components;