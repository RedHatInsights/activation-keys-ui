# Red Hat Activation Keys UI

## First time setup

### Quick start
1. Make sure you have [`Node.js`](https://nodejs.org/en/) and [`npm`](https://www.npmjs.com/) installed
2. Run [script to patch your `/etc/hosts`](https://github.com/RedHatInsights/insights-proxy/blob/master/scripts/patch-etc-hosts.sh)
3. Make sure you are using [Red Hat proxy](http://hdn.corp.redhat.com/proxy.pac)

## Running locally
1. Install dependencies with `npm install`
2. Run development server with `npm run start`
3. Choose an environment of your choice
3. Local version of the app will be available at respective location and link will be provided in the terminal

### Testing

- `npm run verify` will run linters and tests

## Patternfly

- This project imports Patternfly components:
  - [Patternfly React](https://github.com/patternfly/patternfly-react)

## Insights Components

Platform experience will deliver components and static assets through [npm](https://www.npmjs.com/package/@redhat-cloud-services/frontend-components). ESI tags are used to import the [chroming](https://github.com/RedHatInsights/insights-chrome) which takes care of the header, sidebar, and footer.

