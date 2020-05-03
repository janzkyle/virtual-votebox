import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Email } from 'meteor/email';

import { Voted } from './voted';

export const Votes = new Mongo.Collection('votes');

if (Meteor.isServer) {
  Meteor.publish('candidates', () => {
    return Votes.find({}, { fields: { name: 1, position: 1 } });
  });

  Meteor.publish('tallies', () => {
    return Votes.find({}, { fields: { updatedAt: 0 } });
  });
}

Meteor.methods({
  'votes.update'({ votes, votesPerPosition }) {
    if (!this.userId || !Meteor.users.findOne({ _id: Meteor.userId() })) {
      throw new Meteor.Error(
        'not-authorized',
        'You are not authorized to vote'
      );
    }

    if (Voted.findOne({ userId: Meteor.userId() })) {
      throw new Meteor.Error(
        'already-voted',
        'Already voted. You cannot vote more than once'
      );
    } else {
      console.log(votes);
      Voted.insert({
        votedAt: new Date(),
        userId: this.userId,
      });

      votes.map((_id) => {
        Votes.update({ _id }, { $inc: { votes: 1 } });
      });

      emailVoteReceipt(votesPerPosition);
    }
  },
});

const emailVoteReceipt = (votesPerPosition) => {
  const from = process.env.MAIL_URL.substr(
    8,
    process.env.MAIL_URL.indexOf(':')
  );
  const to = Meteor.user().emails[0].address;
  const subject = 'Ballot Receipt';
  const text = `
    This serves as your ballot receipt. Here are the candidates that you voted:\n
    ${Object.keys(votesPerPosition).map(
      (pos) => `${pos}: ${votesPerPosition[pos].join(', ')}\n`
    )}
  `;

  Email.send({ from, to, subject, text });
};
