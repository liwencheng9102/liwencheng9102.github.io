import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [{
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/bloglist/:type',
    name: 'Bloglist',
    component: () => import('../views/Bloglist.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/artical/:id',
    name: 'Artical',
    component: () => import('../views/Artical.vue')
  },
  {
    path: '/personal',
    name: 'Personal',
    component: () => import('../views/Personal.vue'),
    children: [{
        path: '/personal/myblog',
        name: 'Myblog',
        component: () => import('../views/Myblog.vue')
      },
      {
        path: '/personal/remind',
        name: 'Remind',
        component: () => import('../views/Remind.vue')
      },
      {
        path: '/personal/message',
        name: 'Message',
        component: () => import('../views/Message.vue')
      },
      {
        path: '/personal/draft',
        name: 'Draft',
        component: () => import('../views/Draft.vue')
      },
      {
        path: '/personal/star',
        name: 'Star',
        component: () => import('../views/Star.vue')
      },
      {
        path: '/personal/profile',
        name: 'Profile',
        component: () => import('../views/Profile.vue')
      },
    ]
  },
  {
    path: '/myAttentionAndFans',
    name: 'MyAttentionAndFans',
    component: () => import('../views/MyAttentionAndFans.vue'),
    children: [{
        path: '/myAttentionAndFans/myAttention',
        name: 'MyAttention',
        component: () => import('../views/MyAttention.vue')
      },
      {
        path: '/myAttentionAndFans/myFans',
        name: 'Myfans',
        component: () => import('../views/Myfans.vue')
      }
    ]
  },
  {
    path: '/otherusers/:id',
    name: 'Otherusers',
    component: () => import('../views/Otherusers.vue'),
    children: [{
        path: '/otherusers/:id/userBlogs',
        name: 'UserBlogs',
        component: () => import('../views/UserBlogs.vue')
      }, {
        path: '/otherusers/:id/attention',
        name: 'Attention',
        component: () => import('../views/Attention.vue')
      },
      {
        path: '/otherusers/:id/fans',
        name: 'Fans',
        component: () => import('../views/Fans.vue')
      }
    ]
  },
  {
    path: '/edit/:articalId',
    name: 'Edit',
    component: () => import('../views/Edit.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior() {
    return {
      x: 0,
      y: 0
    }
  },
})

export default router