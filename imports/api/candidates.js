import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { Voted } from './voted';

export const Candidates = new Mongo.Collection('candidates');

// Deny all client-side updates on the Candidates collection
Candidates.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

if (Meteor.isServer) {
  Meteor.publish('candidates', () => {
    return Candidates.find({}, { fields: { name: 1, position: 1 } });
  });

  Meteor.publish('tallies', () => {
    return Candidates.find({}, { fields: { updatedAt: 0 } });
  });
}

Meteor.methods({
  'votes.update'(votes) {
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
        Candidates.update({ _id }, { $inc: { votes: 1 } });
      });
    }
  },
});
