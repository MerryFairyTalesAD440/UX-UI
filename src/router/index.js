import Vue from "vue";
import Router from "vue-router";
import BookList from "../components/BookList";
import BookListFilter from "../components/BookListFilter";
import LoginPage from "../components/LoginPage";
import AddBook from "../components/AddBook";
import UploadPic from "../components/UploadPic";
import AddLanguage from "../components/AddLanguage";
import AddPage from "../components/AddPage";
import BookPage from "../components/BookPage";
import UploadText from "../components/UploadText";
import UploadAudio from "../components/UploadAudio";
import VueSession from 'vue-session'
import VueRouter from "vue-router";

Vue.use(Router);
Vue.use(VueSession);

const routes = [
    {
      path: "/",
      name: "LoginPage",
      component: LoginPage
    },
    {
      path: "/addBook",
      name: "AddBook",
      component: AddBook
    },
    {
      path: "/uploadText",
      name: "UploadText",
      component: UploadText
    },
    {
      path: "/uploadAudio",
      name: "UploadAudio",
      component: UploadAudio
    },
    {
      path: "/BookList",
      name: "BookList",
      component: BookList,
      meta: {requiresAuth: true}
    },
    {
      path: "/bookListFilter",
      name: "BookListFilter",
      component: BookListFilter
    },
    {
      path: "/BookPage",
      name: "BookPage",
      component: BookPage
    },
    {
      path: "/AddPage",
      name: "AddPage",
      component: AddPage
    },
    {
      path: "/addlanguage",
      name: "AddLanguage",
      component: AddLanguage
    },
    {
      path: "/uploadpic",
      name: "UploadPic",
      component: UploadPic
    }
  ]

const router = new VueRouter({routes, mode: 'history'})

router.beforeEach((to, from, next) =>{
  if(this.meta.requiresAuth) {
    if(!this.$session.exists())
    next({name: "LoginPage"})
  }else {
    next()
  }
})

/* export default new Router({
  routes: [
    {
      path: "/",
      name: "LoginPage",
      component: LoginPage
    },
    {
      path: "/addBook",
      name: "AddBook",
      component: AddBook
    },
    {
      path: "/uploadText",
      name: "UploadText",
      component: UploadText
    },
    {
      path: "/uploadAudio",
      name: "UploadAudio",
      component: UploadAudio
    },
    {
      path: "/BookList",
      name: "BookList",
      component: BookList
    },
    {
      path: "/bookListFilter",
      name: "BookListFilter",
      component: BookListFilter
    },
    {
      path: "/BookPage",
      name: "BookPage",
      component: BookPage
    },
    {
      path: "/AddPage",
      name: "AddPage",
      component: AddPage
    },
    {
      path: "/addlanguage",
      name: "AddLanguage",
      component: AddLanguage
    },
    {
      path: "/uploadpic",
      name: "UploadPic",
      component: UploadPic
    }
  ],
  mode: "history"
}); */


