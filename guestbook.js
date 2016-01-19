Messages = new Mongo.Collection('messages');



if (Meteor.isClient) {
  Meteor.subscribe("messages");

  Template.guestBook.helpers({
    'messages':function() {
      return Messages.find({}, {sort: {createdOn: -1}}) || {};
    }
  });

  Template.guestBook.events({
  'submit form':function(event) {
    event.preventDefault();

    var messageBox=
    $(event.target).find('textarea[name=guestBookMessage]');
    var messageText=messageBox.val();

    var nameBox=$(event.target).find('input[name=guestName]');
    var name=nameBox.val();

    Messages.insert({message: messageText, name: name, createdOn: Date.now(), like: 0});
    messageBox.val('');
    nameBox.val('');
    alert("Thank you for submitting!");
  },
    "click .like":function () {
      Messages.update(this._id, {
        $set: {"like": this.like +1}
      });
    },

    "click .dislike":function () {
      if(this.like > -5) {
      Messages.update(this._id, {
        $set: {"like": this.like -1}
      });
    }
    else {
        alert("This message has 5 dislikes, and will be deleted.")
        Messages.remove(this._id)
      };
    },

});



}

if (Meteor.isServer) {
  Meteor.publish("messages", function() {
    return Messages.find();
  });

  Meteor.startup(function () {
    // code to run on server at startup
  });
}
