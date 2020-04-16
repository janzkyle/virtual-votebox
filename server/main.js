import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Email } from 'meteor/email';
import { Papa } from 'meteor/harrison:papa-parse';

import generator from 'generate-password';

import { Votes } from '/imports/api/votes';

const candidates = [
  { position: 'President', name: 'Kyle Ordona1' },
  { position: 'President', name: 'Kyle Ordona2' },
  { position: 'External Vice President', name: 'Kyle Ordona3' },
  { position: 'External Vice President', name: 'Kyle Ordona4' },
  { position: 'Finance Officer', name: 'Kyle Ordona5' },
  { position: 'Secretary-General', name: 'Kyle Ordona6' },
  { position: 'Secretary-General', name: 'Kyle Ordona7' },
  { position: 'VP for RnD', name: 'Kyle Ordona8' },
  { position: 'VP for RnD', name: 'Kyle Ordona9' },
  { position: 'VP for RnD', name: 'Kyle Ordona10' },
];

const addAbstain = (candidates) => {
  const positions = Array.from(
    new Set(candidates.map((candidate) => candidate.position))
  );
  positions.map((position) => candidates.push({ position, name: 'Abstain' }));
};

Meteor.startup(() => {
  addAbstain(candidates);

  // insert candidates to votes collection
  if (Votes.find().count() !== candidates.length) {
    //make sure to start with clean db
    Votes.remove({});

    Votes.rawCollection().createIndex({ userid: 1 }, { unique: true });

    candidates.map((candidate, index) => {
      console.log(`Inserting: ${candidate.name} as ${candidate.position}`);
      Votes.insert({
        userid: index,
        name: candidate.name,
        position: candidate.position,
        votes: 0,
        updatedAt: new Date(),
      });
    });
  }

  const csv = Assets.getText('AECESCB1920Test.csv');
  const memberTable = Papa.parse(csv).data;

  let lastName, firstName, email, memberRow;
  let passwords = generator.generateMultiple(memberTable.length, {
    length: 8,
  });

  for (let i = 0; i < memberTable.length; i++) {
    memberRow = memberTable[i];
    lastName = memberRow[0];
    firstName = memberRow[1];
    email = memberRow[2];
    password = passwords[i];

    console.log(`[Member] ${lastName}, ${firstName}`);

    try {
      if (!Accounts.findUserByEmail(email)) {
        console.log('Adding to accounts...');
        Accounts.createUser({ email, password });
        console.log(`Emailing: ${email} , password: ${password}`);
        Email.send({
          from: 'aecescomelec2020@gmail.com',
          to: email,
          subject: 'AECES 2020 Online Elections',
          text: `You may login and vote at ${process.env.ROOT_URL} using this email and the auto-generated password below. \nEmail: ${email} \nPassword: ${password} \n\nPlease do not reply to this email.`,
        });
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
});
