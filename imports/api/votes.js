import { Meteor } from 'meteor/meteor'
import { Mongo } from 'meteor/mongo'

export const Votes = new Mongo.Collection('votes');

if (Meteor.isServer) {
  Meteor.publish('votes',() => {
    return Votes.find();
  });
}

Meteor.methods({
  'votes.update'(votes) {
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    if (Voted.findOne({ user_id: Meteor.userId() })) {
      throw new Meteor.Error('already-voted')
    } else {
      console.log(votes)
      votes.map(id => {
        id = parseInt(id)
        Votes.update({ id }, { $inc: { votes: 1 } })
      })
    }
  }
})