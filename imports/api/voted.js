import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Voted = new Mongo.Collection('voted');

// Deny all client-side updates on the Voted collection
Voted.deny({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

if (Meteor.isServer) {
  Meteor.publish('voted', () => {
    return Voted.find();
  });
}
