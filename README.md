# lendsqr_assessment

## Description
This is a demo credit app that allows users to borrow money from a money lender.


##### Postman Documentation Link
_[Postman Documentation](https://documenter.getpostman.com/view/17952060/2s9YXpVyec)_

---


##### Running the project in your local machine
    - clone the repo
    - Run `yarn install` to install all dependencies
    - Rename .env.example file to .env or you can choose to copy it using `cp .env.example .env` if you want to keep the .env.example file for reference
    - Fill in the environment variables
    - Run pending migrations using `npx knex migrate:latest`
    - Seed the banks data using `npx knex seed:run`
    - Run `yarn start` to run the application
    - Run `yarn test-dev` to run test cases

This project uses paystack for withdrawals and as such the webhooks need to be set up to receive events from Paystack


Technical Documentation:
https://docs.google.com/document/d/1s_fxIdr_u4EiEgxq6yOzq0K3PxpuyCrREwF9ichvHAo/edit?usp=sharing