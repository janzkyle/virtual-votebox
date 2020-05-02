import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Email } from 'meteor/email';
import { Papa } from 'meteor/harrison:papa-parse';

import generator from 'generate-password';

import { Votes } from '/imports/api/votes';
import { Positions } from '/imports/api/positions';

const candidates = [
  { position: 'President', name: 'Sergio Marquina' },
  { position: 'External Vice President', name: 'Andrés de Fonollosa' },
  { position: 'External Vice President', name: 'Martín Berrote' },
  { position: 'Finance Officer', name: 'Ágata Jiménez' },
  { position: 'Secretary-General', name: 'Raquel Murillo' },
  { position: 'Secretary-General', name: 'Silene Oliveira' },
  { position: 'Secretary-General', name: 'Mónica Gaztambide' },
  { position: 'VP for External Affairs', name: 'Alicia Sierra' },
  { position: 'VP for External Affairs', name: 'Arturo Román' },
  { position: 'VP for Human Resources', name: 'Ricardo Ramos' },
  { position: 'VP for Training and Development', name: 'Aníbal Cortés' },
  { position: 'VP for Training and Development', name: 'Mirko Dragic' },
  { position: 'VP for Training and Development', name: 'Colonel Luis Tamayo' },
  { position: 'VP for Special Projects', name: 'Marseille' },
  { position: 'VP for Special Projects', name: 'Radko Dragić' },
  { position: 'VP for Special Projects', name: 'Bogotá' },
  { position: 'VP for Special Projects', name: 'César Gandía' },
];

const positions = [
  { position: 'President', votesPerPerson: 1, withAbstain: true },
  { position: 'External Vice President', votesPerPerson: 1, withAbstain: true },
  { position: 'Finance Officer', votesPerPerson: 1, withAbstain: true },
  { position: 'Secretary-General', votesPerPerson: 1, withAbstain: true },
  { position: 'VP for Human Resources', votesPerPerson: 2, withAbstain: true },
  {
    position: 'VP for Training and Development',
    votesPerPerson: 2,
    withAbstain: true,
  },
  { position: 'VP for Special Projects', votesPerPerson: 2, withAbstain: true },
  { position: 'VP for External Affairs', votesPerPerson: 1, withAbstain: true },
];

const addAbstain = (positions, candidates) => {
  positions.map((position) =>
    candidates.push({ position: position.position, name: 'Abstain' })
  );
};

Meteor.startup(() => {
  addAbstain(positions, candidates);

  // insert candidates to votes collection
  if (Votes.find().count() !== candidates.length) {
    //make sure to start with clean db
    Votes.remove({});
    candidates.map((candidate) => {
      console.log(`Inserting: ${candidate.name} as ${candidate.position}`);
      candidate.votes = 0;
      candidate.updatedAt = new Date();
      Votes.insert(candidate);
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
  console.log(existingUsers);

  const passwords = generator.generateMultiple(membersTable.length, {
    length: 8,
  });

  const fromEmail = process.env.MAIL_URL.substr(
    8,
    process.env.MAIL_URL.indexOf(':')
  );

  for (let i = 0; i < membersTable.length; i++) {
    let memberRow = membersTable[i];
    let lastName = memberRow[0];
    let firstName = memberRow[1];
    let name = firstName.concat(' ', lastName);
    let email = memberRow[2];
    let password = passwords[i];

    try {
      if (!existingUsers.includes(email)) {
        console.log(`Emailing ${email}: ${password}`);
        Email.send({
          from: fromEmail,
          to: email,
          subject: 'AECES 2020 Online Elections',
          text: `Hello AECES Member!\n\nYou may login and vote for your next Executive Board at ${process.env.ROOT_URL} using your email and the auto-generated password below. \nEmail: ${email} \nPassword: ${password} \n\nPlease do not reply to this email.`,
        });
        console.log('Adding to accounts');
        Accounts.createUser({
          email,
          password,
          profile: { name },
        });
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
});
