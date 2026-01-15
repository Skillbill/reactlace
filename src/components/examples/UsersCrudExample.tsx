import type { ComponentType } from 'react'
import { RLCrud } from '../RLCrud'
import type { RLCrudProps } from '../RLCrud/types'
import { addIcon } from '../../icons'
import { ActiveCell } from './cells/ActiveCell'
import { DateCell } from './cells/DateCell'
import { DeleteDialog } from './dialogs/DeleteDialog'
import { usersStore } from './stores/usersStore'

import ghost from '@mdi/svg/svg/ghost.svg'
import deleteIcon from '@mdi/svg/svg/delete.svg'

addIcon('ghost', ghost)
addIcon('delete', deleteIcon)

const users_crud: Omit<RLCrudProps, 'getItems'> = {
  id: 'users',
  singular_label: 'user',
  primary_key: 'id',
  filters_title: 'filters',
  headers: [
    {
      i18n_key: 'Username',
      sortable: false,
      value: 'username',
      columnProps: {
        className: 'w-1/4'
      }
    },
    {
      i18n_key: 'First name',
      sortable: false,
      value: 'firstName'
    },
    {
      i18n_key: 'Last name',
      sortable: false,
      value: 'lastName'
    },
    {
      i18n_key: 'Role',
      sortable: false,
      value: 'role'
    },
    {
      i18n_key: 'Age',
      sortable: false,
      value: 'age'
    },
    {
      i18n_key: 'Active',
      sortable: false,
      value: 'active',
      type: 'boolean',
      componentProps: {
        trueColor: 'text-success-500'
      }
    },
    {
      i18n_key: 'Activation date',
      value: 'activation_date',
      sortable: false,
      type: 'date'
    },
    {
      i18n_key: 'Expiration date',
      value: 'expiration_date',
      sortable: false,
      type: 'date'
    },
    {
      i18n_key: 'Description',
      value: 'description'
    }
  ],
  filters: [
    {
      i18n_key: 'Username',
      value: 'username',
      input_type: 'text'
    },
    {
      i18n_key: 'First name',
      value: 'firstName',
      input_type: 'text'
    },
    {
      i18n_key: 'Last name',
      value: 'lastName',
      input_type: 'text'
    },
    {
      i18n_key: 'Role',
      value: 'role',
      input_type: 'select',
      options: [
        { value: '', text: '' },
        { value: 'admin', text: 'admin' },
        { value: 'user', text: 'user' },
        { value: 'guest', text: 'guest', icon: 'ghost' }
      ],
      default_value: ''
    },
    {
      i18n_key: 'Activation date',
      value: 'activation_date',
      input_type: 'date'
    }
  ],
  form_fields: [
    {
      i18n_key: 'Username',
      value: 'username',
      placeholder: 'Enter username',
      required: true,
      rules: [
        { validateFn: (v: unknown) => !!(v as string), message: 'Username is required' },
        {
          validateFn: (v: unknown) => (v as string).length > 3,
          message: 'Username must be at least 4 characters long'
        }
      ],
      side_effect: (model, fields) => {
        const { username } = model as { username: string }
        if (username === 'admin') {
          fields.role.options = [{ value: 'admin', text: 'admin' }]
          ;(model as { role: string }).role = 'admin'
        } else {
          fields.role.options = [
            { value: '', text: '' },
            { value: 'admin', text: 'admin' },
            { value: 'user', text: 'user' },
            { value: 'guest', text: 'guest' }
          ]
        }
      },
      input_type: 'text'
    },
    {
      i18n_key: 'First name',
      value: 'firstName',
      input_type: 'text'
    },
    {
      i18n_key: 'Last name',
      value: 'lastName',
      input_type: 'text'
    },
    {
      i18n_key: 'Active',
      value: 'active',
      input_type: 'checkbox',
      default_value: true
    },
    {
      i18n_key: 'Role',
      value: 'role',
      input_type: 'select',
      options: [
        { value: '', text: '' },
        { value: 'admin', text: 'admin' },
        { value: 'user', text: 'user' },
        { value: 'guest', text: 'guest' }
      ]
    },
    {
      i18n_key: 'Age',
      value: 'age',
      input_type: 'number'
    },
    {
      i18n_key: 'Activation date',
      value: 'activation_date',
      input_type: 'date'
    },
    {
      i18n_key: 'Expiration date',
      value: 'expiration_date',
      input_type: 'date'
    },
    {
      i18n_key: 'Description',
      value: 'description',
      input_type: 'textarea'
    }
  ],
  actions: [
    {
      name: 'Delete',
      i18n_key: 'Delete',
      icon_name: 'delete',
      onClick: (data: unknown) => {
        console.log('Delete side effect', { ...data as object })
      },
      component: DeleteDialog,
      dialogProperties: {
        noCloseOnOutsideClick: false
      }
    }
  ]
}

export const UsersCrudExample = () => {
  return (
    <RLCrud
      {...users_crud}
      getItems={usersStore.getUsers}
      addItem={usersStore.createUser}
      editItem={usersStore.updateUser}
      components={{
        boolean: ActiveCell as ComponentType<unknown>,
        date: DateCell as ComponentType<unknown>
      }}
      actionHeaderI18nKey="Actions"
      addI18nKey="Add"
      applyI18nKey="Apply"
      resetI18nKey="Reset"
      cancelI18nKey="Cancel"
      addButtonI18nKey="Add user"
      addTitleI18nKey="Add user"
      editTitleI18nKey="Edit user"
      editTooltipI18nKey="Edit"
    />
  )
}

UsersCrudExample.displayName = 'UsersCrudExample'
