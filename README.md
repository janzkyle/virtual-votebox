# Virtual Votebox README

## Installation

### Node

Download Node from this link: [https://nodejs.org/en/download/](https://nodejs.org/en/download/)

Install it and make sure that `npm` command is working in your terminal

### Meteor

The app is built on Meteor, a JS full-stack framework.

If you're running on OSX or Linux, run this command in your terminal:

```bash
curl https://install.meteor.com/ | sh
```

If you are on Windows: First install [Chocolatey](https://chocolatey.org/install), then run this command using an Administrator command prompt:

```bash
choco install meteor
```

### Dependencies

To install the app's dependencies, go to the app's root directory in terminal then run:

```bash
meteor npm install
```

## Filling up necessary data

### Candidates

View the sample ballot  in `private/ballot.json`. Update the json file with the actual election info. Make sure to follow proper json format.

### Voters

View the sample list of voters' name and email in `test.csv`. You can open the csv file in excel for a better look.

Since the actual voters' list contains confidential info, I suggest to create another csv file and don't push the changes to the github repo

In `server/main.js`, find the line with `const membersCSV = Assets.getText('test.csv');` and change `test.csv` to the csv file that you created

## Setup email for email blast

Choose a google account (preferably .edu account) that you will use for email blasting of voters' login credentials to the app. I used the org's email before since I can't make it work if I use a regular Gmail account.

To allow email blasting using the app, follow these steps:

- Open the Google account settings in [https://myaccount.google.com/](https://myaccount.google.com/)
- Go to *Security* > *Less Secure App Access* and click **Turn on access**

You can edit the email's subject and body in `emailSubject.txt` and `emailBody.txt` located under `private/`

In run.sh, change the value of MAIL_URL based on your email credentials `smtps://<email>:<password>@smtp.gmail.com:465/`

*Note*: Remember to turn off the *Less Secure App Access* feature again after the email blast

## Database

- Create a MongoDB account here: [https://www.mongodb.com/](https://www.mongodb.com/)
- Build a free cluster. Doing this is kinda straightforward just by following the flow on the site.
- Once you have created your cluster, open it and click the **connect** button. In **Add a connection IP address** section, choose **Allow Access from Anywhere** and click **Add IP address.**
- Provide username and password to the **Create a Database User** part and remember the password.
- Click **choose a connection method** and choose **Connect your application**
- Copy the URL until before the "?" and replace the MONGO_URL value in run.sh. Change the `<password>` with the password that you provided earlier. Also replace `myFirstDatabase` to any DB name that you want.

## Running locally

**WARNING**: Before you run the app locally, make sure that you are not using the actual voters list so you don't accidentally send an email blast to them.

If you're using Linux, run `./run.sh` which contains the script for setting the environment variables for email and database before running the app.

Otherwise, copy the contents of `run.sh` and paste it to your terminal.

If the terminal logs a dependency error, it should show the instructions on how to install them. Just follow it.

## Deployment in Heroku

- Create a Heroku account
- Download and install Heroku CLI here: [https://devcenter.heroku.com/articles/heroku-cli](https://devcenter.heroku.com/articles/heroku-cli)
- In your terminal, run: `heroku login`. It should open a tab to your browser that lets you login to your heroku account
- Run `heroku create <app-name>` to create a heroku app. The app will have a URL of `https://<app-name>.herokuapp.com`
- Run `heroku git:remote -a <app-name>` to set the heroku repo to your git config
- Run `heroku buildpacks:set https://github.com/AdmitHub/meteor-buildpack-horse.git` in your project directory to add the buildpack to your project
- Update the necessary values and run the following commands to set the environment vars in heroku:

```bash
heroku config:set MONGO_URL="mongodb+srv://<username>:<password>@<url>/<dbname>"
heroku config:set MAIL_URL="smtps://<email>:<password>@smtp.gmail.com:465"
heroku config:set ROOT_URL="https://<app-name>.herokuapp.com"
```

- Commit all your changes then run `git push heroku master` to deploy. Watch the logs in your terminal as it is being deployed. It is expected that the deployment can take a few mins.
- Run `heroku logs --tail` to see if the app is sending emails continuously. If the app suddenly stops sending emails, run `heroku restart`
