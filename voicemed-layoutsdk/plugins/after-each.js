export default async ({ app }) => {
  app.router.afterEach((to, from) => {
    //app.context.store.commit('SET_CURRENTPAGE',to)
    if(process.browser) {
      app.$gtag('event', 'screen_view', {
        'app_name': 'vmApp',
        'screen_name' : to.name||to.path
      });
    }
  });
}
