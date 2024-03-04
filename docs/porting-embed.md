# Porting Embed

The Porting Embed allows a user to complete a number porting inside your app.

Number Porting is split up into a form wizard with multiple steps:

1. Carrier Details (Account Number & PIN)
2. Account Holder Details (First Name, Last Name & Birthday)
3. Account Holder Address
4. Donor Provider Approval

Each step will only be shown if the porting requires these fields, and if the user did not fill out these fields yet. When the user submits a step, the porting will be updated, and the user will see the next step, until all fields were filled out.

> [!IMPORTANT]  
> The Porting Embed currently only supports portings in the status of `informationRequired`.

## Minimal example

The embed mounts into an element on your site. Add a `<div id="portingEmbed">` to your site wherever the embed should be mounted to.

The embed does not include a submit button. You need to add your own button and use `form="gigsPortingEmbedForm"`. You have full control over the customization of this button.

You have to specify your Gigs Project ID when initializing the embed.

```html
<div id="portingEmbed"></div>
<button id="gigsPortingEmbedForm">Submit</button>
```

```js
// Optional. Adds styling to the embed.
import '@gigs/gigs-embeds-js/style.css'

import { PortingEmbed } from '@gigs/gigs-embeds-js'

// Fetch a new ConnectSession from an internal API endpoint, or any other way
// to obtain a new ConnectSession.
const session = await fetchSessionForCurrentUser()

// Initialize the embed with the session.
const embed = await PortingEmbed(session, { project: 'your-project-id' })
embed.mount('#portingEmbed')
// you can use a string selector or an element reference.

// Once the porting is completed, you can redirect the user to the next page.
embed.on('completed', ({ porting }) => {
  location.href = 'https://your-site.com/porting-completed'
})
```

