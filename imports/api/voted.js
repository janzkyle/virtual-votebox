import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Voted = new Mongo.Collection('voted');

if (Meteor.isServer) {
  Meteor.publish('voted', () => {
    return Voted.find();
  });
}
