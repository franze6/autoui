import Vue from 'vue';
import AddAutoPopup from './components/AddAutoPopup/AddAutoPopup';
import EditAutoPopup from './components/EditAutoPopup/EditAutoPopup';
import SelectAutoPopup from './components/SelectAutoPopup/SelectAutoPopup';
import SettingsPopup from './components/SettingsPopup/SettingsPopup';
import Element from 'element-ui';
import locale from 'element-ui/lib/locale/lang/ru-RU';

const Components = {
  AddAutoPopup,
  EditAutoPopup,
  SelectAutoPopup,
  SettingsPopup,
};

Object.keys(Components).forEach(name => {
  Vue.component(name, Components[name]);
});

Vue.use(Element, {locale});

export default Components;