export function setTitleApp(name: string) {
  const config = useRuntimeConfig()
  const capitalize = name.charAt(0).toUpperCase() + name.slice(1)
  return name
    ? capitalize + ' - ' + config.public.app_name
    : config.public.app_name
}
