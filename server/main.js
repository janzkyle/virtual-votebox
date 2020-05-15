import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Email } from 'meteor/email';
import { Papa } from 'meteor/harrison:papa-parse';

import generator from 'generate-password';

import { Candidates } from '/imports/api/candidates';
import { Positions } from '/imports/api/positions';

// get list of positions and candidates in /private/ballot.json
const ballot = JSON.parse(Assets.getText('ballot.json'));

const candidates = ballot.reduce((acc, item) => {
  acc.push(
    ...item.candidates.map((candidate) => ({
      position: item.position,
      name: candidate,
    }))
  );
  return acc;
}, []);
console.table(candidates);

const positions = ballot.map(({ candidates, ...item }) => item);
console.table(positions);

const addAbstain = (positions, candidates) => {
  positions.map((position) =>
    candidates.push({ position: position.position, name: 'Abstain' })
  );
};

Meteor.startup(() => {
  addAbstain(positions, candidates);

  // insert candidates to votes collection
  if (Candidates.find().count() !== candidates.length) {
    //make sure to start with clean db
    Candidates.remove({});
    candidates.map((candidate) => {
      console.log(`Inserting: ${candidate.name} as ${candidate.position}`);
      candidate.votes = 0;
      candidate.updatedAt = new Date();
      Candidates.insert(candidate);
    });
  }

  if (Positions.find().count() !== positions.length) {
    //make sure to start with clean db
    Positions.remove({});
    positions.map((position) => {
      console.log(`Inserting: ${position.position}`);
      Positions.insert(position);
    });
  }

  // get csv file from /private directory
  const membersCSV = Assets.getText('test.csv');
  const membersTable = Papa.parse(membersCSV).data;

  // Get emails of existing users in db
  let existingUsers = [];
  Meteor.users
    .find({})
    .fetch()
    .map((user) =>
      existingUsers.push(...user.emails.map((email) => email.address))
    );

  const passwords = generator.generateMultiple(membersTable.length, {
    length: 8,
  });

  const from = process.env.MAIL_URL.substr(
    8,
    process.env.MAIL_URL.indexOf(':')
  );
  const subject = 'Online Elections';

  for (let i = 0; i < membersTable.length; i++) {
    let memberRow = membersTable[i];
    let lastName = memberRow[0];
    let firstName = memberRow[1];
    let name = firstName.concat(' ', lastName);
    let email = memberRow[2];
    let password = passwords[i];
    let text = `
Hello ${firstName}!

You may login and vote at ${process.env.ROOT_URL} using your email and the auto-generated password below.
Email: ${email}
Password: ${password}

Please do not reply to this email.
`;

    try {
      if (!existingUsers.includes(email)) {
        console.log(`Emailing ${email}`);
        Email.send({ from, to: email, subject, text });
        Accounts.createUser({
          email,
          password,
          profile: { name },
        });
        console.log(`${name}, ${email} added to db`);
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
});
