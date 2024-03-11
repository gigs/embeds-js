# Gigs Embeds for JavaScript (Web)

<img width="600" height="390" src=".github/banner.png" alt="Gigs Embeds">

Embeddable prebuilt and highly customizable UI components to use in your own JavaScript apps for web.

> [!NOTE]
> This is currently a v0.x release. Anything may change at any time.

## Installation

```sh
npm install @gigscom/embeds-js
```

## Getting started

To use Gigs Embeds, you need:

1. A Gigs project
2. A Gigs API Key
3. A server to create an [authenticated Connect Session](https://developers.gigs.com/docs/api/cdb1438ed4da9-creating-connect-sessions)

> [!TIP]
> You're not yet a Gigs customer? [Get in touch](https://gigs.com/contact) to discuss the next steps!

## How it works

Using a Gigs Embed needs 2 parts:

- Your server which authenticates the current user and creates a Connect Session. Can be an API endpoint or passed otherwise from your server to your client. Our developer documentation has a [guide on Creating Connect Sessions](https://developers.gigs.com/docs/api/cdb1438ed4da9-creating-connect-sessions).
- Your client which uses the Connect Session to initialize the Embed, which makes requests directly to the Gigs API in the scope of your user. The client-side use is explained below.

When using Connect Sessions with Gigs Embeds, you do not redirect to the session's `url`. Instead you initialize the embed with the full session object.

Additionally, you can subscribe to [Webhooks](https://developers.gigs.com/docs/api/441a2e9e7811d-events-and-webhooks) to get a verified outcome of a user's interaction, like when they completed a number porting. The Embeds are also returning the outcome of a user's interaction, but you should use Webhooks for mission-critical processes like updating a record in your database based on the outcome.

## Usage

- [Porting Embed](docs/porting-embed.md)

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.
