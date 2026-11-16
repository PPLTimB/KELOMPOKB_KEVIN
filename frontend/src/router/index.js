
import { createRouter, createWebHistory } from 'vue-router'
import RevisionTermsView from '../views/RevisionTermsView.vue'
import KatalogView from '../views/KatalogView.vue'
import PaketDetailPlaceholderView from '../views/PaketDetailPlaceholderView.vue'
import AdminKategoriView from '../views/AdminKategoriView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/katalog',
    },
    {
      path: '/katalog',
      name: 'katalog',
      component: KatalogView,
    },
    {
      path: '/paket/:id',
      name: 'paket-detail',
      component: PaketDetailPlaceholderView,
    },
    {
      path: '/admin/kategori',
      name: 'admin-kategori',
      component: AdminKategoriView,
    },
    {
      path: '/revision-terms',
      name: 'revision-terms',
      component: RevisionTermsView,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/katalog',
    },
  ],
})

export default router
