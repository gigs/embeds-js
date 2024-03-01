# Gigs Embeds for JavaScript (Web)

Embeddable prebuilt and highly customizable UI components to use in your own JavaScript apps for web.

> [!NOTE]
> This library is currently under development.

## Installation

```sh
npm install @gigs/gigs-embeds-js
```

## Getting started

To use Gigs Embeds, you need

1. A Gigs project
2. A Gigs API Key
3. A server to create an [authenticated Connect Session](https://developers.gigs.com/docs/api/cdb1438ed4da9-creating-connect-sessions)

> [!INFO]
> Your not yet a Gigs customer? [Get in touch](https://gigs.com/contact) to discuss the next steps!

## Usage

### How it works

Using a Gigs Embed needs 2 parts:

- Your server which authenticates the current user and creates a Connect Session. Can be an API endpoint or passed otherwise from your server to your client. Our developer documentation has a [guide on Creating Connect Sessions](https://developers.gigs.com/docs/api/cdb1438ed4da9-creating-connect-sessions).
- Your client which uses the Connect Session to initialize the Embed, which makes requests directly to the Gigs API in the scope of your user. The client-side use is explained below.

When using Connect Sessions with Gigs Embeds, you do not redirect to the session's `url`. Instead you initialize the embed with the full session object.

Additionally, you can subscribe to [Webhooks](https://developers.gigs.com/docs/api/441a2e9e7811d-events-and-webhooks) to get a verified outcome of a user's interaction, like when they completed a number porting. The Embeds are also returning the outcome of a user's interaction, but you should use Webhooks for mission-critical processes like updating a record in your database based on the outcome.

### Porting Embed

The Porting Embed allows a user to complete a number porting inside your app.

```js
// index.js

// You can pass the Connect Session to the browser however you want.
const session = await fetchSessionForCurrentUser()

// Initialize the embed with the session.
const embed = await PortingEmbed(session, {
  project: 'your-project-id',
  options: {
    className: {
      // The embed offers extensive customization options. See more details in
      // the reference below.
      input: () => 'custom-class-names',
    },
  },
})

// After the initization, you can hide any loading states...
document.getElementById('loading').remove()

// ...and mount the embed.
embed.mount('#embedMount') // you can use a string selector or an element reference.

// You can listen to events to reflect changes in the embed in your own UI.
embed.on('submitStatus', ({ status }) => {
  if (status === 'loading') {
    document.querySelector('#submit').disabled = true
    document.querySelector('#submit').innerText = 'Loading...'
  }
  if (status === 'success') {
    document.querySelector('#submit').disabled = false
    document.querySelector('#submit').innerText = 'Save'
  }
})

// Once the porting is completed, you can redirect the user to the next page.
embed.on('completed', ({ porting }) => {
  location.href = 'https://your-site.com/porting-completed'
})
```

```html
<!-- index.html -->

<div id="loading">Loading...</div>

<!-- The embed will get mounted into this element -->
<div id="embedMount"></div>

<!-- The embed does not contain a button, but instead you can provide your own
     custom button. It just needs the `gigsPortingEmbedForm` form attribute. -->
<button id="submit" form="gigsPortingEmbedForm">Save</button>
```

## Reference

### Porting Embed

```js
const embed = await PortingEmbed(connectSession, {
  project,
  options,
})
```

`connectSession`  
The complete Connect Session object which you created on your server and passed to the browser. Is required.

`project`  
The ID of your Gigs Project.

`options`  
Additional options to customize the embed.

#### Options

All options are optional.

`formId: string`  
Will be used inside the embed as `<form id="">`. Defaults to `gigsPortingEmbedForm`.

`className.form({ name, dirty, valid, submitting, touched }) => string`  
Generate custom class names for the `<form>` element of the embed.

`className.field({ name, dirty, valid, touched }) => string`  
Generate custom class names for the `<div>` element of the embed which wraps a form field, consisting of an input, label and error message.

`className.input({ name, dirty, valid, touched }) => string`  
Generate custom class names for the `<input>` element of the embed.

`className.label({ name, dirty, valid, touched }) => string`  
Generate custom class names for the `<label>` element of the embed.

`className.error({ name, dirty, touched }) => string`  
Generate custom class names for the `<div>` element of the embed which contains the error message, if the form field is invalid.

#### Methods

`embed.mount(element)`  
Mounts the embed into the element. Can be a string selector or an element reference.

`embed.update(options)`  
Updates the `options` which the embed was initialized with. This overrides all options, it does not merge the new options with the existing options.

`embed.unmoun()`  
Unmounts the embed from the DOM.

`embed.on(event, fn)`  
Add an event listener to the embed.

`embed.off(event, fn)`  
Remove the event listener from the embed.

`embed.currentStep()`  
Returns the name of the current step the user is in. The embed is a multi-step form wizard. Can be the strings `carrierDetails`, `holderDetails`, `address`, `donorProviderApproval`. Can also also be `null` if there are no steps left.

#### Events

`embed.on('validationChange', { isValid })`  
Fired when the validation status of the form changes. Initially, forms are always valid. Do not use this to disable clicking on your "Submit" button, as clicking a Submit button is a way to trigger the form validation.

`embed.on('submitStatus', { status, porting, error })`  
Fired when the current form is submitted. Can have the status of `loading`, `success` or `error`.

`embed.on('stepChange', { nextStep, prevStep })`  
Fired when the step changes, with the name of the step the user will see next, and the name of the step the user just submitted. The steps can be the strings `carrierDetails`, `holderDetails`, `address`, `donorProviderApproval`. Can also also be `null` if there are no steps left.

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.