- [Minimal example](#minimal-example)
- [Usage](#usage)
  - [Show a loading spinner while the embed is initializing](#show-a-loading-spinner-while-the-embed-is-initializing)
  - [Show UI depending on the current step](#show-ui-depending-on-the-current-step)
  - [Use the included styling](#use-the-included-styling)
  - [CSS customization](#css-customization)
  - [Continue after all fields were filled out](#continue-after-all-fields-were-filled-out)
  - [Show a loading state while the form is submitted](#show-a-loading-state-while-the-form-is-submitted)
  - [Reacting to validation changes](#reacting-to-validation-changes)
  - [Unsubscribe from event listeners](#unsubscribe-from-event-listeners)
  - [Using a different form id](#using-a-different-form-id)
  - [Updating options](#updating-options)
  - [Unmount the embed](#unmount-the-embed)
- [Reference](#reference)
  - [Initializing the Porting Embed](#initializing-the-porting-embed)
    - [`connectSession`](#connectsession)
    - [`project`](#project)
    - [`options`](#options)
  - [Methods](#methods)
    - [`embed.mount(element)`](#embedmountelement)
    - [`embed.update(options)`](#embedupdateoptions)
    - [`embed.unmount()`](#embedunmount)
    - [`embed.on(event, fn)`](#embedonevent-fn)
    - [`embed.off(event, fn)`](#embedoffevent-fn)
    - [`embed.currentStep(): Step`](#embedcurrentstep-step)
  - [Values](#values)
    - [Step](#step)
    - [Field Names](#field-names)

## Usage

### Show a loading spinner while the embed is initializing

The embed does not show an initial loading state. You can show your own loading state and hide it immediately before you `mount()` the embed.

```js
const embed = await PortingEmbed(session)

document.querySelector('.loading').remove()
embed.mount('#portingEmbed')
```

### Show UI depending on the current step

You can display custom headlines and information in your app depending on the current step of the porting wizard, by using `currentStep()` and the `stepChange` event.

```js
const embed = await PortingEmbed(session)

let step = embed.currentStep()

embed.on('stepChange', ({ nextStep, prevStep }) => {
  step = nextStep
})
```

See also:
- [`embed.currentStep()`](#embedcurrentstep-step)
- [`embed.on('stepChange')`](#embedonevent-fn)
- [Step](#step) for the list of steps


### Use the included styling

The embed ships with default styles which you can import in your app.

```js
import '@gigs/gigs-embeds-js/style.css'
```

### CSS customization

The embed allows for full customization of CSS.

```js
const embed = await PortingEmbed(session, {
  options: {
    className: {
      form: ({ name, dirty, valid, submitting, touched }) => 'your-class-name',
      field: ({ name, dirty, valid, touched }) => 'your-class-name',
      input: ({ name, dirty, valid, touched }) => 'your-class-name',
      label: ({ name, dirty, valid, touched }) => 'your-class-name',
      error: ({ name, dirty, touched }) => 'your-class-name',
    }
  }
})
```

- `form` corresponds to the `<form>` element.
- `field` corresponds to the `<div>` around the input, label and error.
- `input` corresponds to the `<input>` element.
- `label` corresponds to the `<label>` element.
- `error` corresponds to the `<div>` element which is shown when there is a validation error.

To apply different styles based on the current state of the embed, the className is a function with parameters:

- `name` is the name of the input. For the form, it's the name of the current wizard step.
- `dirty` indicates if the input or form was changed (i.e. the user changed an input).
- `touched` indicates if the input or form was touched (i.e. the user clicked on an input).
- `valid` indicates if the input or form is valid or invalid.
- `submitting` indicates if the form is currently submitting.

See also:

- [Step](#step) for the list of steps.
- [Field Names](#field-names) for the list of field names.

### Continue after all fields were filled out

When the user entered all fields in all steps of the wizard, the embed will not render any UI anymore. You can handle this in your app by listening for the `completed` event.

```js
const embed = await PortingEmbed(session)

embed.on('completed', ({ porting }) => {
  location.href = 'https://your-site.com/porting/completed'
})
```

> [!NOTE]  
> A completed porting does not mean the porting was also successful. It takes some time until the porting was processed by the provider. You can [subscribe to our webhooks](https://developers.gigs.com/docs/api/441a2e9e7811d-events-and-webhooks) to be notified when a porting succeeds or is denied.

See also:
- [`embed.on('stepChange')`](#embedonevent-fn)

### Show a loading state while the form is submitted

You can show a loading spinner, for example on your button, while the form is being submitted, by listening to the `submitStatus` event.

> [!TIP]
> It's useful to disable the button while the form is submitting.

```js
const embed = await PortingEmbed(session)

embed.on('submitStatus', ({ status, porting, error }) => {
  if (status === 'loading') {
    document.querySelector('.submit').innerText = 'Loading...'
    document.querySelector('.submit').disabled = true
  } else {
    document.querySelector('.submit').innerText = 'Save'
    document.querySelector('.submit').disabled = false
  }
})
```

`status` can be one of the following:
- `loading` while the request is loading.
- `success` when the request was successful. The updated porting is available as `porting` on the event.
- `error` when the request failed. The error is available as `error` on the event.

See also:
- [`embed.on('stepChange')`](#embedonevent-fn)

### Reacting to validation changes

You can react to changes if the current form is valid or invalid by listening to the `validationChange` event:

```js
const embed = await PortingEmbed(session)

embed.on('validationChange', ({ isValid }) => {
  if (isValid) {
    document.querySelector('.submit').style.opacity = 1;
  } else {
    document.querySelector('.submit').style.opacity = 0.5;
  }
})
```

The form will initially always be valid, before the user interacts with the form.

> [!IMPORTANT]  
> Do not disable the submit button based on the validation. Clicking the submit button is a way a user should be able to trigger form validation.

See also:
- [`embed.on('stepChange')`](#embedonevent-fn)

### Unsubscribe from event listeners

If you listen to an event using `embed.on()`, you can use `embed.off()` to remove the event listener again.

```js
const embed = await PortingEmbed(session)

const completed = () => { /* ... */ }
embed.on('completed', completed)
embed.off('completed', completed)
```

See also:
- [`embed.on('stepChange')`](#embedonevent-fn)

### Using a different form id

By default, the form and your corresponding button use the ID `gigsPortingEmbedForm`. You can change this value when initializing the embed:

```js
const embed = await PortingEmbed(session, {
  options: {
    formId: 'customFormId'
  }
})
```

See also:
- [Initializing the Porting Embed](#initializing-the-porting-embed)

### Updating options

You can update the options after the embed was initialized, by using the `update()`. This does not merge the new options into the existing options, it overrides them completely.

```js
const embed = await PortingEmbed(session, {
  options: {
    formId: 'customFormId'
  }
})
embed.update({ formId: 'newCustomFormId' })
```

See also:
- [`embed.update()`](#embedupdateoptions)

### Unmount the embed

You can use `unmount()` to unmount the embed from the DOM, for example when you're building a Single Page Application.

```js
const embed = await PortingEmbed(session)

app.onBackNavigation(() => {
  embed.unmount()
})
```

See also:
- [`embed.unmount()`](#embedunmount)

## Reference

### Initializing the Porting Embed

```js
const embed = await PortingEmbed(connectSession, {
  project,
  options,
})
```

#### `connectSession`

*Required.*  
The complete Connect Session object which you created on your server and passed to the browser. Do not store this.

#### `project`

*Required.*  
The ID of your Gigs Project.

#### `options`

*Optional.*
Options to customize the embed. See the usage above.

### Methods

#### `embed.mount(element)`

Mounts the embed into the element. `element` can be a string selector or an element reference.

#### `embed.update(options)`

Updates the `options` which the embed was initialized with. It overrides all options and does not merge the new options with the existing options.

#### `embed.unmount()`

Unmounts the embed from the DOM.

#### `embed.on(event, fn)`

Add an event listener to the embed. You can use the following events:

```js
// Fired when the porting was completed.
embed.on('completed', ({ porting }) => {})

// Fired when the porting step was successfully submitted and
// continues with the next step.
embed.on('stepChange', ({ nextStep, prevStep }) => {})

// Fired when the submit status of the porting changes.
embed.on('submitStatus', ({ status, porting, error }) => {
  // status can be `loading`, `success` or `error`
})

// Fired when the form gets invalid or valid.
embed.on('validationChange', ({ isValid }) => {})
```

#### `embed.off(event, fn)`

Remove an event listener.

#### `embed.currentStep(): Step`

Gets the name of the current step of the wizard. 

### Values

#### Step

The porting form is divided into a multi-step wizard. Each step in the wizard has a name:

- `"carrierDetails"` for the Carrier Details step
- `"holderDetails"` for the Account Holder Details step
- `"address"` for the Account Holder Address step
- `"donorProviderApproval"` for the Donor Provider Approval step
- `null` if there are no steps left, meaning all fields were filled out.

#### Field Names

Each field in the a step has a name. If a field is not required by a porting, it will not be shown.

- Form: `carrierDetails`
  - `accountNumber` (text)
  - `accountPin` (text)
- Form: `holderDetails`
  - `firstName` (text)
  - `lastName` (text)
  - `birthday` (date)
- Form: `address`
  - `line1` (text)
  - `line2` (text)
  - `city` (text)
  - `postalCode` (text)
  - `state` (text)
  - `country` (text)
- Form: `donorProviderApproval`
  - `donorProviderApproval` (checkbox)