export const STATUS_BANNER = {
  ACTIVE: 'active',
  INACTIVE: 'inactive'
}

export const STATUS_BANNER_MAPPING = {
  [STATUS_BANNER.ACTIVE]: {label: 'Hoạt động', color: 'green'},
  [STATUS_BANNER.INACTIVE]: {label: 'Không hoạt động', color: 'red'},
}

export const STATUS_BANNER_OPTIONS = [
  {label: 'Hoạt động', value: 'active'},
  {label: 'Không hoạt động', value: 'inactive'},
]