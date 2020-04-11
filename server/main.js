import { Meteor } from 'meteor/meteor'
import { Accounts } from 'meteor/accounts-base'
import { Email } from 'meteor/email'
import { Papa } from 'meteor/harrison:papa-parse'

import generator from 'generate-password';

import { Votes } from '/imports/api/votes';

const candidates = [
  {position: 'President', name: 'Kyle Ordona1'},
  {position: 'President', name: 'Kyle Ordona2'},
  {position: 'External Vice President', name: 'Kyle Ordona3'},
  {position: 'External Vice President', name: 'Kyle Ordona4'},
  {position: 'Finance Officer', name: 'Kyle Ordona5'},
  {position: 'Secretary-General', name: 'Kyle Ordona6'},
  {position: 'Secretary-General', name: 'Kyle Ordona7'},
  {position: 'VP for RnD', name: 'Kyle Ordona8'},
  {position: 'VP for RnD', name: 'Kyle Ordona9'},
  {position: 'VP for RnD', name: 'Kyle Ordona10'},
]

Meteor.startup(() => {
  // insert candidates to votes collection
  if (Votes.find().count() !== candidates.length) {
    //make sure to start with clean db 
    Votes.remove({})
    
    candidates.map((candidate) => {
      Votes.insert({
        name: candidate.name,
        position: candidate.position,
        votes: 0,
        updatedAt: Date()
      })
    })
  }
  
  // setup smtp email server
  process.env.MAIL_URL = 'smtp://aecescomelec2020@gmail.com:AECESvotes2020@smtp.gmail.com:587'

  const csv = Assets.getText('AECESCB1920Test.csv')
  const memberTable = Papa.parse(csv).data

  let lastName, firstName, email, memberRow
  let passwords = generator.generateMultiple(memberTable.length, {
    length: 8,
  })
  
  for (let i = 0; i < memberTable.length; i++) {
    memberRow = memberTable[i]
    lastName = memberRow[0]
    firstName = memberRow[1]
    email = memberRow[2]
    password = passwords[i]
    
    console.log(`[Member] ${lastName}, ${firstName} | email: ${email} , password: ${password}`)

    try {
      if (!Accounts.findUserByEmail(email)) {
        console.log('Adding to accounts...')
        Accounts.createUser({ email, password })
        console.log('Emailing...')
        Email.send({
          from: 'aecescomelec2020@gmail.com',
          to: email,
          subject: 'AECES 2020 Online Elections',
          text: `You may login and vote at ${process.env.ROOT_URL} using this email and the generated password below. \nYour auto generated password is: ${password} \n\nPlease do not reply to this email.`
        })
      }
    } catch (err) {
      console.log(err)
      throw err
    }
  }

});
