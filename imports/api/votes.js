import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

import { Voted } from './voted';

export const Votes = new Mongo.Collection('votes');

if (Meteor.isServer) {
  Meteor.publish('candidates', () => {
    return Votes.find({}, { fields: { name: 1, position: 1 } });
  });
}

Meteor.methods({
  'votes.update'(votes) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    if (Voted.findOne({ user_id: Meteor.userId() })) {
      throw new Meteor.Error('already-voted');
    } else {
      console.log(votes);
      votes.map((_id) => {
        Votes.update({ _id }, { $inc: { votes: 1 } });
      });
    }
  },
});
