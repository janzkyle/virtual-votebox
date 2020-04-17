import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'

export const Positions = new Mongo.Collection('positions');

if (Meteor.isServer) {
  Meteor.publish('positions',() => {
    return Positions.find({}, {fields: { withAbstain: 0 }});
  });
}