import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { Voted } from './voted';

export const Votes = new Mongo.Collection('votes');

// Deny all client-side updates on the Votes collection
Votes.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

if (Meteor.isServer) {
  Meteor.publish('candidates', () => {
    return Votes.find({}, { fields: { name: 1, position: 1 } });
  });

  Meteor.publish('tallies', () => {
    return Votes.find({}, { fields: { updatedAt: 0 } });
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
        Votes.update({ _id }, { $inc: { votes: 1 } });
      });
    }
  },
});
