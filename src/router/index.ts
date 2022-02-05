import Vue from 'vue';
import VueRouter, {RouteConfig} from 'vue-router';
import Money from '@/views/Money/Money.vue';
import Tags from '@/views/Money/AddTags/Tags.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    redirect: '/money'
  },
  {
    path: '/money',
    name: 'Money',
    component: Money
  },
  {
    path: '/bill',
    name: 'Bill',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Bill/Bill.vue')
  },
  {
    path: '/tags',
    name: 'Tag',
    component: () => import('../views/Money/AddTags/Tags.vue')

  },
  {
    path: '/chart',
    name: 'Chart',
    component: () => import('../views/Chart.vue')
  },
  {
    path: '/record/edit/:id',
    name: 'RecordEdit',
    component: () => import('../views/RecordEdit.vue')
  }

];

const router = new VueRouter({
  routes
});

export default router;
