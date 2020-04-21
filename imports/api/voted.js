import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Voted = new Mongo.Collection('voted');

if (Meteor.isServer) {
  Meteor.publish('voted', () => {
    return Voted.findOne({ user: this.userId });
  });
}

Meteor.methods({
  'voted.insert'() {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Voted.insert({
      votedAt: new Date(),
      user: this.userId,
    });
  },
});
