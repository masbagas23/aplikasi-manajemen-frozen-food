export default defineNuxtRouteMiddleware((to) => {
  const { status } = useAuth()
  const splitter = to.path.split('/')
  const state = useLayoutStore()
  const name = splitter[splitter.length - 1].replace('-', ' ')
  state.setTitle(name)
  const title = setTitleApp(name)
  useHead({
    titleTemplate: title,
  })
  if (status.value == 'authenticated') {
    setPageLayout('admin')
  } else {
    setPageLayout('default')
  }
})
