import { Mongo } from 'meteor/mongo';

export const Voted = new Mongo.Collection('voted');

if (Meteor.isServer) {
  Meteor.publish('voted',() => {
    return Voted.find();
  });
}

Meteor.methods({
  'voted.insert'(text) {
    check(text, String);
 
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    Voted.insert({
      votedAt: new Date(),
      user: this.userId
    });
  }
})