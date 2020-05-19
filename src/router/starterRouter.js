import Vue from 'vue';
import Router from 'vue-router';
import DashboardLayout from '../layout/starter/SampleLayout.vue';
import Starter from '../layout/starter/SamplePage.vue';
import History from '../layout/starter/History.vue';


Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/new',
      component: DashboardLayout,
      children: [
        {
          path: 'new',
          name: 'new test',
          components: { default: Starter }
        },
        {
          path: 'history',
          name: 'test history',
          components: { default: History }
        }
      ]
    }
  ]
});
