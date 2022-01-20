from flask import Blueprint, jsonify, request
from flask_login import login_required
from app.models import Todo, db
from app.forms.todo_form import TodoForm
from app.api.auth_routes import validation_errors_to_error_messages

todo_routes = Blueprint('todos', __name__)


# ~~~~~~~~~~~ Get all todos by list id ~~~~~~~~~~~ 
@todo_routes.route('/<list_id>')
@login_required
def todos_for_list(list_id):
  todos = Todo.query.filter_by(list_id=list_id)
  return jsonify([todo.to_dict() for todo in todos])


# ~~~~~~~~~~~ Create a new todo ~~~~~~~~~~~ 


@todo_routes.route('/', methods=['POST'])
@login_required
def new_todo():
  form = TodoForm()
  form['csrf_token'].data = request.cookies['csrf_token']

  if form.validate_on_submit():
    todo = Todo(
      task=form.data['task'],
      list_id=form.data['list_id'],
      creator_id=form.data['creator_id'],
      completed=form.data['completed'],
      due=form.data['due']
    )
    db.session.add(todo)
    db.session.commit()
    return jsonify(todo.to_dict())
  return {'errors': validation_errors_to_error_messages(form.errors)}, 400

@todo_rotes.route('/<todo_id>', methods=['PUT'])
@login_required
def edit_todo(todo_id):

  form = TodoForm()
  form['csrf_token'].data = request.cookies['csrf_token']

  if form.validate_on_submit():
    todo = Todo.query.filter_by(id=todo_id).one()
    form_data = request.json()

    todo.task = form_data['task']
    todo.list_id = form_data['list_id']
    todo.creator_id = form_data['creator_id']
    todo.completed = form_data['completed']
    todo.due = form_data['due']
    db.session.commit()
    return jsonify(todo.to_dict())
  return {'errors': validation_errors_to_error_messages(form.errors)}, 400
