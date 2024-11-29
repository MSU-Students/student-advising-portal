# Dev Guide for UI Components

## UI Components

### Layout

Layout is container of the islands of certain screen.
**Location**: `src/layouts/`
**Naming Convention**: {PascalCaseName}Layout.vue

Example: MainLayout.vue, PlainLayout.vue, PrintLayout.vue

```html
<q-layout>
  <q-page-container>
    <router-view />
  </q-page-container>
</q-layout>
```

### Page

Page is the container of main content of your app.

**Location**: `src/pages`
**Naming Convention**: `{PascalName}Page.vue`

Example: `LoginPage.vue`, `BookingAppointmentsPage.vue`

```html
<q-page>
  <!-- Page Content -->
</q-page>
```

### Component

Components are reusable component parts of the pages.

**Naming Convention**: `{PascalName}Comp.vue`

Example: `AvatarComp.vue`, `MenuItemComp.vue`, `SearchComp.vue`

```html
<div>
  <!-- Content -->
</div>
```

### Dialog

Reusable Dialog Components Invoked in Pages

**Location**: `src/dialogs`

Naming Conventions: `{PascalName}Dialog.vue`

Example: `RegisterDialog.vue`, `BookAppointmentDialog.vue`

**Steps**

1. Register Dialog

- Create Dialog Module/Folder if not existing under `src/dialogs/{module}`
- Create `definition.ts` if not existing
- Register your dialog using `Struct model`

```ts
  | Struct<'confirmLockDialog', {
    success?: VoidCallback;
    error?: ErrorCallback;
  }>
```

- Expose Dialog
  Go to `src/the-dialogs.ts`, then add your module if not exposed.

2. Put the Dialog on your Layout
   `import ConfirmLockDialog from 'src/dialogs/auth/ConfirmLockDialog.vue';`

```html
<ConfirmLockDialog />
```

3. Invoke your dialog

```ts
TheDialogs.emit({
  type: 'confirmLockDialog',
  arg: {},
});
```

## Workflow

Logics using same pattern with Dialogs

**Location**: `src/workflows`

Naming Conventions: `{kebab-space}.workflow.ts`

Example: `login-with-email.workflow.ts`

**Steps**

1. Register Workflow

- Create Workflow Module/Folder if not existing under `src/workflows/{module}`
- Create `definition.ts` if not existing
- Register your dialog using `Struct model`

```ts
  | Struct<'confirmLock', {
    success?: VoidCallback;
    error?: ErrorCallback;
  }>
```

2. Invoke your dialog

```ts
TheWorkflows.emit({
  type: 'confirmLock',
  arg: {},
});
```

## Store
