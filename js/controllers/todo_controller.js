Todos.TodoController = Ember.ObjectController.extend({
  actions: {
    editTodo: function () {
      this.set('isEditing', true);
    },

    doneEditing: function () {
      var bufferedTitle = this.get('bufferedTitle').trim();

      if (Ember.isEmpty(bufferedTitle)) {
        // The `doneEditing` action gets sent twice when the user hits
        // enter (once via 'insert-newline' and once via 'focus-out').
        //
        // We debounce our call to 'removeTodo' so that it only gets
        // made once.
        Ember.run.debounce(this, 'removeTodo', 0);
      } else {
        var todo = this.get('model');
        todo.set('title', bufferedTitle);
        todo.save();
      }

      // Re-set our newly edited title to persist its trimmed version
      this.set('bufferedTitle', bufferedTitle);
      this.set('isEditing', false);
    },

    cancelEditing: function () {
      this.set('bufferedTitle', this.get('title'));
      this.set('isEditing', false);
    },
    
    acceptChanges: function() {
      this.set('isEditing', false);

      if (Ember.isEmpty(this.get('model.title'))) {
        this.send('removeTodo');
      } else {
        this.get('model').save();
    }
    },
    removeTodo: function () {
      var todo = this.get('model');
      todo.deleteRecord();
      todo.save();
    }
  },

  isEditing: false,

  
  isCompleted: function(key, value){
    var model = this.get('model');

    if (value === undefined) {
      // property being used as a getter
      return model.get('isCompleted');
    } else {
      // property being used as a setter
      model.set('isCompleted', value);
      model.save();
      return value;
    }
  }.property('model.isCompleted'),


});