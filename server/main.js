import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Email } from 'meteor/email';
import { Papa } from 'meteor/harrison:papa-parse';

import generator from 'generate-password';

import { Candidates } from '/imports/api/candidates';
import { Positions } from '/imports/api/positions';

Meteor.startup(() => {
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
  const positions = ballot.map(({ candidates, ...item }) => item);

  // add abstain candidates
  positions.forEach((position) => {
    if (position.withAbstain) {
      candidates.push({ position: position.position, name: 'Abstain' });
    }
  });
  console.table(positions);
  console.table(candidates);

  // insert to Candidates collection
  if (Candidates.find().count() !== candidates.length) {
    Candidates.remove({});
    candidates.map((candidate) => {
      candidate.votes = 0;
      candidate.updatedAt = new Date();
      Candidates.insert(candidate);
      console.log(`Inserted: ${candidate.name} as ${candidate.position}`);
    });
  }
  // insert to Positions collection
  if (Positions.find().count() !== positions.length) {
    Positions.remove({});
    positions.map((position) => {
      Positions.insert(position);
      console.log(`Inserted: ${position.position}`);
    });
  }

  // get csv file from /private directory
  const membersCSV = Assets.getText('stressTest.csv');
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

  Meteor.defer(() => {
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
      while (true) {
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
          break;
        } catch (err) {
          console.log(err);
        }
      }
    }
  });
});
